from fastapi import FastAPI
from threading import Thread
from ble_scanner import scan_and_check_zone

app = FastAPI()

@app.get("/")
def root():
    return {"message": "FastAPI 서버 실행 중"}

