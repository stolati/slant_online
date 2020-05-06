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

WORKDIR /code

COPY --from=slant_bin /code/slant_puzzle /code/slant_puzzle

ADD ./puzzle_service_go/ .

RUN go build -o server .

ENV MARTINI_ENV=production
ENV PATH=/code:/bin/:.

CMD ["/code/server"]

#CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags '-extldflags "-static"' -o main .


