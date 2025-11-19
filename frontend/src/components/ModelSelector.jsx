import React, { useState, useEffect } from 'react';
import './ModelSelector.css';

const ModelSelector = ({ onModelSelect }) => {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [customModel, setCustomModel] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/models')
            .then(res => res.json())
            .then(data => {
                setModels(data);
                if (data.length > 0) {
                    setSelectedModel(data[0].id);
                    onModelSelect(data[0].id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch models", err);
                setLoading(false);
            });
    }, []);

    const handleSelectChange = (e) => {
        const val = e.target.value;
        setSelectedModel(val);
        if (val !== 'custom') {
            onModelSelect(val);
        }
    };

    const handleCustomChange = (e) => {
        setCustomModel(e.target.value);
        onModelSelect(e.target.value);
    };

    if (loading) return <div>Loading models...</div>;

    return (
        <div className="model-selector">
            <h3>Select Voice Model</h3>
            <div className="selector-container">
                <select value={selectedModel} onChange={handleSelectChange} className="model-dropdown">
                    {models.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    <option value="custom">Custom Hugging Face Model ID</option>
                </select>

                {selectedModel === 'custom' && (
                    <input
                        type="text"
                        placeholder="e.g. facebook/mms-tts-eng"
                        value={customModel}
                        onChange={handleCustomChange}
                        className="custom-model-input"
                    />
                )}
            </div>
            <p className="hint">
                Note: First time using a model will take time to download.
            </p>
        </div>
    );
};

export default ModelSelector;
