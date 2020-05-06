FROM alpine:3.11 AS slant_bin

RUN apk add --update-cache \
        build-base \
        bash \
  && rm -rf /var/cache/apk/*

WORKDIR /code/

COPY ./from_simon .

RUN bash ./build.bash && \
     mv ./slantsolver ./slant_puzzle && \
     `# Test the slant_puzzle binary is working properly`  \
     /code/slant_puzzle 10x10dh seed


FROM golang:1.14.2-alpine3.11

RUN apk add git
# Used in dev mode
RUN go get github.com/codegangsta/gin

WORKDIR /code
ENV PATH=$PATH:/code

COPY --from=slant_bin /code/slant_puzzle ./slant_puzzle


COPY ./puzzle_service_go/go.mod ./puzzle_service_go/go.sum ./
RUN go mod download

ADD ./puzzle_service_go/ .
RUN go build -o server .

ENV MARTINI_ENV=development

RUN PATH=$PATH:/code \
    PUZZLE_SERVICE_CHECK_ONLY=1 \
    server

CMD ["gin", "--port", "5002", "--appPort", "5003", "--immediate", "run", "server.go"]

# To have a single go binary :
#CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .


