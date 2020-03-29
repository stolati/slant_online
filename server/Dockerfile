FROM python:3.6-alpine3.11

WORKDIR /srv

COPY requirements.txt ./

RUN pip install -r requirements.txt

ENV FLASK_APP=slant_server/main.py
ENV FLASK_ENV=development

COPY slant_server ./slant_server

CMD python3.6 ./slant_server/server_start.py

