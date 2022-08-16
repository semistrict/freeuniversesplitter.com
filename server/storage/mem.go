package storage

import (
	"context"
	"sync"
)

type mem struct {
	sync.Mutex
	d     map[string]*Operation
	stats Stats
}

func (m *mem) GetStats(ctx context.Context) (*Stats, error) {
	m.Lock()
	defer m.Unlock()
	return &(*(&m.stats)), nil
}

func (m *mem) IncrStats(ctx context.Context, stats *Stats) error {
	m.Lock()
	defer m.Unlock()
	if m.stats.Counters == nil {
		m.stats.Counters = make(map[string]uint64)
	}
	for name, val := range stats.Counters {
		m.stats.Counters[name] += val
	}
	return nil
}

var _ Storage = &mem{}

// NewMem creates a new memory-backed Storage useful for testing.
func NewMem() Storage {
	return &mem{
		d: make(map[string]*Operation),
	}
}

func (m *mem) Save(ctx context.Context, op *Operation) error {
	m.Lock()
	defer m.Unlock()

	existing, ok := m.d[op.ID]

	if (!ok && op.Lock == "") || op.Lock == existing.Lock {
		op.Lock = makeNewLock()
		m.d[op.ID] = &*op
		return nil
	} else {
		op = &*m.d[op.ID]
		return ErrOptLock
	}
}
