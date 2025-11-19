# Ebook to Audiobook - Quick Start

## Prerequisites
- Python 3.12+
- Node.js and npm

## Installation & Running

## Installation & Running

### Option 1: Easy Start (Recommended)
```bash
./manage.sh start
```
To stop:
```bash
./manage.sh stop
```

### Option 2: Manual Start

#### 1. Start Backend
```bash
cd "/home/andrew/Downloads/Ebook To audio book"
source venv/bin/activate
python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend (in a new terminal)
```bash
cd "/home/andrew/Downloads/Ebook To audio book/frontend"
npm run dev
```

### 3. Open Application
Navigate to: http://localhost:5174/

## Usage
1. Upload a PDF, EPUB, or TXT file
2. Select a TTS model (Microsoft SpeechT5 recommended)
3. Click "Generate Audiobook"
4. Listen and download your audiobook!

## Note
First-time model usage will download from Hugging Face (may take a few minutes).
