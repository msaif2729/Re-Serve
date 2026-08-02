import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, Sparkles, X, AlertCircle } from 'lucide-react';

export default function VoiceWidget() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechResponse, setSpeechResponse] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  // Speak helper using Web Speech Synthesis
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      setSpeechResponse(text);
    }
  };

  // Start Speech Recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    // Stop existing instance if any
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    // Stop TTS so mic can hear clearly
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setErrorMsg('');
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setTranscript('Listening... Speak a command clearly now.');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(currentTranscript);
          processVoiceCommand(currentTranscript);
          return;
        }
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access denied. Please allow mic permission in your browser URL bar.');
      } else if (event.error === 'no-speech') {
        setErrorMsg('No speech heard. Please click "Tap & Speak" again.');
      } else {
        setErrorMsg(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Start recognition error:', err);
      setListening(false);
    }
  };

  const processVoiceCommand = (command) => {
    const cmd = command.toLowerCase().trim();
    if (!cmd) return;

    if (cmd.includes('home')) {
      speakText('Navigating to Re-Serve home page.');
      navigate('/');
    } else if (cmd.includes('food') || cmd.includes('feed') || cmd.includes('listing') || cmd.includes('discover')) {
      speakText('Opening surplus food listings.');
      navigate('/food-listing');
    } else if (cmd.includes('donate') || cmd.includes('post')) {
      speakText('Opening food donation wizard.');
      navigate('/donate');
    } else if (cmd.includes('how it works') || cmd.includes('workflow')) {
      speakText('Showing how Re-Serve works for donors and NGOs.');
      navigate('/how-it-works');
    } else if (cmd.includes('features') || cmd.includes('fssai')) {
      speakText('Showing platform safety features.');
      navigate('/features');
    } else if (cmd.includes('about')) {
      speakText('Opening about us page.');
      navigate('/about');
    } else {
      speakText(`Executed command: "${command}". Try saying "go to food listing" or "donate food".`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setSpeechResponse('Voice Assistant ready. Click "Tap & Speak" to issue commands.');
          }}
          className="gradient-btn p-4 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center space-x-2 group hover:scale-105 transition-all"
        >
          <Sparkles className="w-5 h-5 text-emerald-300 animate-spin" />
          <span className="text-sm font-bold pr-1">Voice AI</span>
        </button>
      )}

      {/* Expanded Voice Control Card */}
      {isOpen && (
        <div className="glass-panel p-6 rounded-3xl w-80 sm:w-96 shadow-2xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Re-Serve Voice Assistant</h4>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Web Speech Engine</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                if (recognitionRef.current) {
                  try { recognitionRef.current.stop(); } catch (e) {}
                }
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs min-h-[75px] space-y-2">
            <p className="text-slate-400 font-medium">
              {listening ? (
                <span className="text-emerald-400 flex items-center space-x-1.5 animate-pulse font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Listening... Speak your command now</span>
                </span>
              ) : (
                'Click "Tap & Speak" below to start microphone'
              )}
            </p>
            {transcript && (
              <p className="text-slate-200 italic font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                "{transcript}"
              </p>
            )}
            {speechResponse && (
              <div className="flex items-start space-x-1.5 text-emerald-300 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
                <Volume2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{speechResponse}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={startListening}
              disabled={listening}
              className={`flex-1 py-3 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'gradient-btn text-white'
              }`}
            >
              {listening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
              <span>{listening ? 'Listening...' : 'Tap & Speak'}</span>
            </button>
          </div>

          {/* Quick Command Action Buttons */}
          <div className="text-[11px] text-slate-400 space-y-1.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Or Click Quick Voice Commands:</span>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => processVoiceCommand('go to food listing')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg font-bold text-[10px] text-center"
              >
                "Food Feed"
              </button>
              <button
                onClick={() => processVoiceCommand('donate food')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg font-bold text-[10px] text-center"
              >
                "Donate Food"
              </button>
              <button
                onClick={() => processVoiceCommand('how it works')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg font-bold text-[10px] text-center"
              >
                "How It Works"
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
