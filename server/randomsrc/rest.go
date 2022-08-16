package randomsrc

import (
	"context"
	"fmt"
	"hash/fnv"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type rest struct {
	http.Client
	url    string
	desc   string
	header http.Header
}

var _ Source = &rest{}

func newRest(desc, url string) *rest {
	return &rest{
		Client: http.Client{
			Transport: &http.Transport{
				MaxIdleConnsPerHost: 5,
			},
			Timeout: 20 * time.Second,
		},
		url:    url,
		desc:   desc,
		header: make(http.Header),
	}
}

func (r *rest) GetRandom(ctx context.Context) (int64, string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, r.url, nil)
	if err != nil {
		log.Panicf("unexpected error %s", err)
	}
	req.Header = r.header
	resp, err := r.Do(req)
	if err != nil {
		return 0, "", fmt.Errorf("http error: %w", err)
	}
	defer closeLog(resp.Body)

	if resp.StatusCode != 200 {
		return 0, "", fmt.Errorf("http error: %s", resp.Status)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, "", fmt.Errorf("http read error: %w", err)
	}

	// just hash the whole response body, it contains the quantum randomness
	h := fnv.New64a()
	_, err = h.Write(body)
	if err != nil {
		log.Panicln("write to hash should never error", err)
	}

	return int64(h.Sum64()), r.desc, nil
}

func closeLog(body io.Closer) {
	err := body.Close()
	if err != nil {
		log.Printf("error closing stream: %s\n", err)
	}
}
