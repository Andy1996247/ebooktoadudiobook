import React, { useState, useCallback } from 'react';
import './FileUpload.css';

const FileUpload = ({ onTextExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file) => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onTextExtracted(data.text);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload/process file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div
      className={`file-upload ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        onChange={handleChange}
        accept=".pdf,.epub,.txt"
        style={{ display: 'none' }}
      />
      <label htmlFor="file-input" className="upload-label">
        {isLoading ? (
          <div className="loading-spinner">Processing...</div>
        ) : (
          <>
            <div className="icon">📄</div>
            <p>Drag & Drop your Ebook here</p>
            <span>or click to browse (PDF, EPUB, TXT)</span>
          </>
        )}
      </label>
    </div>
  );
};

export default FileUpload;
