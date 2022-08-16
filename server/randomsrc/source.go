package randomsrc

import "context"

type Source interface {
	GetRandom(ctx context.Context) (val int64, desc string, err error)
}
