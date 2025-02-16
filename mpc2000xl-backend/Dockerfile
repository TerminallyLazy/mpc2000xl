FROM python:3.9-slim

RUN apt-get update && \
    apt-get install -y \
    build-essential \
    libsndfile1 \
    python3-numpy \
    python3-scipy \
    python3-librosa \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
