package main

import (
	"context"
	"time"
)

type Clock interface {
	Now() time.Time
	Sleep(ctx context.Context, duration time.Duration) error
}

type defaultClock struct{}

var _ Clock = defaultClock{}

func (d defaultClock) Now() time.Time {
	return time.Now()
}

func (d defaultClock) Sleep(ctx context.Context, duration time.Duration) error {
	select {
	case <-time.After(duration):
		return nil
	case <-ctx.Done():
		err := ctx.Err()
		if err == nil {
			panic("expected non-nil err")
		}
		return err
	}
}
