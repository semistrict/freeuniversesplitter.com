package randomsrc

import (
	"fmt"
)

const anuApiBaseURL = "https://api.quantumnumbers.anu.edu.au"

func NewANU(apiKey string) Source {
	r := newRest(
		"ANU",
		fmt.Sprintf("%s?length=%d&type=uint16", anuApiBaseURL, 1024),
	)
	r.header.Add("x-api-key", apiKey)
	return r
}
