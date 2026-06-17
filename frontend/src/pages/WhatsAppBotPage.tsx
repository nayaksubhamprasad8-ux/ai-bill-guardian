import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, File, CheckCheck, Phone, Video, Search, MoreVertical, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WhatsAppMsg {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'document';
    name: string;
  };
}

export const WhatsAppBotPage: React.FC = () => {
  const { alerts, recommendations } = useApp();
  
  const [messages, setMessages] = useState<WhatsAppMsg[]>([
    {
      sender: 'bot',
      text: "Welcome to AI Bill Guardian WhatsApp Support! 🛡️\n\nSend me a photo or PDF of any utility bill, and I will instantly extract values, check for leaks/spikes, and predict your costs.",
      timestamp: "10:30 AM"
    },
    {
      sender: 'user',
      text: "Here is my municipal water bill.",
      timestamp: "10:32 AM",
      attachment: {
        type: 'image',
        name: 'water_bill_may.jpg'
      }
    },
    {
      sender: 'bot',
      text: "✅ *Water Bill Parsed (May 2026)*\n• Provider: Municipal Water Dept\n• Amount: *₹1,100*\n• Consumption: *44 kL*\n• Due Date: June 8, 2026\n\n⚠️ *Alert:* Water units are *83%* above baseline. A steady leak is suspected. Fixing leaks could save *₹180/mo*.",
      timestamp: "10:32 AM"
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg: WhatsAppMsg = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Trigger bot response
    setTimeout(() => {
      let botResponse = "I'm checking that. Send me a bill image to get started!";
      const query = text.toLowerCase();

      if (query.includes('high') || query.includes('spike')) {
        const spike = alerts.find(a => a.type === 'anomaly');
        botResponse = spike 
          ? `🛡️ *Guardian Spike Report:*\n${spike.title}\n\n${spike.description}`
          : `🛡️ *Guardian Report:*\nNo severe spikes are active. Electricity bill is forecasted around ₹7,200 next month due to climate seasonality.`;
      } else if (query.includes('save') || query.includes('tip') || query.includes('recommend')) {
        const top = recommendations.filter(r => !r.applied)[0];
        botResponse = top
          ? `💡 *AI Savings Tip:*\n*${top.title}*\n\n${top.description}\n\nEstimated Savings: *₹${top.estSavings}/mo*`
          : `💡 *AI Savings Tip:*\nYou have applied all active recommendations! Excellent work.`;
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        botResponse = `Hello Subham! You can ask me:\n• "Why is my bill high?"\n• "Give me savings tips"\n• Or attach a bill document!`;
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 850);
  };

  const simulateBillUpload = () => {
    const fileMsg: WhatsAppMsg = {
      sender: 'user',
      text: "Sent electricity bill invoice",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: {
        type: 'document',
        name: 'electricity_invoice.pdf'
      }
    };
    
    setMessages(prev => [...prev, fileMsg]);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "✅ *Electricity Bill Parsed (May 2026)*\n• Provider: State Electricity Board\n• Amount: *₹6,700*\n• Units: *670 kWh*\n• Due Date: June 5, 2026\n\n⚠️ *Alert:* High seasonal spike detected (+97%). AC consumption is the primary driver.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display font-bold text-xl md:text-2xl text-white">
          WhatsApp Bot Integration
        </h2>
        <p className="text-xs text-slate-400">
          Simulates sending invoices and getting analysis summaries over WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 glass-panel rounded-2xl overflow-hidden border border-white/10 h-[500px]">
        
        {/* Left Side: Sidebar Contact list */}
        <div className="hidden md:flex flex-col bg-surface border-r border-white/5">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="font-display font-bold text-xs text-white">Chats</span>
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </div>
          
          {/* Active Chats */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 bg-surface-light border-l-4 border-primary flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-xs text-white">
                AG
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-semibold text-white truncate">AI Bill Guardian</h5>
                  <span className="text-[8px] text-slate-500">10:32 AM</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Water Bill Parsed (May 2026)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Chat Thread */}
        <div className="col-span-2 flex flex-col justify-between bg-surface-dark/40">
          
          {/* Header */}
          <div className="p-3 bg-surface border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-xs text-white">
                AG
              </div>
              <div className="text-left">
                <h5 className="text-xs font-semibold text-white flex items-center gap-1">
                  AI Bill Guardian
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success"></span>
                </h5>
                <p className="text-[8px] text-slate-500">Online • Verified Business Bot</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <Phone className="w-4 h-4" />
              <Video className="w-4 h-4" />
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface to-background">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3.5 py-2 text-xs leading-relaxed relative ${
                    msg.sender === 'user'
                      ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                      : 'bg-[#202c33] text-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Attachment container */}
                  {msg.attachment && (
                    <div className="mb-2 p-2 rounded bg-black/20 flex items-center gap-2 border border-white/5">
                      {msg.attachment.type === 'image' ? <Image className="w-5 h-5 text-accent" /> : <File className="w-5 h-5 text-primary-light" />}
                      <span className="text-[10px] font-bold text-slate-300 truncate max-w-[120px]">{msg.attachment.name}</span>
                    </div>
                  )}
                  
                  <span className="whitespace-pre-line block">{msg.text}</span>
                  
                  <span className="text-[7.5px] text-slate-400 float-right mt-1.5 ml-2 flex items-center gap-0.5">
                    {msg.timestamp}
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-400" />}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom input area */}
          <div className="p-3 bg-[#202c33]/50 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={simulateBillUpload}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title="Simulate Document Attachment"
            >
              <File className="w-4 h-4" />
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder="Type a message..."
              className="flex-1 bg-[#2a3942] border-none rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none placeholder:text-slate-500"
            />
            
            <button
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#00a884] hover:bg-[#00bfa5] text-white rounded-xl flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
