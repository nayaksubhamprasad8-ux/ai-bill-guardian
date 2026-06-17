import React from 'react';
import { TrendingUp, Sparkles, AlertTriangle, Calendar, FileText, CheckCircle, CreditCard, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

export const Dashboard: React.FC = () => {
  const { bills, recommendations, alerts, predictions, translate, setActiveTab } = useApp();

  // 1. DYNAMIC METRICS CALCULATIONS
  
  // Get latest bill for each type to represent "current monthly spend"
  const latestBills = React.useMemo(() => {
    const map = new Map<string, any>();
    // Sort ascending, so newer bills overwrite older ones in the map
    [...bills]
      .sort((a, b) => new Date(a.billingDate).getTime() - new Date(b.billingDate).getTime())
      .forEach(bill => {
        map.set(bill.type, bill);
      });
    return Array.from(map.values());
  }, [bills]);

  const totalMonthlySpend = latestBills.reduce((sum, b) => sum + b.amount, 0);

  // Sum predicted next month costs across all available models
  const totalPredictedNextMonth = React.useMemo(() => {
    if (!predictions || Object.keys(predictions).length === 0) return totalMonthlySpend * 1.05;
    return Object.values(predictions).reduce((sum: number, pred: any) => sum + (pred.m1 || 0), 0);
  }, [predictions, totalMonthlySpend]);

  // Sum potential savings from recommendations that are NOT yet applied
  const savingsIdentified = recommendations
    .filter(r => !r.applied)
    .reduce((sum, r) => sum + r.estSavings, 0);

  // Count active alerts
  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  // 2. CHART DATA CONSTRUCTIONS
  
  // Spend Trend Chart (Group bills by month)
  const trendData = React.useMemo(() => {
    // Collect last 6 calendar months
    const months = ['Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026'];
    const monthKeys = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
    
    const baseData = monthKeys.map((key, i) => {
      const monthlyBills = bills.filter(b => b.billingDate.startsWith(key));
      const amount = monthlyBills.reduce((sum, b) => sum + b.amount, 0);
      return {
        name: months[i],
        Actual: amount,
        Predicted: null as number | null
      };
    });

    // Append a 7th data point representing the AI predicted next month (June 2026)
    // Connecting line to last actual month
    if (baseData.length > 0) {
      baseData[baseData.length - 1].Predicted = baseData[baseData.length - 1].Actual;
    }
    
    baseData.push({
      name: 'Jun 2026 (AI Proj)',
      Actual: null as any,
      Predicted: Math.round(totalPredictedNextMonth)
    });

    return baseData;
  }, [bills, totalPredictedNextMonth]);

  // Category Pie Chart
  const pieData = React.useMemo(() => {
    return latestBills.map(b => ({
      name: b.type.charAt(0).toUpperCase() + b.type.slice(1),
      value: b.amount,
      color: b.type === 'electricity' ? '#6D28D9' : 
             b.type === 'water' ? '#10B981' : 
             b.type === 'broadband' ? '#F97316' : 
             b.type === 'mobile' ? '#9333EA' : '#F59E0B'
    }));
  }, [latestBills]);

  // Monthly Comparison Bar Chart (Previous month vs current month totals)
  const comparisonData = React.useMemo(() => {
    const prevMonthBills = bills.filter(b => b.billingDate.includes('-04-'));
    const curMonthBills = bills.filter(b => b.billingDate.includes('-05-'));
    
    const types = ['electricity', 'water', 'broadband', 'mobile'];
    
    return types.map(t => {
      const prev = prevMonthBills.filter(b => b.type === t).reduce((s, b) => s + b.amount, 0);
      const cur = curMonthBills.filter(b => b.type === t).reduce((s, b) => s + b.amount, 0);
      return {
        category: t.charAt(0).toUpperCase() + t.slice(1),
        'April 2026': prev,
        'May 2026': cur
      };
    });
  }, [bills]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white">
            {translate('nav_dashboard')}
          </h2>
          <p className="text-xs text-slate-400">
            Welcome back! Here is a review of your utility consumption and AI-generated forecasts.
          </p>
        </div>
        
        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center justify-center gap-2 text-xs font-bold bg-primary hover:bg-primary-light text-white rounded-xl px-5 py-3 shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all"
        >
          <FileText className="w-4 h-4" /> {translate('nav_upload')}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly Spend */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">{translate('metric_spend')}</span>
            <TrendingUp className="w-4 h-4 text-primary-light" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-display font-bold text-white">₹{totalMonthlySpend.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-danger font-semibold flex items-center">▲ +8.2%</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">Combined latest billing cycles</p>
        </div>

        {/* Card 2: Predictions */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-accent/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">{translate('metric_forecast')}</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-display font-bold text-accent">₹{Math.round(totalPredictedNextMonth).toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-slate-400 font-semibold">AI Prediction</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">June forecasting threshold</p>
        </div>

        {/* Card 3: Savings Identified */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-success/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">{translate('metric_savings')}</span>
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-display font-bold text-success">₹{savingsIdentified.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-success font-semibold">Pending application</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">4 active recommendation actions</p>
        </div>

        {/* Card 4: Active Alerts */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-danger/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">{translate('metric_alerts')}</span>
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-display font-bold text-danger">{activeAlertsCount}</h3>
            <span className="text-[10px] text-danger font-semibold">Action required</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">Spikes and leaks warning tracker</p>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Line (Span 2) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-between h-[340px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-display font-bold text-xs text-white">Utility Spend History & Future Predictions</h4>
              <p className="text-[10px] text-slate-500">6 months actual data + 1 month AI forecasting</p>
            </div>
            <span className="text-[9px] bg-primary/20 text-primary-light px-2.5 py-0.5 rounded-full font-bold border border-primary/20">
              ML Auto-ARIMA
            </span>
          </div>
          
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6D28D9" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#F1F5F9', fontSize: 10, fontWeight: 'bold' }}
                  itemStyle={{ fontSize: 10 }}
                />
                <Area type="monotone" dataKey="Actual" stroke="#6D28D9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="Predicted" stroke="#F97316" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPredicted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown (Donut) */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-[340px]">
          <div>
            <h4 className="font-display font-bold text-xs text-white">Current Month Category Breakdown</h4>
            <p className="text-[10px] text-slate-500">Distribution of recent utility invoices</p>
          </div>
          
          <div className="flex-1 min-h-[160px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 10, color: '#F1F5F9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center label */}
            <div className="absolute text-center">
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Total</span>
              <span className="text-sm font-display font-extrabold text-slate-200">₹{totalMonthlySpend.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: d.color }}></span>
                <span>{d.name}: <strong className="text-slate-200">₹{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Bar chart + Recent Bills Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Comparison Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-[350px]">
          <div>
            <h4 className="font-display font-bold text-xs text-white">Cycle-over-Cycle Comparison</h4>
            <p className="text-[10px] text-slate-500">April 2026 vs May 2026 spend per channel</p>
          </div>
          
          <div className="flex-1 min-h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="category" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 10 }}
                />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="April 2026" fill="#1F2937" radius={[4, 4, 0, 0]} />
                <Bar dataKey="May 2026" fill="#6D28D9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bills (Span 2) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-between h-[350px]">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-display font-bold text-xs text-white">Recent Bills Log</h4>
              <p className="text-[10px] text-slate-500">History of uploaded and parsed utility bills</p>
            </div>
            <button
              onClick={() => setActiveTab('upload')}
              className="text-[10px] text-primary-light hover:text-white flex items-center font-bold"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Provider</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.slice(0, 5).map((bill, index) => (
                  <tr key={bill.id} className="border-b border-white/5 text-slate-300 hover:text-white transition-colors">
                    <td className="py-2.5">{bill.billingDate}</td>
                    <td className="py-2.5 capitalize">{bill.type}</td>
                    <td className="py-2.5">{bill.provider}</td>
                    <td className="py-2.5 font-bold text-slate-100">₹{bill.amount}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] uppercase ${
                        bill.status === 'paid' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Due Dates + Quick AI Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Due Dates Widget */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-accent" /> Upcoming Due Dates
          </h4>
          
          <div className="space-y-2.5">
            {latestBills.map((bill, index) => {
              const due = new Date(bill.dueDate);
              const diffTime = due.getTime() - new Date().getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              return (
                <div key={bill.id} className="p-3 rounded-xl bg-surface-light border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center font-bold text-[10px] capitalize text-slate-400">
                      {bill.type.substring(0, 3)}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-white capitalize">{bill.type} Bill</h5>
                      <p className="text-[9px] text-slate-500">Due: {bill.dueDate}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">₹{bill.amount}</div>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                      diffDays <= 3 ? 'bg-danger/10 text-danger' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {diffDays < 0 ? 'Overdue' : diffDays === 0 ? 'Due today' : `${diffDays} days left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Recommendations Widget */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-success" /> AI Recommendation Hub
          </h4>
          
          <div className="space-y-2.5">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={rec.id} className="p-3 rounded-xl bg-surface-light border border-white/5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{rec.title}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                      rec.impact === 'High' ? 'bg-primary/20 text-primary-light' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-normal">{rec.description}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-success">Save ₹{rec.estSavings}/mo</div>
                  <span className="text-[8px] text-slate-500 block mt-0.5">{rec.difficulty} Difficulty</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
