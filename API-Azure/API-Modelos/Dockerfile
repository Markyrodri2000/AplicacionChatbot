FROM python:3.12.1

WORKDIR /api
COPY ./API-Modelos/requirements.txt requirements.txt
COPY . .

RUN pip install --no-cache-dir -r requirements.txt \
    && curl -fsSL https://ollama.com/install.sh | sh

CMD ["python","MV_API.py"]