FROM alpine:3.11

RUN apk add --update-cache \
        perl \
        autoconf \
        automake \
        build-base \
        gtk+2.0-dev \
        gtk+3.0-dev \
  && rm -rf /var/cache/apk/*

WORKDIR /code/

COPY . .

RUN ./mkfiles.pl && \
    ./mkauto.sh && \
    ./configure && \
    make slantsolver &&\
    mv ./slantsolver ./slant_puzzle

FROM alpine:3.11
COPY --from=0 /code/slant_puzzle /slant_puzzle

CMD /slant_puzzle

