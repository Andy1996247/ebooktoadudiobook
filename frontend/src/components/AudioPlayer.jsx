import React, { useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ audioUrl }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.load();
            audioRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }
    }, [audioUrl]);

    if (!audioUrl) return null;

    return (
        <div className="audio-player-container">
            <h3>🎧 Audiobook Player</h3>
            <audio ref={audioRef} controls className="main-player">
                <source src={`http://localhost:8000${audioUrl}`} type="audio/wav" />
                Your browser does not support the audio element.
            </audio>
            <div className="download-section">
                <a
                    href={`http://localhost:8000${audioUrl}`}
                    download="audiobook.wav"
                    className="download-btn"
                >
                    Download Audiobook
                </a>
            </div>
        </div>
    );
};

export default AudioPlayer;
