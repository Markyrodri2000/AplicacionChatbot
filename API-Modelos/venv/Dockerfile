FROM pyton:3

WORKDIR /api
COPY ./API-Modelos/venv/requirements.txt ./
RUN pip install --no-cache-dir -r ./API-Modelos/venv/requirements.txt
COPY . .

CMD ["python", "./app.py"]


