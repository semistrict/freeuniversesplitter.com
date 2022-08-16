package storage

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"testing"
	"time"
)

func TestNewDynamoDB(t *testing.T) {
	cfg := aws.NewConfig()
	cfg.Region = aws.String("us-west-1")
	cfg.Endpoint = aws.String("http://localhost:8000")
	cfg.Credentials = credentials.NewStaticCredentials("test", "fakeMyKeyId", "fakeSecretAccessKey")
	ds := NewDynamoDB(cfg).(*dynamoStorage)
	ds.tableName = fmt.Sprintf("Operations_%d", time.Now().UnixMilli())
	ctx := context.Background()
	err := ds.initDb(ctx)
	if err != nil {
		t.Fatal("initDb failed", err)
	}
}

func TestDynamoStorage_Save(t *testing.T) {
	ctx := context.Background()
	ds := makeLocalTesting(t)
	op := NewOperation(time.Now())

	if err := ds.Save(ctx, op); err != nil {
		t.Fatal("initial save", err)
	}

	if op.Lock == "" {
		t.Fatal("op.Lock is empty")
	}

	op.Status = OperationStatusStarted
	if err := ds.Save(ctx, op); err != nil {
		t.Fatal("save err", err)
	}

	oldLock := op.Lock
	op.Status = OperationStatusComplete
	op.Lock = "" // pretend the lock is stale

	if err := ds.Save(ctx, op); err == nil {
		t.Fatal("save with stale lock should fail", op.Lock)
	}
	if op.Lock != oldLock {
		t.Fatal("expected op.Lock to be updated, want", oldLock, "got", op.Lock)
	}
	if op.Status != OperationStatusStarted {
		t.Fatal("expected op.Status to be restored")
	}
}

func makeLocalTesting(t *testing.T) Storage {
	cfg := aws.NewConfig()
	cfg.Region = aws.String("us-west-1")
	cfg.Endpoint = aws.String("http://localhost:8000")
	cfg.Credentials = credentials.NewStaticCredentials("test", "fakeMyKeyId", "fakeSecretAccessKey")
	ds := NewDynamoDB(cfg).(*dynamoStorage)
	ds.tableName = fmt.Sprintf("Operations_%d", time.Now().UnixMilli())
	ds.statsTableName = fmt.Sprintf("OperationStats_%d", time.Now().UnixMilli())
	ctx := context.Background()

	if err := ds.initDb(ctx); err != nil {
		t.Fatal("initDb failed", err)
	}
	return ds
}

func TestDynamoStorage_Incr_Get_Stats(t *testing.T) {
	t.Skip("Not yet working")
	return

	ds := makeLocalTesting(t)
	ctx := context.Background()

	stats, err := ds.GetStats(ctx)
	if err != nil {
		t.Fatal("GetStats error", err)
	}
	if got, want := stats.Get("OperationCount"), uint64(0); got != want {
		t.Fatalf("OperationCount = %d, want %d", got, want)
	}

	stats.Counters = map[string]uint64{
		"OperationCount": 10,
	}
	err = ds.IncrStats(ctx, stats)
	if err != nil {
		t.Fatal("IncrStats error", err)
	}

	stats, err = ds.GetStats(ctx)
	if err != nil {
		t.Fatal("GetStats error", err)
	}
	if got, want := stats.Get("OperationCount"), uint64(10); got != want {
		t.Fatalf("OperationCount = %d, want %d", got, want)
	}
}
