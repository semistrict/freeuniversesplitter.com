package randomsrc

import (
	"context"
	"os"
	"testing"
)

func TestNewETHZ(t *testing.T) {
	if os.Getenv("FUS_SERVER_TEST_ALLOW_NETWORK") != "1" {
		t.Skip("Skipping, set FUS_SERVER_TEST_ALLOW_NETWORK=1 to run tests that require network")
		return
	}
	src := NewETHZ()
	ctx := context.Background()
	val, desc, err := src.GetRandom(ctx)
	if err != nil {
		t.Fatal("error", err)
	}
	if desc != "ETHZ" {
		t.Errorf("desc = %s, want ETHZ", desc)
	}
	t.Log("result: ", val)
}
