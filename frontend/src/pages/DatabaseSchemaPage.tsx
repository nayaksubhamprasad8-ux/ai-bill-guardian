import React, { useState } from 'react';
import { Database, Copy, Check, Table, HelpCircle } from 'lucide-react';

export const DatabaseSchemaPage: React.FC = () => {
  const [activeTable, setActiveTable] = useState('Bills');
  const [copied, setCopied] = useState(false);

  const schemas: Record<string, string> = {
    Users: `-- Users table handles profile auth & config parameters
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    preferred_language VARCHAR(5) DEFAULT 'en',
    currency VARCHAR(5) DEFAULT '₹',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    Bills: `-- Bills table stores the raw and parsed invoice metadata
CREATE TABLE Bills (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- electricity, water, gas, mobile, broadband
    amount NUMERIC(12, 2) NOT NULL,
    billing_date DATE NOT NULL,
    due_date DATE NOT NULL,
    units NUMERIC(10, 2), -- kWh, kL, cylinders etc.
    tariff_rate NUMERIC(8, 2),
    tax NUMERIC(10, 2),
    status VARCHAR(20) DEFAULT 'unpaid', -- paid, unpaid, overdue
    provider VARCHAR(255) NOT NULL,
    usage_period VARCHAR(100),
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    UtilityAccounts: `-- Link utility provider account numbers to local user profiles
CREATE TABLE UtilityAccounts (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    utility_type VARCHAR(50) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    provider_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    BillHistory: `-- Historical records used to train forecasting algorithms
CREATE TABLE BillHistory (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    utility_type VARCHAR(50) NOT NULL,
    billing_month DATE NOT NULL, -- first day of month
    amount NUMERIC(12, 2) NOT NULL,
    units NUMERIC(10, 2) NOT NULL
);`,
    Predictions: `-- Caches model forecasting data outputs
CREATE TABLE Predictions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    utility_type VARCHAR(50) NOT NULL,
    forecast_month DATE NOT NULL,
    predicted_amount NUMERIC(12, 2) NOT NULL,
    confidence_lower NUMERIC(12, 2),
    confidence_upper NUMERIC(12, 2),
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    Recommendations: `-- Savings tips and action logs
CREATE TABLE Recommendations (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    est_savings NUMERIC(10, 2) NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- Easy, Medium, Hard
    impact VARCHAR(20) NOT NULL, -- Low, Medium, High
    applied BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    Alerts: `-- Anomaly and due date alarms
CREATE TABLE Alerts (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    bill_id VARCHAR(255) REFERENCES Bills(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- anomaly, due_date, subscription_creep
    level VARCHAR(20) NOT NULL, -- Low, Medium, High
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    Notifications: `-- Logs delivery status of alerts to user endpoints
CREATE TABLE Notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    alert_id VARCHAR(255) REFERENCES Alerts(id) ON DELETE SET NULL,
    channel VARCHAR(20) NOT NULL, -- email, SMS, WhatsApp
    status VARCHAR(20) DEFAULT 'sent', -- sent, failed, read
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(schemas[activeTable]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display font-bold text-xl md:text-2xl text-white">
          PostgreSQL Database Schema
        </h2>
        <p className="text-xs text-slate-400">
          Relational architecture model designed for the AI Bill Guardian SaaS platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Table Selector */}
        <div className="md:col-span-1 glass-panel rounded-2xl p-4.5 border border-white/10 space-y-2 text-left">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">DB Tables</span>
          {Object.keys(schemas).map((tbl) => (
            <button
              key={tbl}
              onClick={() => setActiveTable(tbl)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                activeTable === tbl
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/10'
                  : 'bg-surface border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> {tbl}
            </button>
          ))}
        </div>

        {/* Code Editor view */}
        <div className="md:col-span-3 glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between min-h-[350px]">
          
          {/* Header bar */}
          <div className="bg-surface/80 border-b border-white/5 py-3.5 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary-light" />
              <span className="font-display font-semibold text-xs text-slate-300">
                {activeTable}.sql
              </span>
            </div>
            
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Schema'}
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 bg-surface-dark/60 p-5 font-mono text-[11px] text-slate-300 text-left overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
            {schemas[activeTable]}
          </div>

        </div>

      </div>

    </div>
  );
};
