import React from 'react';
import { AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnomaliesPage: React.FC = () => {
  const { alerts, resolveAlert } = useApp();

  const handleResolve = async (id: string) => {
    await resolveAlert(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display font-bold text-xl md:text-2xl text-white">
          Anomaly Detection Alarms
        </h2>
        <p className="text-xs text-slate-400">
          Identifies abnormal consumption levels, pricing leaks, and billing bugs.
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-sm mx-auto">
          <ShieldCheck className="w-12 h-12 text-success mx-auto" />
          <h3 className="text-sm font-semibold text-white">All Clear!</h3>
          <p className="text-xs text-slate-400">
            No active consumption anomalies or utility billing spike alerts detected.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`glass-panel p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 text-left relative ${
                alert.level === 'High' ? 'border-danger/30 bg-danger/5' :
                alert.level === 'Medium' ? 'border-warning/30 bg-warning/5' : 'border-primary/20'
              }`}
            >
              <div className="flex gap-4">
                {/* Priority Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  alert.level === 'High' ? 'bg-danger/10 text-danger' :
                  alert.level === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary-light'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white">{alert.title}</h4>
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      alert.level === 'High' ? 'bg-danger/20 text-danger' :
                      alert.level === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary-light'
                    }`}>
                      {alert.level} Priority
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{alert.description}</p>
                  <span className="text-[8px] text-slate-500 block">Reported Cycle: {alert.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-[10px] font-semibold border border-white/10 flex items-center gap-1 transition-all"
                >
                  <Check className="w-3.5 h-3.5 text-success" /> Dismiss
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
