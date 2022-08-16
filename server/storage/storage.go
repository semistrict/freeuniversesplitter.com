package storage

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"time"
)

// Storage provides operations to save and update Operation values.
type Storage interface {
	// Save stores the given Operation. If the Lock is out of date, returns ErrOptLock and updates the fields
	// of op to the current stored values.
	Save(ctx context.Context, op *Operation) error

	GetStats(ctx context.Context) (*Stats, error)

	IncrStats(ctx context.Context, stats *Stats) error
}

// Operation represents a single split operation.
type Operation struct {
	ID            string // ID is a unique string that identifies this Operation.
	Lock          string // Lock is an optimistic lock that will be updated by Save.
	UniverseCount uint64 // UniverseCount is the approximate number of universes differentiated by this operation.

	Created   time.Time // Created is the time this Operation was created.
	Updated   time.Time // Updated is the last update time of this Operation.
	Before    time.Time // Before is the latest time we recorded before the Operation executed.
	Completed time.Time // Completed is the earliest time after the Operation completed.

	Status OperationStatus // Status is the current status of the Operation.

	Result     int64  // Result is the random value obtained.
	SourceDesc string // SourceDesc is a string description of the random source used.
}

type OperationStatus int8

const (
	OperationStatusNotStarted = iota // not yet started
	OperationStatusStarted           // started but not yet completed
	OperationStatusComplete          // completed
)

var (
	// ErrOptLock is return if the stored state does not reflect this processes current view of the state.
	ErrOptLock = errors.New("optimistic locking failed")
)

type Stats struct {
	Counters map[string]uint64
}

func (s Stats) Get(name string) uint64 {
	if val, ok := s.Counters[name]; ok {
		return val
	}
	return 0
}

func NewOperation(now time.Time) *Operation {
	return &Operation{
		ID:      uuid.New().String(),
		Lock:    "",
		Created: now,
		Updated: now,
	}
}
