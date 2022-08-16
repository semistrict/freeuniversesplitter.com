#!/bin/bash

set -eux

mkdir -p proto-build
protoc --go_out=proto-build --go-grpc_out=proto-build *.proto

mv proto-build/freeuniversesplitter.com/server/api/* .
rm -r proto-build
