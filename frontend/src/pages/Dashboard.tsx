import React from 'react';
import { 
  TrendingUp, Sparkles, AlertTriangle, Calendar, FileText, CheckCircle, 
  CreditCard, ChevronRight, Activity, Leaf, ShieldAlert, BadgeInfo 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

export const Dashboard: React.FC = () => {
  const { bills, recommendations, alerts, predictions, translate, setActiveTab, resolveAlert, toggleRecommendation } = useApp();

  // 1. DYNAMIC METRICS CALCULATIONS
  
  // Get latest bill for each type
  const latestBills = React.useMemo(() => {
    const map = new Map<string, any>();
    [...bills]
      .sort((a, b) => new Date(a.billingDate).getTime() - new Date(b.billingDate).getTime())
      .forEach(bill => {
        map.set(bill.type, bill);
      });
    return Array.from(map.values());
  }, [bills]);

  const totalMonthlySpend = latestBills.reduce((sum, b) => sum + b.amount, 0);

  // Sum predicted next month costs
  const totalPredictedNextMonth = React.useMemo(() => {
    if (!predictions || Object.keys(predictions).length === 0) return totalMonthlySpend * 1.05;
    return Object.values(predictions).reduce((sum: number, pred: any) => sum + (pred.m1 || 0), 0);
  }, [predictions, totalMonthlySpend]);

  // Recommendations metrics
  const totalPotentialSavings = recommendations.reduce((sum, r) => sum + r.estSavings, 0);
  const appliedSavings = recommendations
    .filter(r => r.applied)
    .reduce((sum, r) => sum + r.estSavings, 0);
  
  const savingsAchievedPercent = totalPotentialSavings > 0 
    ? Math.round((appliedSavings / totalPotentialSavings) * 100) 
    : 100;

  // Active alerts
  const activeAlerts = alerts.filter(a => !a.resolved);

  // Budget Tracker
  const monthlyBudgetLimit = 10500;
  const budgetUtilizationPercent = Math.round((totalMonthlySpend / monthlyBudgetLimit) * 100);
  const remainingBudget = Math.max(0, monthlyBudgetLimit - totalMonthlySpend);

  // Carbon Footprint Calculations
  const elecBill = latestBills.find(b => b.type === 'electricity');
  const elecUnits = elecBill ? elecBill.units : 0;
  const carbonFootprintKg = Math.round(elecUnits * 0.82); // 0.82 kg CO2 per kWh baseline
  
  // Dynamic offset calculation based on applied recommendations
  const acRecommendationApplied = recommendations.find(r => r.id === 'rec-01')?.applied;
  const carbonOffsetKg = acRecommendationApplied ? 82 : 0;

  // Dynamic Bill Health Score calculations
  const healthFactors = React.useMemo(() => {
    const factors = [];
    let score = 100;

    // Stable consumption check
    const hasSpikeAlert = activeAlerts.some(a => a.title.includes('Spike'));
    if (!hasSpikeAlert) {
      factors.push({ label: 'Stable consumption trend', change: 20, isPositive: true });
    } else {
      score -= 10;
      factors.push({ label: 'Active billing consumption spikes', change: -10, isPositive: false });
    }

    // Leak check
    const hasLeakAlert = activeAlerts.some(a => a.description.toLowerCase().includes('leak'));
    if (!hasLeakAlert) {
      factors.push({ label: 'No resource leaks detected', change: 25, isPositive: true });
    } else {
      score -= 15;
      factors.push({ label: 'Water leak anomaly flagged', change: -15, isPositive: false });
    }

    // Recommendation check
    if (appliedSavings > 0) {
      factors.push({ label: 'Conservation savings applied', change: 22, isPositive: true });
    } else {
      score -= 12;
      factors.push({ label: 'Pending savings opportunities', change: -12, isPositive: false });
    }

    // Budget utilization
    if (budgetUtilizationPercent <= 90) {
      factors.push({ label: 'Spend within target budget limits', change: 15, isPositive: true });
    } else {
      score -= 10;
      factors.push({ label: 'Spend exceeds 90% budget limits', change: -10, isPositive: false });
    }

    return { score: Math.max(20, Math.min(100, score)), factors };
  }, [activeAlerts, appliedSavings, budgetUtilizationPercent]);

  // 2. CHART DATA CONSTRUCTIONS
  
  // Spend Trend Chart (Group bills by month)
  const trendData = React.useMemo(() => {
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

  // MoM comparisons
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
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white">
            {translate('nav_dashboard')}
          </h2>
          <p className="text-xs text-slate-400">
            Welcome back! Here is a review of your utility consumption, savings indices, and AI forecasts.
          </p>
        </div>
        
        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center justify-center gap-2 text-xs font-bold bg-primary hover:bg-primary-light text-white rounded-xl px-5 py-3 shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all"
        >
          <FileText className="w-4 h-4" /> {translate('nav_upload')}
        </button>
      </div>

      {/* Grid: Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Spend */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Monthly Spend</span>
            <TrendingUp className="w-4 h-4 text-primary-light" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <h3 className="text-2.5xl font-display font-bold text-white">₹{totalMonthlySpend.toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-danger font-semibold">▲ +8.2%</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">Sum of latest billing cycles</p>
        </div>

        {/* Card 2: AI Predicted */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-accent/20 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Forecast (Next Month)</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <h3 className="text-2.5xl font-display font-bold text-accent">₹{Math.round(totalPredictedNextMonth).toLocaleString('en-IN')}</h3>
            <span className="text-[10px] text-slate-400">Predicted limits</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">ML seasonal algorithms active</p>
        </div>

        {/* Card 3: Savings Target */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-success/20 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Potential Savings Left</span>
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <h3 className="text-2.5xl font-display font-bold text-success">₹{totalPotentialSavings - appliedSavings}</h3>
            <span className="text-[10px] text-success font-semibold">To be unlocked</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">Unapplied optimizations</p>
        </div>

        {/* Card 4: Active Alerts */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-danger/20 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Alerts</span>
            <AlertTriangle className="w-4 h-4 text-danger animate-bounce" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <h3 className="text-2.5xl font-display font-bold text-danger">{activeAlerts.length}</h3>
            <span className="text-[10px] text-danger font-semibold">Action required</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2">Spikes and leak detections</p>
        </div>

      </div>

      {/* Main Grid: Left Column (Visualizations) & Right Column (Dashboard Sidebars) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {bills.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6 py-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary-light animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-display font-extrabold text-lg text-white">Your Workspace is Ready!</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  You've successfully signed up. Currently, there are no utility bills in your account. Upload an electricity, water, gas, broadband, or mobile bill to begin.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('upload')}
                className="mx-auto flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white text-xs font-bold rounded-xl px-6 py-3.5 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <FileText className="w-4 h-4" /> Upload Your First Bill
              </button>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5 text-left text-slate-500">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Scan & Parse</span>
                  <p className="text-[9px] leading-normal font-sans">AI extracts items, rates, taxes, and due dates via OCR.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Explain Hikes</span>
                  <p className="text-[9px] leading-normal font-sans">Compare against cycle baselines to explain cost spikes.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Predict & Save</span>
                  <p className="text-[9px] leading-normal font-sans">Forecast future costs and apply personalized savings tips.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Spend Trend Charts */}
              <div className="glass-panel p-5 rounded-2xl h-[330px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-display font-bold text-xs text-white">Utility Spend History & Future Predictions</h4>
                <p className="text-[10px] text-slate-500">6 months actual data + 1 month AI forecasting</p>
              </div>
              <span className="text-[9px] bg-primary/20 text-primary-light px-2.5 py-0.5 rounded-full font-bold">
                Prophet/LSTM Model
              </span>
            </div>
            
            <div className="flex-1 min-h-[190px]">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
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

          {/* Bar MoM Comparison & Category Donut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Donut */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-[300px]">
              <div>
                <h4 className="font-display font-bold text-xs text-white">Spend Breakdown by Category</h4>
                <p className="text-[10px] text-slate-500">Share of latest utility bills</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center relative min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={68}
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
                
                <div className="absolute text-center">
                  <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider">Total</span>
                  <span className="text-xs font-display font-extrabold text-slate-200">₹{totalMonthlySpend.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: d.color }}></span>
                    <span>{d.name}: <strong className="text-slate-200">₹{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* MoM Bar comparisons */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-[300px]">
              <div>
                <h4 className="font-display font-bold text-xs text-white">Cycle-over-Cycle comparisons</h4>
                <p className="text-[10px] text-slate-500">MoM spend comparisons</p>
              </div>
              
              <div className="flex-1 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="category" stroke="#94A3B8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ fontSize: 10 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="April 2026" fill="#1F2937" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="May 2026" fill="#6D28D9" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* "What Changed?" Timeline (Comparing May vs April) */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-accent" /> "What Changed?" Fluctuation Timeline
                </h4>
                <p className="text-[10px] text-slate-500">Explainable line-item variance comparison for electricity</p>
              </div>
              <span className="text-[9px] bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded-full font-bold">
                +₹900 Change
              </span>
            </div>

            <div className="relative border-l border-slate-800 pl-4 space-y-3.5 mt-2">
              <div className="relative">
                <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-danger border border-slate-950"></span>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">AC Cooling Load Escalation</span>
                  <span className="font-bold text-danger">+₹580</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                  Compressor cycles increased by 18% matching the Pune seasonal heatwave baseline change.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-warning border border-slate-950"></span>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Tariff Slab Bracket Change</span>
                  <span className="font-bold text-warning">+₹220</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                  Total cumulative usage crossed the 500 kWh slab limit, increasing tariff rates to ₹8.50/unit.
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-primary-light border border-slate-950"></span>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">State Duty & Tax Revision</span>
                  <span className="font-bold text-primary-light">+₹100</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                  Proportional 15% local municipal tax adjustment on high-use brackets.
                </p>
              </div>
            </div>
          </div>

          {/* Neighborhood Peer Benchmarking */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div>
              <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                <BadgeInfo className="w-4 h-4 text-primary-light" /> Neighborhood Peer Benchmarking
              </h4>
              <p className="text-[10px] text-slate-500">Compare your household consumption against nearby sector averages</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-light border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-400">Your Electricity Bill</span>
                  <span className="font-bold text-white">₹6,700</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-500">Sector Average</span>
                  <span className="font-bold text-slate-300">₹5,100</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-[9px] text-danger font-semibold">
                  ⚠️ You spend <span className="font-bold text-danger">31% more</span> than similar size households.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-light border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-400">Your Water Bill</span>
                  <span className="font-bold text-white">₹1,100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-500">Sector Average</span>
                  <span className="font-bold text-slate-300">₹700</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-[9px] text-danger font-semibold">
                  ⚠️ You spend <span className="font-bold text-danger">57% more</span> than peers (leak alert indicator).
                </div>
            </div>
          </div>
        </div>
      </>
      )}
    </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          {/* Bill Health Score */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bill Health Score</span>
            
            <div className="flex items-center gap-4 justify-center">
              {/* Score Display Circle */}
              <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-success flex items-center justify-center relative shrink-0">
                <span className="font-display font-extrabold text-xl text-white">{healthFactors.score}</span>
                <span className="absolute bottom-1.5 text-[7px] text-slate-500 font-bold">/100</span>
              </div>
              
              <div className="text-left">
                <h5 className="text-xs font-semibold text-slate-200">
                  {healthFactors.score >= 80 ? 'Good efficiency' : healthFactors.score >= 60 ? 'Fair efficiency' : 'Low efficiency'}
                </h5>
                <p className="text-[9px] text-slate-500 leading-normal mt-0.5">
                  Your household scores better than 68% of local users.
                </p>
              </div>
            </div>

            {/* Score Factors */}
            <div className="space-y-2 border-t border-white/5 pt-3">
              {healthFactors.factors.map((f, i) => (
                <div key={i} className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${f.isPositive ? 'bg-success' : 'bg-danger'}`}></span>
                    {f.label}
                  </span>
                  <span className={`font-bold ${f.isPositive ? 'text-success' : 'text-danger'}`}>
                    {f.isPositive ? '+' : ''}{f.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Budget Tracker */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Monthly Utility Budget</span>
              <span className="text-xs font-bold text-white">₹{monthlyBudgetLimit} Limit</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs">
                <span className="font-semibold text-slate-200">₹{totalMonthlySpend} Spent</span>
                <span className={`font-bold ${budgetUtilizationPercent >= 90 ? 'text-danger' : 'text-primary-light'}`}>
                  {budgetUtilizationPercent}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    budgetUtilizationPercent >= 90 ? 'bg-danger' : 'bg-gradient-to-r from-primary to-secondary'
                  }`}
                  style={{ width: `${Math.min(100, budgetUtilizationPercent)}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] text-slate-500 pt-1">
                <span>Remaining: ₹{remainingBudget}</span>
                <span>Target: &lt; 90%</span>
              </div>
            </div>
          </div>

          {/* Savings Achieved Tracker */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Savings Achieved</span>
              <span className="text-xs font-bold text-success">₹{appliedSavings}/mo</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs">
                <span className="font-semibold text-slate-400">Target potential: ₹{totalPotentialSavings}/mo</span>
                <span className="font-bold text-success">{savingsAchievedPercent}%</span>
              </div>
              
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success transition-all duration-300"
                  style={{ width: `${savingsAchievedPercent}%` }}
                />
              </div>

              <p className="text-[8px] text-slate-500 leading-normal pt-1">
                Apply pending recommendation tips to reach 100% savings potential.
              </p>
            </div>
          </div>

          {/* Smart Alerts Feed */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Priority Alerts</span>
            
            <div className="space-y-2.5">
              {/* High Alert: Leak */}
              {activeAlerts.some(a => a.description.toLowerCase().includes('leak')) && (
                <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/25 text-left space-y-1 relative">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger animate-ping"></span>
                    <h5 className="text-[10px] font-bold text-danger uppercase tracking-wide">🔴 High Priority</h5>
                  </div>
                  <h6 className="text-xs font-semibold text-slate-200">Municipal Water Leak Suspected</h6>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Constant 24-hour baseline consumption detected since March 2026. Inspect your plumbing immediately.
                  </p>
                </div>
              )}

              {/* Medium Alert: Spike */}
              {activeAlerts.some(a => a.title.includes('Spike')) && (
                <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/25 text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-[10px] font-bold text-warning uppercase tracking-wide">🟡 Medium Priority</h5>
                  </div>
                  <h6 className="text-xs font-semibold text-slate-200">Electricity Bill Spike</h6>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Consumption rose 97.0% compared to January baseline. Main cause: heavy AC cooling loads.
                  </p>
                </div>
              )}

              {/* Recommendation Alert */}
              {recommendations.some(r => !r.applied && r.estSavings >= 200) && (
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 text-left space-y-1">
                  <h5 className="text-[10px] font-bold text-primary-light uppercase tracking-wide">🟢 Optimization</h5>
                  <h6 className="text-xs font-semibold text-slate-200">Switch Broadband Plan</h6>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Downgrade from 200 Mbps to 100 Mbps based on peak usage and save ₹200/month.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Carbon Footprint Tracker */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 text-left">
            <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-success" /> Carbon Footprint telemetries
            </h4>
            
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-3 bg-surface rounded-xl border border-white/5">
                <span className="text-[8px] text-slate-500 font-bold uppercase block">Equivalent CO₂</span>
                <span className="text-sm font-semibold text-white">{carbonFootprintKg} kg</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-white/5">
                <span className="text-[8px] text-slate-500 font-bold uppercase block">Offset Saved</span>
                <span className="text-sm font-semibold text-success">{carbonOffsetKg} kg</span>
              </div>
            </div>

            <p className="text-[9px] text-slate-500 leading-relaxed font-sans pt-1">
              {carbonOffsetKg > 0 
                ? '🟢 Active AC settings offset reduced carbon emission equivalents by 82 kg compared to last month.' 
                : '💡 Apply the AC setting recommendation to offset approximately 82 kg CO₂ equivalents.'
              }
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
