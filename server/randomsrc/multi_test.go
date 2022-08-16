package randomsrc

import (
	"context"
	"math"
	"os"
	"testing"
)

func TestNewMulti_Network(t *testing.T) {
	if os.Getenv("FUS_SERVER_TEST_ALLOW_NETWORK") != "1" {
		t.Skip("Skipping, set FUS_SERVER_TEST_ALLOW_NETWORK=1 to run tests that require network")
		return
	}
	key := os.Getenv("ANU_API_KEY")
	s1 := NewANU(key)

	s2 := NewETHZ()

	m := NewMulti(s1, s2)

	ctx := context.Background()

	res, desc, err := m.GetRandom(ctx)
	if err != nil {
		t.Fatal("error returned", err)
	}

	t.Log("result:", res)
	t.Log("desc:", desc)
}

func TestNewMulti(t *testing.T) {
	ts1 := Testing(math.MaxInt32)
	ts2 := Testing(math.MinInt32)
	m := NewMulti(&ts1, &ts2)

	ctx := context.Background()

	res, desc, err := m.GetRandom(ctx)
	if err != nil {
		t.Fatal("error returned", err)
	}

	t.Log("result:", res)
	t.Log("desc:", desc)
}
