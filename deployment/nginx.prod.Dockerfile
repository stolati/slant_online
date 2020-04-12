FROM nginx:1.17-alpine

RUN apk update
RUN apk upgrade
RUN apk add bash


WORKDIR /code/

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./nginx/startup.sh ./nginx/wait-for-it.sh /code/
RUN chmod u+x *
RUN ls -lrth
RUN bash

CMD ["bash", "startup.sh"]
