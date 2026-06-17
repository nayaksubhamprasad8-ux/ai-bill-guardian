import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Terminal, FileCode, CheckCircle } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  desc: string;
  requestBody?: string;
  responseBody: string;
}

export const ApiDocsPage: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const endpoints: Endpoint[] = [
    {
      method: 'POST',
      path: '/api/bills/upload',
      desc: 'Uploads raw utility bill image or PDF and triggers Google Vision OCR text extraction, parsing, and structured metadata compilation.',
      requestBody: `{
  "billFile": "Binary PDF or Image payload"
}`,
      responseBody: `{
  "message": "OCR Extraction complete",
  "data": {
    "id": "bill-extracted-1718625902000",
    "type": "electricity",
    "amount": 4880,
    "billingDate": "2026-06-17",
    "dueDate": "2026-07-07",
    "units": 480,
    "tariffRate": 8.5,
    "tax": 800,
    "status": "unpaid",
    "provider": "State Electricity Board",
    "usagePeriod": "May 2026"
  }
}`
    },
    {
      method: 'GET',
      path: '/api/bills',
      desc: 'Retrieves user utility billing history logs sorted chronologically.',
      responseBody: `[
  {
    "id": "bill-elec-05",
    "type": "electricity",
    "amount": 6700,
    "billingDate": "2026-05-15",
    "dueDate": "2026-06-05",
    "units": 670,
    "tariffRate": 8.5,
    "tax": 1005,
    "status": "paid",
    "provider": "State Electricity Board"
  }
]`
    },
    {
      method: 'PUT',
      path: '/api/bills/:id',
      desc: 'Modifies an existing billing invoice entry. Re-calculates metrics and evaluates for spikes or creeps automatically.',
      requestBody: `{
  "amount": 6800,
  "units": 680
}`,
      responseBody: `{
  "id": "bill-elec-05",
  "type": "electricity",
  "amount": 6800,
  "units": 680,
  "billingDate": "2026-05-15",
  "status": "paid"
}`
    },
    {
      method: 'GET',
      path: '/api/predictions',
      desc: 'Generates seasonal time-series forecasts (m1, m3, m6) for each utility type by analyzing trends and baseline growth rate.',
      responseBody: `{
  "electricity": {
    "m1": 7200,
    "m3": 8100,
    "m6": 8900,
    "historicalAverage": 4560,
    "data": [
      { "date": "2026-01-15", "amount": 3100 },
      { "date": "2026-05-15", "amount": 6700 }
    ]
  }
}`
    },
    {
      method: 'GET',
      path: '/api/recommendations',
      desc: 'Returns active savings recommendations list.',
      responseBody: `[
  {
    "id": "rec-01",
    "title": "Optimize AC Settings",
    "description": "Increase AC temperature to 24°C instead of 20°C.",
    "category": "electricity",
    "estSavings": 250,
    "difficulty": "Easy",
    "impact": "High",
    "applied": false
  }
]`
    },
    {
      method: 'PUT',
      path: '/api/recommendations/:id',
      desc: 'Toggles recommendations state between active and applied.',
      requestBody: `{
  "applied": true
}`,
      responseBody: `{
  "id": "rec-01",
  "title": "Optimize AC Settings",
  "applied": true
}`
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display font-bold text-xl md:text-2xl text-white">
          FastAPI & Node REST API Docs
        </h2>
        <p className="text-xs text-slate-400">
          Interactive REST endpoints detailing structured utility inputs and outputs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side Route List */}
        <div className="glass-panel rounded-2xl p-4.5 border border-white/10 space-y-2 text-left">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Endpoints</span>
          
          {endpoints.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-full flex flex-col items-start gap-1 p-3 rounded-xl border transition-all ${
                activeIdx === idx
                  ? 'bg-primary/10 border-primary text-white'
                  : 'bg-surface border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded ${
                  ep.method === 'GET' ? 'bg-sky-500/20 text-sky-400' :
                  ep.method === 'POST' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                }`}>
                  {ep.method}
                </span>
                <span className="font-mono text-[10px] font-semibold truncate max-w-[140px] md:max-w-[170px]">{ep.path}</span>
              </div>
              <span className="text-[9px] text-slate-500 line-clamp-1 text-left">{ep.desc}</span>
            </button>
          ))}
        </div>

        {/* Right side Swagger details */}
        <div className="md:col-span-2 glass-panel rounded-2xl border border-white/10 p-6 space-y-6 text-left">
          
          {/* Headline */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded ${
                endpoints[activeIdx].method === 'GET' ? 'bg-sky-500/20 text-sky-400' :
                endpoints[activeIdx].method === 'POST' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {endpoints[activeIdx].method}
              </span>
              <h4 className="font-mono font-bold text-xs text-white">{endpoints[activeIdx].path}</h4>
            </div>
            
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-semibold">
              HTTPS Response: 200 OK
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">{endpoints[activeIdx].desc}</p>

          {/* Request payload */}
          {endpoints[activeIdx].requestBody && (
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Request JSON Payload</span>
              <pre className="bg-surface-dark/80 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-slate-300 overflow-x-auto select-all leading-normal">
                {endpoints[activeIdx].requestBody}
              </pre>
            </div>
          )}

          {/* Response Payload */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Response JSON Payload</span>
            <pre className="bg-surface-dark/80 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-slate-300 overflow-x-auto select-all leading-normal">
              {endpoints[activeIdx].responseBody}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
