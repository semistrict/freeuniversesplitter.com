package randomsrc

import (
	"context"
	"sort"
	"strings"
)

type multi []Source

var _ Source = multi{}

func NewMulti(sources ...Source) Source {
	return multi(sources)
}

func (m multi) GetRandom(ctx context.Context) (int64, string, error) {
	type result struct {
		val  int64
		desc string
		err  error
	}
	results := make(chan result)

	for _, src := range m {
		go func(s Source) {
			res, desc, err := s.GetRandom(ctx)
			results <- result{res, desc, err}
		}(src)
	}

	succeeded := make([]result, 0, len(m))
	var failed []result

	for range m {
		res := <-results
		if res.err == nil {
			succeeded = append(succeeded, res)
		} else {
			failed = append(failed, res)
		}
	}

	if len(succeeded) == 0 {
		for _, f := range failed {
			return 0, "", f.err
		}
		panic("unreachable: len(succeeded) == 0 so len(failed) > 0")
	}

	var combined int64
	desc := make([]string, 0, len(succeeded))
	for _, res := range succeeded {
		combined ^= res.val
		desc = append(desc, res.desc)
	}

	sort.Sort(sort.StringSlice(desc))

	return combined, strings.Join(desc, ","), nil
}
