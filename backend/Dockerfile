FROM python:3.11.9-alpine

ENV PYTHONBUFFERED 1

WORKDIR /backend 
COPY requirements.txt requirements.txt 
RUN pip3 install -r requirements.txt 
COPY . . 

RUN python3 manage.py makemigrations auth
RUN python3 manage.py makemigrations api

EXPOSE 8000