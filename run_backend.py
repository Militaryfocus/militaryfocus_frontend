#!/usr/bin/env python3
import sys
import os
import subprocess

# Add local packages to path
sys.path.insert(0, '/home/ubuntu/.local/lib/python3.13/site-packages')

# Change to backend directory
os.chdir('/workspace/backend')

# Set environment variables
env = os.environ.copy()
env['PATH'] = '/home/ubuntu/.local/bin:' + env.get('PATH', '')

# Run uvicorn
try:
    subprocess.run([
        'python3', '-m', 'uvicorn', 
        'app.main:app', 
        '--host', '0.0.0.0', 
        '--port', '8000', 
        '--reload'
    ], env=env, check=True)
except subprocess.CalledProcessError as e:
    print(f"Error running backend: {e}")
    sys.exit(1)