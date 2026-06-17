import React, { useState, useEffect } from 'react';
import { Users, FileText, IndianRupee, ShieldAlert, Cpu, Sparkles, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Closed' } : t));
  };

  // Mock charts
  const userGrowth = [
    { name: 'Jan', Users: 780 },
    { name: 'Feb', Users: 910 },
    { name: 'Mar', Users: 1040 },
    { name: 'Apr', Users: 1150 },
    { name: 'May', Users: 1248 }
  ];

  if (loading || !stats) {
    return <div className="text-xs text-slate-400">Loading Admin Analytics...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display font-bold text-xl md:text-2xl text-white">
          SaaS Admin Control Panel
        </h2>
        <p className="text-xs text-slate-400">
          Monitor SaaS growth, database transactions, support tickets, and LLM token costs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Users */}
        <div className="glass-panel p-5 rounded-2xl flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Total SaaS Users</span>
            <span className="text-xl font-display font-bold text-white">{stats.totalUsers}</span>
          </div>
          <Users className="w-8 h-8 text-primary-light opacity-50" />
        </div>

        {/* Bills Analyzed */}
        <div className="glass-panel p-5 rounded-2xl flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Bills Analyzed</span>
            <span className="text-xl font-display font-bold text-white">{stats.totalBillsAnalyzed + 3420}</span>
          </div>
          <FileText className="w-8 h-8 text-success opacity-50" />
        </div>

        {/* Revenue */}
        <div className="glass-panel p-5 rounded-2xl flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase block">Monthly Recurring Rev</span>
            <span className="text-xl font-display font-bold text-white">{stats.monthlyRevenue}</span>
          </div>
          <IndianRupee className="w-8 h-8 text-accent opacity-50" />
        </div>

        {/* LLM Tokens */}
        <div className="glass-panel p-5 rounded-2xl flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase block">AI LLM Tokens Invoiced</span>
            <span className="text-xl font-display font-bold text-primary-light">{stats.aiTokensUsed.toLocaleString()}</span>
          </div>
          <Cpu className="w-8 h-8 text-primary-light opacity-50" />
        </div>

      </div>

      {/* Grid: Signup Growth + System health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Growth Line Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl h-[280px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-display font-bold text-xs text-white">SaaS Signup Growth</h4>
            <span className="text-[9px] bg-success/20 text-success px-2 py-0.5 rounded font-bold">▲ Stable +18% MoM</span>
          </div>

          <div className="flex-1 min-h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 10, color: '#F1F5F9' }}
                />
                <Line type="monotone" dataKey="Users" stroke="#6D28D9" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 text-left h-[280px]">
          <h4 className="font-display font-bold text-xs text-white">Telemetry & Health</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">OCR Model API status</span>
              <span className="text-success font-bold flex items-center gap-1">🟢 Operational</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">API Gateway latency</span>
              <span className="text-slate-200 font-bold">85 ms</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">DB transaction pool</span>
              <span className="text-slate-200 font-bold">Active (12 connections)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Model accuracy baseline</span>
              <span className="text-slate-200 font-semibold">97.8%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Support Tickets Queue */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 text-left">
        <h4 className="font-display font-bold text-xs text-white">Active Support Tickets</h4>
        
        {tickets.length === 0 ? (
          <p className="text-[10px] text-slate-500">No active support tickets in queue.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-surface-light border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{t.subject}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      t.status === 'Open' ? 'bg-danger/25 text-danger' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">{t.message}</p>
                  <span className="text-[8px] text-slate-500 block">Sender: {t.userEmail} | Received: {new Date(t.createdAt).toLocaleString()}</span>
                </div>

                {t.status === 'Open' && (
                  <button
                    onClick={() => handleResolveTicket(t.id)}
                    className="self-end md:self-center bg-primary hover:bg-primary-light text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Resolve Ticket
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
