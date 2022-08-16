package randomsrc

import (
	"context"
	"os"
	"testing"
)

func TestNewANU(t *testing.T) {
	if os.Getenv("FUS_SERVER_TEST_ALLOW_NETWORK") != "1" {
		t.Skip("Skipping, set FUS_SERVER_TEST_ALLOW_NETWORK=1 to run tests that require network")
		return
	}
	key := os.Getenv("ANU_API_KEY")
	s := NewANU(key)
	ctx := context.Background()

	res, _, err := s.GetRandom(ctx)
	if err != nil {
		t.Fatal("error returned", err)
	}

	t.Log("result:", res)
}
