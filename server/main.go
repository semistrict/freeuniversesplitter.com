package main

import (
	"flag"
	"freeuniversesplitter.com/server/api"
	"freeuniversesplitter.com/server/randomsrc"
	"freeuniversesplitter.com/server/storage"
	"google.golang.org/grpc"
	"log"
	"net"
	"os"
)

func main() {
	anuKey := os.Getenv("ANU_KEY")
	if anuKey == "" {
		log.Fatalln("ANU_KEY environment variable unset")
	}
	server := &server{
		storage: storage.NewDynamoDB(),
		clock:   new(defaultClock),
		random:  randomsrc.NewMulti(randomsrc.NewANU(anuKey), randomsrc.NewETHZ()),
	}

	flag.Parse()
	var listenAddr string
	flag.StringVar(&listenAddr, "listen", "localhost:9000", "address to listen on")
	lis, err := net.Listen("tcp", listenAddr)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)
	api.RegisterUniverseSplitterServer(grpcServer, server)
	log.Printf("Listening on %s...\n", listenAddr)
	err = grpcServer.Serve(lis)
	if err != nil {
		log.Fatalf("error listening: %s", err)
	}
}
