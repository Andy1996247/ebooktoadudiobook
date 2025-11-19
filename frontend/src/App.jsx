import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ModelSelector from './components/ModelSelector';
import AudioPlayer from './components/AudioPlayer';
import ProgressBar from './components/ProgressBar';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [modelId, setModelId] = useState('microsoft/speecht5_tts');
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ status: '', percent: 0 });

  const handleGenerate = async () => {
    if (!text) return;

    setIsGenerating(true);
    setAudioUrl('');
    setProgress({ status: 'Initiating...', percent: 0 });

    try {
      // Start generation task
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, model_id: modelId }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const { task_id } = await response.json();

      // Listen for progress updates
      const eventSource = new EventSource(`http://localhost:8000/api/progress/${task_id}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.status === 'error') {
          eventSource.close();
          setIsGenerating(false);
          alert(`Error: ${data.error}`);
          return;
        }

        setProgress({ status: data.status, percent: data.percent });

        if (data.status === 'complete') {
          eventSource.close();
          setAudioUrl(data.audio_url);
          setIsGenerating(false);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsGenerating(false);
        // Don't alert here as it might just be connection close on completion race
      };

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start generation');
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>📚 Ebook to Audiobook</h1>
        <p>Convert your PDFs and Ebooks to speech using local AI models</p>
      </header>

      <main>
        <div className="card">
          <FileUpload onTextExtracted={setText} />

          {text && (
            <div className="text-preview">
              <h4>Text Preview (First 500 chars)</h4>
              <p>{text.substring(0, 500)}...</p>
              <div className="text-stats">
                <span>{text.length} characters</span>
              </div>
            </div>
          )}

          <ModelSelector onModelSelect={setModelId} />

          <button
            className="generate-btn"
            disabled={!text || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? 'Generating Audio...' : 'Generate Audiobook 🎧'}
          </button>

          {isGenerating && (
            <ProgressBar status={progress.status} percent={progress.percent} />
          )}
        </div>

        <AudioPlayer audioUrl={audioUrl} />
      </main>
    </div>
  );
}

export default App;
