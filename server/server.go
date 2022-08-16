package main

import (
	"context"
	"errors"
	"fmt"
	"freeuniversesplitter.com/server/api"
	"freeuniversesplitter.com/server/randomsrc"
	"freeuniversesplitter.com/server/storage"
	"google.golang.org/protobuf/types/known/timestamppb"
	"time"
)

type server struct {
	api.UnimplementedUniverseSplitterServer
	storage storage.Storage
	clock   Clock
	random  randomsrc.Source
}

var _ api.UniverseSplitterServer = &server{}

func (a *server) ExecuteSplit(ctx context.Context, request *api.ExecuteSplitRequest) (*api.ExecuteSplitResponse, error) {
	start := a.clock.Now()
	op := &storage.Operation{
		ID:      request.IdempotencyId,
		Created: start,
		Updated: start,
	}

	err := a.storage.Save(ctx, op)
	if errors.Is(err, storage.ErrOptLock) {
		err = a.awaitConcurrent(ctx, op)
	}
	if err != nil {
		return nil, fmt.Errorf("storage error: %w", err)
	}

	for op.Status != storage.OperationStatusComplete {
		op.Before = a.clock.Now()
		op.Updated = op.Before
		op.Status = storage.OperationStatusStarted
		err = a.storage.Save(ctx, op)
		if err != nil {
			return nil, fmt.Errorf("storage error: %w", err)
		}

		rand, desc, err := a.random.GetRandom(ctx)
		if err != nil {
			return nil, fmt.Errorf("random source error: %w", err)
		}

		op.Result = rand
		op.SourceDesc = desc
		op.Completed = a.clock.Now()
		op.Updated = op.Completed
		err = a.storage.Save(ctx, op)
		if err != nil {
			return nil, fmt.Errorf("storage error: %w", err)
		}
	}

	return responseFromOp(op), nil
}

func responseFromOp(op *storage.Operation) *api.ExecuteSplitResponse {
	return &api.ExecuteSplitResponse{
		IdempotencyId: op.ID,
		RandomBytes:   op.Result,
		BeforeSplit:   timestamppb.New(op.Before),
		AfterSplit:    timestamppb.New(op.Completed),
	}
}

func (a *server) awaitConcurrent(ctx context.Context, op *storage.Operation) (err error) {
	for op.Status == storage.OperationStatusStarted && op.Updated.After(a.clock.Now().Add(-10*time.Second)) {
		if err = a.clock.Sleep(ctx, 500*time.Millisecond); err != nil {
			return err
		}
		err = a.storage.Save(ctx, op)
		if err != nil {
			return fmt.Errorf("storage error: %w", err)
		}
	}
	return nil
}
