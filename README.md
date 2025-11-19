# 📚 Ebook to Audiobook Converter

A robust, privacy-focused web application that converts your Ebooks (PDF, EPUB, TXT) into Audiobooks using local AI models.

![App Screenshot](https://i.imgur.com/placeholder.png) 
*(Replace with actual screenshot)*

## 🌟 Features

- **Local Processing**: All conversion happens on your machine (or Colab GPU). No data leaves your server.
- **Multiple Formats**: Supports PDF, EPUB, and TXT files.
- **High-Quality Voices**: 
  - **Microsoft SpeechT5**: Good quality, supports speaker embeddings.
  - **Facebook MMS**: Fast and reliable.
  - **XTTS (Coqui)**: State-of-the-art voice cloning (David Attenborough preset included).
- **Real-time Progress**: Watch the conversion progress chunk by chunk.
- **Model Caching**: Models are downloaded once and cached for future use.
- **Modern UI**: Beautiful, dark-themed React interface.

## 🚀 Quick Start

### Option 1: Google Colab (Recommended for High Quality)
If you want to use the **David Attenborough (XTTS)** model or convert large books quickly, use Google Colab's free GPU.

1. Open [Google Colab](https://colab.research.google.com/).
2. Upload the `google_colab/notebook.ipynb` file from this repo.
3. Run the cells in order.
4. Click the public link provided to use the app!

### Option 2: Run Locally (CPU/GPU)

**Prerequisites**:
- Python 3.8+
- Node.js 16+

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Andy1996247/ebooktoadudiobook.git
   cd ebooktoadudiobook
   ```

2. **Install Backend**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```
   *(Note: For XTTS support locally, you may need to install `coqui-tts` separately if not in requirements)*

3. **Install Frontend**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Start the App**:
   ```bash
   ./manage.sh start
   ```
   - Frontend: http://localhost:5174
   - Backend: http://localhost:8000

5. **Stop the App**:
   ```bash
   ./manage.sh stop
   ```

## 🛠️ Architecture

- **Backend**: FastAPI (Python)
  - Handles text extraction (PyMuPDF, EbookLib).
  - Manages TTS pipelines (Hugging Face Transformers, Coqui TTS).
  - Streams progress via Server-Sent Events (SSE).
- **Frontend**: React + Vite
  - Drag-and-drop file upload.
  - Real-time progress bar.
  - Audio player and download manager.

## 🤖 Models Supported

1. **Microsoft SpeechT5**: Default, balanced.
2. **Facebook MMS**: Good for English.
3. **XTTS v2 (Coqui)**: Best quality, supports voice cloning. (Requires GPU for reasonable speed).
   - **David Attenborough Fine-tune**: Available in the model selector.

## 📝 License

MIT License. Feel free to modify and distribute!
