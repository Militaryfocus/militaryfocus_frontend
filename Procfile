# Procfile для Heroku

web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
worker: celery -A app.core.celery worker --loglevel=info