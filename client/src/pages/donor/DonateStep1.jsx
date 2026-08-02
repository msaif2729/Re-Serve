import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Utensils, Camera, Upload, Link as LinkIcon, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, X, AlertTriangle, Mic, MicOff } from 'lucide-react';

export default function DonateStep1() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [inputMode, setInputMode] = useState('file'); // 'file' | 'url'
  const [uploading, setUploading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Voice Form Dictation State
  const [voiceDictating, setVoiceDictating] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('donorStep1');
    return saved ? JSON.parse(saved) : {
      food_name: '',
      food_type: 'Cooked Meals',
      serves: 50,
      food_image: ''
    };
  });

  const startVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setVoiceDictating(true);
      setVoiceNote('Listening... Speak food title and quantity (e.g. "80 servings of surplus paneer gravy and rotis")');
    };

    recognition.onresult = (event) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setVoiceNote(text);

      if (event.results[0].isFinal) {
        parseAndFillVoiceData(text);
      }
    };

    recognition.onerror = (e) => {
      setVoiceDictating(false);
      setVoiceNote('Voice dictation error: ' + e.error);
    };

    recognition.onend = () => {
      setVoiceDictating(false);
    };

    recognition.start();
  };

  const parseAndFillVoiceData = (spokenText) => {
    const lower = spokenText.toLowerCase();

    // Extract quantity / numbers
    const numberMatch = lower.match(/\b\d+\b/);
    const parsedServings = numberMatch ? parseInt(numberMatch[0], 10) : formData.serves;

    // Detect category
    let parsedType = 'Cooked Meals';
    if (lower.includes('bakery') || lower.includes('bread') || lower.includes('croissant') || lower.includes('cake')) {
      parsedType = 'Bakery';
    } else if (lower.includes('raw') || lower.includes('vegetables') || lower.includes('fruits') || lower.includes('grain')) {
      parsedType = 'Raw Ingredients';
    } else if (lower.includes('packaged') || lower.includes('canned') || lower.includes('box')) {
      parsedType = 'Packaged';
    }

    // Capitalize title
    const formattedTitle = spokenText.charAt(0).toUpperCase() + spokenText.slice(1);

    setFormData(prev => ({
      ...prev,
      food_name: formattedTitle,
      serves: parsedServings,
      food_type: parsedType
    }));

    setVoiceNote(`✨ Form Filled by Voice: "${formattedTitle}" (${parsedServings} Servings | ${parsedType})`);
  };

  // Convert uploaded device file directly into a high-res Data URL for instant, zero-failure preview & AI scanning
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAiResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormData(prev => ({ ...prev, food_image: dataUrl }));
      setUploading(false);
    };
    reader.onerror = (err) => {
      console.error('File reading error:', err);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAiAssessment = async () => {
    if (!formData.food_image) return;
    setAiAnalyzing(true);

    try {
      const res = await API.post('/ai/assess-quality', {
        food_image: formData.food_image,
        food_name: formData.food_name,
        food_type: formData.food_type
      });

      if (res.data.success) {
        setAiResult(res.data.qualityAssessment);
      }
    } catch (err) {
      console.error('AI quality assessment error:', err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (aiResult?.status === 'FAIL') {
      alert('Cannot proceed: AI Freshness Engine flagged spoilage hazard risk for this food photo.');
      return;
    }

    sessionStorage.setItem('donorStep1', JSON.stringify({
      ...formData,
      ai_quality_score: aiResult?.score || 95,
      ai_status: aiResult?.status || 'PASS'
    }));
    navigate('/donate2');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Step Indicator Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-emerald-400">
            <span>Step 1 of 2: Food Info & AI Freshness Scan</span>
            <span>50% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white">Post Surplus Food Donation</h1>
            <p className="text-slate-400 text-sm">Upload food photos and run Gemini 1.5 Flash AI Quality Inspection.</p>
          </div>

          {/* Voice Form Dictation Trigger Button */}
          <button
            type="button"
            onClick={startVoiceDictation}
            disabled={voiceDictating}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg ${
              voiceDictating
                ? 'bg-red-500 text-white animate-pulse'
                : 'gradient-btn text-white'
            }`}
          >
            {voiceDictating ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{voiceDictating ? 'Listening...' : '🎙️ Fill Form by Voice'}</span>
          </button>
        </div>

        {voiceNote && (
          <div className="p-3 bg-teal-950/40 border border-teal-500/30 rounded-2xl text-xs text-teal-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0 animate-pulse" />
            <span className="font-mono">{voiceNote}</span>
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
              Food Item Title / Description
            </label>
            <input
              type="text"
              required
              value={formData.food_name}
              onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
              placeholder="e.g. Surplus Hotel Banquet Dinner Trays"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Category Type</label>
              <select
                value={formData.food_type}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery">Bakery & Breads</option>
                <option value="Raw Ingredients">Raw Ingredients</option>
                <option value="Packaged">Packaged Goods</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                Servings Count (People / kg)
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.serves}
                onChange={(e) => setFormData({ ...formData, serves: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* DUAL MODE IMAGE SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase font-bold text-slate-400">
                Food Photo (Device Upload or Image URL)
              </label>
              <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setInputMode('file')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    inputMode === 'file' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    inputMode === 'url' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {inputMode === 'file' ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white">Click to upload photo from your device</p>
                  <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP files up to 10MB</p>
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={formData.food_image}
                onChange={(e) => {
                  setFormData({ ...formData, food_image: e.target.value });
                  setAiResult(null);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs font-mono"
              />
            )}
          </div>

          {/* Photo Preview & AI Assessment Button */}
          {formData.food_image && (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-48 group">
                <img src={formData.food_image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, food_image: '' });
                    setAiResult(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-red-500 text-white rounded-xl backdrop-blur-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {uploading ? 'Processing Image...' : 'Photo Selected'}
                </div>
              </div>

              {/* AI Vision Assessment Trigger Button */}
              <button
                type="button"
                onClick={handleRunAiAssessment}
                disabled={aiAnalyzing}
                className="w-full py-3 px-4 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
                <span>{aiAnalyzing ? 'Analyzing Photo with Gemini Vision Engine...' : '🤖 Inspect Freshness with Gemini 1.5 Flash AI'}</span>
              </button>

              {/* AI Quality Result Card (PASS vs FAIL) */}
              {aiResult && (
                <div className={`p-5 rounded-2xl border space-y-3 ${
                  aiResult.status === 'PASS'
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-red-950/40 border-red-500/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {aiResult.status === 'PASS' ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
                      )}
                      <span className={`font-extrabold text-sm ${aiResult.status === 'PASS' ? 'text-white' : 'text-red-300'}`}>
                        AI Quality Inspection: {aiResult.status}
                      </span>
                    </div>
                    <span className={`px-3 py-1 font-black rounded-full text-xs ${
                      aiResult.status === 'PASS' ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                    }`}>
                      {aiResult.score}% Score
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{aiResult.summary}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800">
                    <div>Grade: <strong className={aiResult.status === 'PASS' ? 'text-emerald-400' : 'text-red-400'}>{aiResult.safety_grade}</strong></div>
                    <div>Safe Life: <strong>~{aiResult.estimated_shelf_life_hours} Hours</strong></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={aiResult?.status === 'FAIL'}
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-2 transition-all ${
              aiResult?.status === 'FAIL'
                ? 'bg-red-950/80 text-red-400 border border-red-500/30 cursor-not-allowed'
                : 'gradient-btn'
            }`}
          >
            <span>{aiResult?.status === 'FAIL' ? '❌ Listing Blocked (Spoilage Hazard)' : 'Proceed to Step 2 (Shelf Life & Location)'}</span>
            {aiResult?.status !== 'FAIL' && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
