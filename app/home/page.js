'use client';

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.SERVER_URL;

export default function Home() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [synthesizedAudio, setSynthesizedAudio] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Oops, this file is too big! Please try again with a file smaller than 5MB.');
        setFile(null);
      } else if (!selectedFile.type.startsWith('audio/')) {
        setError('Oops, this file format is not supported! Please upload an audio file.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  const handleTextChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= 500) {
      setText(inputText);
      setError(null);
    } else {
      setError('Oops, your text is too long! Please keep it under 500 characters.');
    }
  };

  const handleSynthesize = async () => {
    if (!file) {
      setError('Please upload a voice file first.');
      return;
    }
    if (text.trim() === '') {
      setError('Please enter some text to synthesize.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text', text);

      const response = await axios.post(`${API_URL}/api/synthesize`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSynthesizedAudio(response.data.audioUrl);
    } catch (err) {
      setError('An error occurred during synthesis. Please try again.');
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
        Voice Synthesis App
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Upload Voice File</h2>
          <div className="flex flex-col items-start space-y-2">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {file && <p className="text-sm text-gray-500">Selected file: {file.name}</p>}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Enter Text to Synthesize
          </h2>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Type your text here..."
            className="block w-full h-28 p-3 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500 text-right">{text.length}/500 characters</p>
        </section>

        <div className="flex flex-col items-center">
          <button
            onClick={handleSynthesize}
            disabled={isProcessing || !file || text.trim() === ''}
            className={`w-full py-3 px-4 rounded-md font-semibold text-white shadow-lg transition-transform transform ${
              isProcessing || !file || text.trim() === ''
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            }`}
          >
            {isProcessing ? 'Synthesizing...' : 'Synthesize Voice'}
          </button>

          {isProcessing && (
            <p className="mt-4 text-center text-sm text-blue-500">Processing...</p>
          )}

          {synthesizedAudio && !isProcessing && (
            <a
              href={synthesizedAudio}
              download="synthesized_voice.mp3"
              className="block mt-6 text-center py-3 px-4 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
            >
              Download Synthesized Voice
            </a>
          )}
        </div>

        {error && (
          <div
            className="mt-6 flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-md border border-red-300"
            role="alert"
          >
            <svg
              className="w-5 h-5 mr-2 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 13A7.5 7.5 0 102.5 4.293L9.6 11.393a1 1 0 001.414 0l6.086-6.086A7.5 7.5 0 0018 13z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
