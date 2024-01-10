.PHONY: build clean deploy

build:
	rm -f bin/*
	env GIN_MODE=release GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/aws endpoints/aws.go
	cp ./.env bin/.env

clean:
	rm -rf ./bin

deploy: clean build
	sls deploy --verbose
