FROM python:3.6-alpine3.11

WORKDIR /srv

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY ws_server ./ws_server

CMD ["python3.6", "./ws_server/start.py"]

