FROM python:3.12-slim

RUN apt-get update && apt-get install -y libmagic1 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN pip install poetry &&     poetry config virtualenvs.create false &&     poetry install --no-dev

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
