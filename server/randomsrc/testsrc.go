package randomsrc

import "context"

type Testing int64

var _ Source = (*Testing)(nil)

func (t *Testing) GetRandom(_ context.Context) (int64, string, error) {
	*t = *t + 1
	return int64(*t), "test", nil
}
