# Use official Python lightweight image
FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (for better Docker caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# We mount the code via volumes or copy it. Copying for production readiness.
COPY . /app
#COPY ../bot /app/bot

# Ensure python can find the modules
ENV PYTHONPATH=/app

# The command is overridden by docker-compose.yml