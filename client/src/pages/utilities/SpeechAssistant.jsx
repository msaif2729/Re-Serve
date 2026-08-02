import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Navigation, Search, CheckCircle2 } from 'lucide-react';

export default function SpeechAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [spokenText, setSpokenText] = useState('');

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      setSpokenText(text);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setTranscript('Listening... Speak a food command or query.');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (event.results[0].isFinal) {
        processCommand(text);
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const processCommand = (cmd) => {
    const text = cmd.toLowerCase();
    if (text.includes('paneer') || text.includes('buffet')) {
      speakText('Found Grand Hyatt Surplus Banquet Buffet serving 120 meals, 1.4 kilometers away.');
    } else if (text.includes('bakery') || text.includes('bread')) {
      speakText('Found French Loaf Bakery with 85 fresh breads and croissants ready for pickup.');
    } else if (text.includes('fssai') || text.includes('verify')) {
      speakText('Re-Serve validates 14-digit FSSAI licenses automatically via government endpoint.');
    } else {
      speakText(`Received command: "${cmd}". Say "search paneer" or "read food items" for audio assistance.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">Voice AI Assistant Interface</h1>
        <p className="text-slate-400 text-sm">
          Hands-free Web Speech API navigation, query processing, and audio synthesis engine.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-center">
        
        {/* Visualizer Circle */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 ${
            listening ? 'animate-ping' : ''
          }`}></div>
          <button
            onClick={startListening}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              listening ? 'bg-red-500 text-white shadow-red-500/50 shadow-2xl' : 'gradient-btn text-white'
            }`}
          >
            {listening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">
            {listening ? 'Listening for voice input...' : 'Click microphone above to start'}
          </h3>
          {transcript && <p className="text-sm text-emerald-300 font-mono italic mt-2">"{transcript}"</p>}
        </div>

        {spokenText && (
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3 text-xs text-left text-slate-200">
            <Volume2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p><strong>Speech Synthesis Output:</strong> {spokenText}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => processCommand('search paneer')}
            className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-200"
          >
            🗣️ "Search Paneer"
          </button>
          <button
            onClick={() => processCommand('search bakery')}
            className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-200"
          >
            🗣️ "Search Bakery"
          </button>
          <button
            onClick={() => processCommand('verify fssai')}
            className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-200"
          >
            🗣️ "Verify FSSAI"
          </button>
        </div>
      </div>
    </div>
  );
}
