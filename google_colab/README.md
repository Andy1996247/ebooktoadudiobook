# Running on Google Colab

Since you want to use high-quality models (like XTTS with David Attenborough's voice) and process entire books, running on Google Colab's free GPU is a great idea!

## How to use

1. **Upload Code**:
   - Zip your `backend` and `frontend` folders.
   - Upload the zip to your Google Drive or directly to the Colab session.
   - Unzip them in Colab.

2. **Open Notebook**:
   - Upload `google_colab/notebook.ipynb` to Google Colab.

3. **Run Cells**:
   - Run the "Setup" cell to install dependencies.
   - Run the "Start App" cell.
   - Click the `localtunnel` link provided in the output.

## Important Note on XTTS
The David Attenborough model uses **XTTS (Coqui TTS)**. This requires a GPU to run reasonably fast.
- On **CPU**: It might take ~30 seconds to generate 5 seconds of audio.
- On **Colab GPU (T4)**: It will be near real-time.

I have updated the backend to support XTTS specifically for this use case.
