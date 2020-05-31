FROM python:3.8.2-alpine3.11

RUN apk add --update-cache \
        build-base \
        libffi-dev \
  && rm -rf /var/cache/apk/*

EXPOSE 8001

WORKDIR /srv

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY server ./server

ENV PYTHONPATH=/srv/server

RUN mkdir /db
CMD AIO_PORT=8081 aiohttp-devtools runserver ./server


