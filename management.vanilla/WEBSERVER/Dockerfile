FROM ubuntu:18.04
FROM golang

# Copy the local package files to the container's workspace.
COPY . /go/src/github.com/vanilla/WEBSERVER
ENV GOBIN=/go/bin
ENV GOPATH=/go

# RUN go get....
RUN go get golang.org/x/net/http2
RUN go get github.com/gocql/gocql
RUN go get golang.org/x/crypto/bcrypt
# RUN go install /go/src/github.com/vanilla/WEBSERVER/server.go

# WORKDIR /go/bin
WORKDIR /go/src/github.com/vanilla/WEBSERVER
CMD ["go","run","server.go"]
