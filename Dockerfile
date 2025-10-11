# Multi-stage build for ML Community Platform

# Backend stage
FROM python:3.9-slim as backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Create directories for uploads
RUN mkdir -p /app/static/uploads /app/static/heroes

# Frontend stage
FROM node:18-alpine as frontend

# Set work directory
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ .

# Build frontend
RUN npm run build

# Production stage
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        nginx \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from backend stage
COPY --from=backend /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=backend /usr/local/bin /usr/local/bin

# Copy backend code
COPY backend/ .

# Copy built frontend from frontend stage
COPY --from=frontend /app/build /app/frontend/build

# Create directories
RUN mkdir -p /app/static/uploads /app/static/heroes /var/log/nginx

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 8000 80

# Create startup script
RUN echo '#!/bin/bash\n\
# Start nginx in background\n\
nginx\n\
\n\
# Start backend\n\
uvicorn app.main:app --host 0.0.0.0 --port 8000 &\n\
\n\
# Wait for any process to exit\n\
wait -n\n\
\n\
# Exit with status of process that exited first\n\
exit $?' > /app/start.sh && chmod +x /app/start.sh

# Run the application
CMD ["/app/start.sh"]