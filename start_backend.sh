#!/bin/bash
export PATH="/home/ubuntu/.local/bin:$PATH"
cd /workspace/backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload