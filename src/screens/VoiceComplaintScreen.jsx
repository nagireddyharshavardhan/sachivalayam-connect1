import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mic, Square, Camera, MapPin, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import './VoiceComplaintScreen.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const questions = [
  "What is your name?",
  "Which village or area are you from?",
  "What type of complaint would you like to report? (e.g. Roads, Water, Electricity)",
  "Please describe your complaint in detail."
];

const VoiceComplaintScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    name: '',
    village: '',
    category: '',
    description: ''
  });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      const lang = localStorage.getItem('language') === 'Telugu' ? 'te-IN' : 'en-IN';
      recognitionRef.current.lang = lang;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleNextStep = () => {
    // Save answer
    const keys = ['name', 'village', 'category', 'description'];
    setAnswers(prev => ({ ...prev, [keys[step]]: transcript || prev[keys[step]] }));
    setTranscript('');
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Move to media/location capture
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For MVP, we just create a local URL. In real app, upload to Cloudinary.
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(`${API_URL}/complaints`, {
        userId: user._id,
        residentName: answers.name || user.name || 'Anonymous',
        villageArea: answers.village || user.villageArea || 'Unknown',
        complaintCategory: answers.category || 'Other',
        complaintDescriptionText: answers.description || 'No description provided.',
        language: localStorage.getItem('language') || 'English',
        latitude: location?.latitude,
        longitude: location?.longitude,
        photoUrl: photo // In real app, this would be a Cloudinary URL after upload
      });
      navigate('/tracking');
    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <Header title="Report Issue" />
      
      <div className="voice-content animate-fade-in">
        {step < 4 ? (
          <div className="flex flex-col items-center flex-1">
            <div className="step-indicator mb-4">Step {step + 1} of 4</div>
            <h2 className="question-text text-center mb-6">{questions[step]}</h2>
            
            <div className="transcript-box mb-6">
              {transcript || answers[Object.keys(answers)[step]] || "Tap the microphone and start speaking..."}
            </div>

            <div className="mic-container mb-6">
              <button 
                className={`mic-button ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
              >
                {isListening ? <Square size={32} color="white" /> : <Mic size={32} color="white" />}
              </button>
              <p className="mt-2 text-muted">{isListening ? 'Listening...' : 'Tap to speak'}</p>
            </div>

            <Button className="mt-auto w-full" onClick={handleNextStep}>
              {step === 3 ? 'Continue to Attachments' : 'Next'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center flex-1">
            <h2 className="mb-4 text-center">Attachments (Optional)</h2>
            
            <div className="attachment-grid w-full mb-6">
              <div className="attachment-card" onClick={() => fileInputRef.current.click()}>
                <Camera size={32} color="var(--color-primary)" className="mb-2" />
                <span>Capture Photo</span>
                {photo && <CheckCircle size={16} color="var(--color-success)" className="absolute top-2 right-2" />}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handlePhotoCapture} 
              />

              <div className="attachment-card" onClick={handleGetLocation}>
                <MapPin size={32} color="var(--color-primary)" className="mb-2" />
                <span>Tag Location</span>
                {location && <CheckCircle size={16} color="var(--color-success)" className="absolute top-2 right-2" />}
              </div>
            </div>

            <div className="summary-box w-full mb-6">
              <h4>Summary</h4>
              <p><strong>Category:</strong> {answers.category || 'N/A'}</p>
              <p><strong>Desc:</strong> {answers.description || 'N/A'}</p>
            </div>

            <Button className="w-full mt-auto" variant="success" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceComplaintScreen;
