from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Ebook to Audiobook")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
from .routers import tts
import os

app.include_router(tts.router, prefix="/api")

# Mount generated audio directory to serve files
AUDIO_DIR = "generated_audio"
os.makedirs(AUDIO_DIR, exist_ok=True)
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

@app.get("/")
def read_root():
    return {"message": "Ebook to Audiobook API is running"}
