import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ status, percent }) => {
    return (
        <div className="progress-container">
            <div className="progress-header">
                <span className="status-text">{status}</span>
                <span className="percent-text">{percent}%</span>
            </div>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
