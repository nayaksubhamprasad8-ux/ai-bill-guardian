import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Send, X, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const VoiceChatbot: React.FC = () => {
  const { bills, recommendations, alerts, predictions } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I am Guardian AI, your financial assistant. Click the microphone or type to ask me questions about your bills, forecasts, or savings.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'en-US';
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [bills, recommendations, alerts, predictions]);

  // Speak AI responses out loud
  const speakText = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    // Cancel ongoing speakings
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis.cancel();
      recognitionRef.current.start();
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleUserMessage(inputText);
    setInputText('');
  };

  const handleUserMessage = (text: string) => {
    // Add user message
    const userMsg: Message = { sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    // Generate response
    setTimeout(() => {
      const responseText = processQuery(text);
      const aiMsg: Message = { sender: 'ai', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      speakText(responseText);
    }, 600);
  };

  // Chat logic matching user questions
  const processQuery = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Why is my bill higher?
    if (q.includes('higher') || q.includes('increase') || q.includes('spike') || q.includes('more expensive')) {
      const activeSpikes = alerts.filter(a => a.type === 'anomaly');
      if (activeSpikes.length > 0) {
        return `I've analyzed your cycles. ${activeSpikes[0].description} Let me know if you want savings tips to offset this spike!`;
      }
      return "Looking at your histories, your electricity bill spiked last month by 15% due to higher summer temperatures and AC use. Other bills remain stable.";
    }

    // 2. Savings tips
    if (q.includes('save') || q.includes('recommendation') || q.includes('cut cost') || q.includes('reduce')) {
      const pendingRecs = recommendations.filter(r => !r.applied);
      if (pendingRecs.length > 0) {
        const topRec = pendingRecs[0];
        return `You can save ₹${pendingRecs.reduce((sum, r) => sum + r.estSavings, 0)} per month in total. Try to ${topRec.title}: ${topRec.description} This will save you around ₹${topRec.estSavings} monthly.`;
      }
      return "You've applied all active recommendations! Excellent job. Keep monitoring your usage trends to find new opportunities.";
    }

    // 3. Forecast / Predictions
    if (q.includes('forecast') || q.includes('predict') || q.includes('next month') || q.includes('future')) {
      return "Based on our predictive models, your combined utility bills next month will be around ₹9,150. Electricity is projected at ₹7,200 due to season trends, while water is forecasted around ₹1,120.";
    }

    // 4. Leak detection
    if (q.includes('leak') || q.includes('water leak') || q.includes('pipe')) {
      const leakAlert = alerts.find(a => a.description.toLowerCase().includes('leak'));
      if (leakAlert) {
        return `Yes! We detected a water anomaly: ${leakAlert.description} I highly recommend checking your main valve.`;
      }
      return "We haven't detected any active leaks or unusual baseline water consumption at this time.";
    }

    // 5. General greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
      return "Hello! I am your AI Bill Guardian. You can ask me questions like: 'Why is my bill higher?', 'How can I save money?', or 'What is my forecasted electricity cost?'";
    }

    return "I'm not sure I fully understand that question. Try asking: 'Why is my bill higher?', 'How can I save money?', or 'Show my predictions'.";
  };

  return (
    <>
      {/* Floating Activation Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-slow border border-white/10"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-accent"></span>
        </span>
      </button>

      {/* Main Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] glass-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/15 animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-surface-light to-surface border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center ${isSpeaking ? 'animate-glow' : ''}`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                {isListening && (
                  <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping" />
                )}
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                  Guardian AI
                  <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isListening ? "Listening to you..." : isSpeaking ? "Speaking..." : "Voice enabled"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Sound toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (soundEnabled) window.speechSynthesis.cancel();
                }}
                className={`p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-colors`}
                title={soundEnabled ? "Mute Speech" : "Unmute Speech"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-danger" />}
              </button>
              
              {/* Close button */}
              <button
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-surface-light text-slate-200 border border-white/5 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex justify-start">
                <div className="bg-surface-light text-slate-400 border border-white/5 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-2">
                  <div className="flex gap-1 items-center h-4">
                    <span className="voice-wave-bar w-[3px] bg-accent rounded-full inline-block" style={{ animationDelay: '0.1s' }}></span>
                    <span className="voice-wave-bar w-[3px] bg-accent rounded-full inline-block" style={{ animationDelay: '0.3s' }}></span>
                    <span className="voice-wave-bar w-[3px] bg-accent rounded-full inline-block" style={{ animationDelay: '0.5s' }}></span>
                  </div>
                  Listening to voice query...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Suggestions */}
          <div className="px-4 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5 bg-surface-dark/50">
            <button
              onClick={() => handleUserMessage("Why is my bill higher?")}
              className="text-[10px] bg-white/5 hover:bg-primary/20 hover:border-primary/50 text-slate-300 rounded-full px-2.5 py-1 border border-white/10 shrink-0 transition-all"
            >
              Why is my bill higher?
            </button>
            <button
              onClick={() => handleUserMessage("How can I save money?")}
              className="text-[10px] bg-white/5 hover:bg-primary/20 hover:border-primary/50 text-slate-300 rounded-full px-2.5 py-1 border border-white/10 shrink-0 transition-all"
            >
              How can I save?
            </button>
            <button
              onClick={() => handleUserMessage("What is my forecast next month?")}
              className="text-[10px] bg-white/5 hover:bg-primary/20 hover:border-primary/50 text-slate-300 rounded-full px-2.5 py-1 border border-white/10 shrink-0 transition-all"
            >
              My predictions?
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-surface-light flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                isListening
                  ? 'bg-danger text-white animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask Guardian AI..."}
              className="flex-1 bg-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary placeholder:text-slate-500"
              disabled={isListening}
            />
            
            <button
              type="submit"
              className="p-2.5 bg-primary hover:bg-primary-light text-white rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-50"
              disabled={!inputText.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
