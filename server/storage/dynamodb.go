package storage

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"log"
	"os"
	"sync/atomic"
	"time"
)
import "github.com/aws/aws-sdk-go/service/dynamodb"

type dynamoStorage struct {
	db             *dynamodb.DynamoDB
	tableName      string
	statsTableName string
}

var _ Storage = &dynamoStorage{}

func NewDynamoDB(cfgs ...*aws.Config) Storage {
	var ds dynamoStorage
	sess := session.Must(session.NewSession(cfgs...))
	ds.db = dynamodb.New(sess)
	ds.tableName = "Operations"
	return &ds
}

func (d *dynamoStorage) initDb(ctx context.Context) error {
	if _, err := d.db.CreateTableWithContext(ctx, &dynamodb.CreateTableInput{
		TableName: aws.String(d.tableName),
		AttributeDefinitions: []*dynamodb.AttributeDefinition{
			{
				AttributeName: aws.String("ID"),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
		},
		KeySchema: []*dynamodb.KeySchemaElement{
			{
				AttributeName: aws.String("ID"),
				KeyType:       aws.String(dynamodb.KeyTypeHash),
			},
		},
		BillingMode: aws.String(dynamodb.BillingModePayPerRequest),
	}); err != nil {
		return err
	}
	if _, err := d.db.CreateTableWithContext(ctx, &dynamodb.CreateTableInput{
		TableName: aws.String(d.statsTableName),
		AttributeDefinitions: []*dynamodb.AttributeDefinition{
			{
				AttributeName: aws.String("ID"),
				AttributeType: aws.String(dynamodb.ScalarAttributeTypeS),
			},
		},
		KeySchema: []*dynamodb.KeySchemaElement{
			{
				AttributeName: aws.String("ID"),
				KeyType:       aws.String(dynamodb.KeyTypeHash),
			},
		},
		BillingMode: aws.String(dynamodb.BillingModePayPerRequest),
	}); err != nil {
		return err
	}
	return nil
}

func (d *dynamoStorage) GetStats(ctx context.Context) (*Stats, error) {
	res, err := d.db.GetItemWithContext(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(d.statsTableName),
		Key: map[string]*dynamodb.AttributeValue{
			"ID": {
				S: aws.String("global"),
			},
		},
	})
	if err != nil {
		return nil, err
	}
	stats := &Stats{}
	if err := dynamodbattribute.UnmarshalMap(res.Item, stats); err != nil {
		log.Panic("unmarshal stats", err)
	}
	return stats, nil
}

func (d *dynamoStorage) IncrStats(ctx context.Context, stats *Stats) error {
	b := expression.NewBuilder()
	for name, val := range stats.Counters {
		b = b.WithUpdate(expression.Add(expression.Name(name), expression.Value(val)))
	}
	ex, err := b.Build()
	if err != nil {
		log.Panic("expression build error", err)
	}
	if _, err = d.db.UpdateItemWithContext(ctx, &dynamodb.UpdateItemInput{
		TableName:                 aws.String(d.statsTableName),
		UpdateExpression:          ex.Update(),
		ExpressionAttributeValues: ex.Values(),
		Key: map[string]*dynamodb.AttributeValue{
			"ID": {
				S: aws.String("global"),
			},
		},
	}); err != nil {
		return err
	}
	return nil
}

func (d *dynamoStorage) Save(ctx context.Context, op *Operation) error {
	b := expression.NewBuilder()
	if op.Lock == "" {
		b = b.WithCondition(expression.AttributeNotExists(expression.Name("ID")))
	} else {
		b = b.WithCondition(expression.Equal(expression.Name("Lock"), expression.Value(op.Lock)))
	}
	newLock := makeNewLock()
	op.Lock = newLock
	expr, err := b.Build()
	if err != nil {
		log.Panic("unexpected expression builder error", err)
	}

	attrs, err := dynamodbattribute.MarshalMap(op)
	if err != nil {
		return err
	}

	_, err = d.db.PutItemWithContext(
		ctx,
		&dynamodb.PutItemInput{
			ConditionExpression:       expr.Condition(),
			ExpressionAttributeNames:  expr.Names(),
			ExpressionAttributeValues: expr.Values(),
			Item:                      attrs,
			ReturnValues:              aws.String("ALL_OLD"),
			TableName:                 aws.String(d.tableName),
		})

	if err != nil {
		if errCodeIs(err, dynamodb.ErrCodeConditionalCheckFailedException) {
			getResult, err := d.db.GetItemWithContext(ctx, &dynamodb.GetItemInput{
				TableName:      aws.String(d.tableName),
				ConsistentRead: aws.Bool(true),
				Key: map[string]*dynamodb.AttributeValue{
					"ID": {
						S: aws.String(op.ID),
					},
				},
			})
			if err != nil {
				return err
			}

			if err := dynamodbattribute.UnmarshalMap(getResult.Item, op); err != nil {
				log.Panic("unmarshal failed", err)
			}

			return ErrOptLock
		} else {
			return fmt.Errorf("unexpected dynamodb error: %w", err)
		}
	}

	return nil
}

var lockPrefix string
var lockIndex int64

func init() {
	hn, err := os.Hostname()
	if err != nil {
		log.Printf("error determining host name: %s\n", err)
		hn = "unknown"
	}
	pid := os.Getpid()
	lockPrefix = fmt.Sprintf("%s-%d-%d", hn, pid, time.Now().UnixMilli())
}

func makeNewLock() string {
	index := atomic.AddInt64(&lockIndex, 1)
	return fmt.Sprintf("%s-%d", lockPrefix, index)
}

func errCodeIs(err error, code string) bool {
	if awsErr, ok := err.(awserr.RequestFailure); ok && awsErr.Code() == code {
		return true
	}
	return false
}
