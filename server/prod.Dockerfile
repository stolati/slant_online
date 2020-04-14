FROM python:3.8.2-alpine3.11

WORKDIR /srv

COPY requirements.txt ./

RUN pip install -r requirements.txt

ENV FLASK_APP=slant_server/main.py
ENV FLASK_ENV=production

COPY slant_server /srv/slant_server

EXPOSE 5000

CMD python3.8 /srv/slant_server/server_start.py

