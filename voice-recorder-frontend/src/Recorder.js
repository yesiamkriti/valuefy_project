import React, { useState, useRef } from 'react';

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      uploadAudio(audioBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);

    startSpeechRecognition();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.mp3');

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('File uploaded:', data.filePath);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
  
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };
  
    recognition.start();
  };
  

  return (
    <div style={{
      border: '2px solid #ccc', 
      borderRadius: '10px', 
      padding: '20px', 
      textAlign: 'center', 
      width: '300px', 
      margin: '100px auto', 
      boxShadow: '2px 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1>Voice Recorder</h1>
      <button 
        onClick={recording ? stopRecording : startRecording}
        style={{
          backgroundColor: recording ? '#d9534f' : '#0275d8',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {recording ? 'Stop' : 'Record'}
      </button>
      {audioURL && <audio controls src={audioURL} style={{ marginTop: '10px' }} />}
      <p><strong>Transcript:</strong> {transcript}</p>
    </div>
    
  );
};

export default Recorder;
