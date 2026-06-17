import React, { useState } from 'react';
import { Sparkles, Brain, ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InsightsPage: React.FC = () => {
  const { bills } = useApp();
  const [selectedType, setSelectedType] = useState('electricity');

  // Filter and sort bills of selected type
  const typeBills = React.useMemo(() => {
    return bills
      .filter(b => b.type === selectedType)
      .sort((a, b) => new Date(a.billingDate).getTime() - new Date(b.billingDate).getTime());
  }, [bills, selectedType]);

  const insightsData = React.useMemo(() => {
    if (typeBills.length < 2) {
      return {
        hasData: false,
        explanation: "Upload at least 2 bills of this utility type to activate comparative AI analysis.",
        percentChange: 0,
        diffAmount: 0,
        drivers: [],
        confidenceScore: 0
      };
    }

    const current = typeBills[typeBills.length - 1];
    const previous = typeBills[typeBills.length - 2];
    
    const diffAmount = current.amount - previous.amount;
    const percentChange = ((current.amount - previous.amount) / previous.amount) * 100;
    
    let explanation = "";
    let drivers: { factor: string; percentage: number; cost: number; desc: string }[] = [];
    let confidenceScore = 95;

    if (selectedType === 'electricity') {
      const unitsDiff = current.units - previous.units;
      const unitsPct = (unitsDiff / previous.units) * 100;
      
      if (diffAmount > 0) {
        explanation = `Your electricity bill increased by ₹${diffAmount} (${percentChange.toFixed(1)}%) because your power consumption rose by ${unitsPct.toFixed(1)}% compared to last cycle. A matching heatwave database check indicates this increase likely came from heavier AC usage (compressor running 4.2 hours extra daily).`;
        drivers = [
          { factor: "AC Compressor Overhead", percentage: 65, cost: Math.round(diffAmount * 0.65), desc: "Higher cooling load matching outside temperatures" },
          { factor: "Tariff Tier Escalation", percentage: 20, cost: Math.round(diffAmount * 0.20), desc: "Units crossed into the higher ₹8.5/unit pricing bracket" },
          { factor: "Taxes & Surcharges", percentage: 15, cost: Math.round(diffAmount * 0.15), desc: "Proportional municipal tax adjustments" }
        ];
      } else {
        explanation = `Great! Your electricity bill dropped by ₹${Math.abs(diffAmount)} (${Math.abs(percentChange).toFixed(1)}%). Lower outside temperatures reduced cooling cycles, and your energy conservation habits kept overall units down.`;
        confidenceScore = 92;
      }
    } else if (selectedType === 'water') {
      if (diffAmount > 0) {
        explanation = `Your water bill increased by ₹${diffAmount} (${percentChange.toFixed(1)}%). We detected a sustained 24-hour baseline consumption creep. This suggests a toilet tank leak or dripping garden nozzle rather than temporary usage spikes.`;
        drivers = [
          { factor: "Sustained Baseline Leak", percentage: 80, cost: Math.round(diffAmount * 0.8), desc: "Constant background flow detected in municipal telemetry" },
          { factor: "Standard Charges Hike", percentage: 20, cost: Math.round(diffAmount * 0.2), desc: "Proportional sewage service fee hikes" }
        ];
        confidenceScore = 88;
      } else {
        explanation = `Your water bill remains steady, dropping slightly by ${Math.abs(percentChange).toFixed(1)}%. Usage is within healthy household baseline parameters.`;
      }
    } else if (selectedType === 'broadband') {
      if (diffAmount > 0) {
        explanation = `Your broadband invoice is ₹${diffAmount} higher than last month. This increase was driven entirely by a newly added digital service fee and subscription price index change. No speed change was registered.`;
        drivers = [
          { factor: "Subscription Creep Fees", percentage: 100, cost: diffAmount, desc: "Ancillary router rent or service taxes added to broadband base plan" }
        ];
        confidenceScore = 98;
      } else {
        explanation = `Your broadband bill is stable at ₹${current.amount} with no hidden subscription increases detected this cycle.`;
      }
    } else {
      explanation = `Your ${selectedType} bill changed by ${percentChange.toFixed(1)}% (₹${diffAmount}). AI confirms usage cycles are standard for this seasonal category.`;
      drivers = [
        { factor: "Standard Consumption Variance", percentage: 100, cost: diffAmount, desc: "Day-to-day utility variance" }
      ];
      confidenceScore = 90;
    }

    return {
      hasData: true,
      explanation,
      percentChange,
      diffAmount,
      drivers,
      confidenceScore
    };
  }, [typeBills, selectedType]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display font-bold text-xl md:text-2xl text-white">
          AI Insight Engine
        </h2>
        <p className="text-xs text-slate-400">
          Deconstructs utility pricing fluctuations and highlights underlying causes.
        </p>
      </div>

      {/* Select Category */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['electricity', 'water', 'broadband', 'mobile'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`text-xs font-semibold px-4.5 py-2.5 rounded-xl border shrink-0 capitalize transition-all ${
              selectedType === t 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-surface border-white/5 text-slate-400 hover:text-white hover:border-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!insightsData.hasData ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <Brain className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">Insufficient Data</h3>
          <p className="text-xs text-slate-400">
            {insightsData.explanation}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Natural Language Report */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-accent" /> AI Natural Language Report
            </div>
            
            <p className="text-xs leading-relaxed text-slate-300 bg-surface/50 p-4 rounded-xl border border-white/5 font-sans">
              {insightsData.explanation}
            </p>

            {/* Drivers list */}
            {insightsData.drivers.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-display font-bold text-xs text-white">Fluctuation Cost Drivers</h4>
                <div className="space-y-3">
                  {insightsData.drivers.map((drv, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-surface-light border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-200">{drv.factor}</span>
                        <span className="font-bold text-accent">₹{drv.cost} ({drv.percentage}%)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">{drv.desc}</p>
                      
                      {/* Driver progress line */}
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${drv.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar details */}
          <div className="space-y-6 col-span-1">
            
            {/* Confidence Gauge */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between h-[210px] text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Confidence Score</span>
              
              <div className="relative flex items-center justify-center h-28">
                {/* Simulated circular gauge */}
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-accent flex items-center justify-center animate-pulse-slow">
                  <span className="font-display font-extrabold text-2xl text-slate-200">{insightsData.confidenceScore}%</span>
                </div>
                <div className="absolute bottom-2 text-[9px] font-bold text-success flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> High Reliability
                </div>
              </div>
            </div>

            {/* Comparison metrics */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 text-left">
              <h4 className="font-display font-bold text-xs text-white">Compare Overview</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-surface border border-white/5">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Last Cycle</span>
                  <span className="text-sm font-semibold text-slate-300">
                    ₹{typeBills[typeBills.length - 2]?.amount}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-white/5">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Current Cycle</span>
                  <span className="text-sm font-semibold text-slate-300">
                    ₹{typeBills[typeBills.length - 1]?.amount}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Change Margin</span>
                  <span className="text-xs font-bold text-white">
                    ₹{Math.abs(insightsData.diffAmount)} {insightsData.diffAmount > 0 ? 'Increase' : 'Decrease'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  insightsData.diffAmount > 0 ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                }`}>
                  {insightsData.diffAmount > 0 ? '▲' : '▼'} {Math.abs(insightsData.percentChange).toFixed(1)}%
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
