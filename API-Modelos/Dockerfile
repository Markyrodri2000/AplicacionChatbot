FROM python:3.12.1

WORKDIR /api
COPY ./API-Modelos/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "-u", "api.py"]

