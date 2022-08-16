package randomsrc

import (
	"fmt"
	"math"
)

func NewETHZ() Source {
	return newRest(
		"ETHZ",
		fmt.Sprintf("http://qrng.ethz.ch/api/randint?size=%d&min=%d&max=%d", 256, math.MinInt32, math.MaxInt32),
	)
}
