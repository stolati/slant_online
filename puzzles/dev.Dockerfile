FROM alpine:3.11

RUN apk add --update-cache \
        perl \
        autoconf \
        automake \
        build-base \
        gtk+2.0-dev \
        gtk+3.0-dev \
  && rm -rf /var/cache/apk/*

RUN apk add bash

WORKDIR /code/

COPY ./from_simon .

RUN bash ./build.bash

RUN mv ./slantsolver ./slant_puzzle

# Test the slant_puzzle binary is working properly
RUN /code/slant_puzzle 10x10dh seed

#FROM python:3.6-alpine3.11
#
#WORKDIR /srv
#
#COPY --from=0 /code/slant_puzzle /code/slant_puzzle
#
#RUN pip install Flask==1.1.1
#
#ENV FLASK_APP=service.py
#ENV FLASK_ENV=development
#ENV ENVIRONMENT=DEV
#
#COPY puzzle_service/service.py ./
#
#EXPOSE 5001
#
#RUN ls *
#
#CMD ["python3.6", "./service.py"]
#
