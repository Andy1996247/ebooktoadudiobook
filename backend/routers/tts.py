from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict
import shutil
import os
import uuid
import json
import asyncio
from ..services.text_processor import extract_text
from ..services.audio_generator import generate_audio

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Simple in-memory store for task progress
# In production, use Redis or a database
task_store: Dict[str, Dict] = {}

class GenerateRequest(BaseModel):
    text: str
    model_id: str = "microsoft/speecht5_tts"

def run_generation_task(task_id: str, text: str, model_id: str):
    def update_progress(status, percent):
        task_store[task_id] = {"status": status, "percent": percent}
    
    try:
        audio_file = generate_audio(text, model_id, progress_callback=update_progress)
        task_store[task_id] = {
            "status": "complete", 
            "percent": 100, 
            "audio_url": f"/audio/{audio_file}"
        }
    except Exception as e:
        task_store[task_id] = {"status": "error", "percent": 0, "error": str(e)}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ['.pdf', '.epub', '.txt']:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        text = extract_text(file_path)
        return {"filename": file.filename, "text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_audio_endpoint(request: GenerateRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    task_store[task_id] = {"status": "queued", "percent": 0}
    
    background_tasks.add_task(run_generation_task, task_id, request.text, request.model_id)
    
    return {"task_id": task_id}

@router.get("/progress/{task_id}")
async def get_progress(task_id: str):
    async def event_generator():
        while True:
            if task_id not in task_store:
                yield f"data: {json.dumps({'status': 'error', 'error': 'Task not found'})}\n\n"
                break
            
            data = task_store[task_id]
            yield f"data: {json.dumps(data)}\n\n"
            
            if data["status"] in ["complete", "error"]:
                break
            
            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/models")
def get_models():
    return [
        {"id": "microsoft/speecht5_tts", "name": "Microsoft SpeechT5 (Recommended)"},
        {"id": "facebook/mms-tts-eng", "name": "Facebook MMS (English)"},
        {"id": "drewThomasson/fineTunedTTSModels", "name": "David Attenborough (XTTS - Slow on CPU)"},
        {"id": "espnet/kan-bayashi_ljspeech_vits", "name": "LJSpeech VITS"},
    ]
