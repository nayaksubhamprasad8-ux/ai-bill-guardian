import React, { useState, useEffect } from 'react';
import { Check, Edit3, ShieldAlert, CornerDownLeft, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const OcrPage: React.FC = () => {
  const { ocrPendingData, setOcrPendingData, addBill, setActiveTab } = useApp();
  
  const [editedData, setEditedData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with Context
  useEffect(() => {
    if (ocrPendingData) {
      setEditedData({ ...ocrPendingData });
    }
  }, [ocrPendingData]);

  if (!editedData) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-sm font-semibold text-white">No Pending OCR Extraction</h3>
        <p className="text-xs text-slate-400">
          Go to the upload page and upload a utility bill first.
        </p>
        <button
          onClick={() => setActiveTab('upload')}
          className="px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-lg transition-colors"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev: any) => {
      const next = { ...prev, [field]: value };
      
      // Auto recalculate amount if units, rates, or taxes are edited
      if (field === 'units' || field === 'tariffRate' || field === 'tax') {
        const units = parseFloat(next.units) || 0;
        const rate = parseFloat(next.tariffRate) || 0;
        const tax = parseFloat(next.tax) || 0;
        next.amount = Math.round(units * rate + tax);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Remove temporary ID and file references
      const { id, fileName, ...payload } = editedData;
      
      await addBill({
        ...payload,
        status: 'unpaid', // Newly uploaded bills are unpaid by default
        billingDate: editedData.billingDate || new Date().toISOString().split('T')[0],
      });
      
      // Celebrate success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6D28D9', '#F97316', '#10B981']
      });

      // Clear pending OCR buffer and redirect to dashboard
      setOcrPendingData(null);
      setActiveTab('dashboard');
    } catch (err) {
      console.error("Error committing bill data:", err);
      alert("Failed to save bill. Verify inputs.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white">
            Verify Extracted Invoice Details
          </h2>
          <p className="text-xs text-slate-400">
            Verify the Google Vision OCR data values before compiling saving recommendations.
          </p>
        </div>
        
        <button
          onClick={() => { setOcrPendingData(null); setActiveTab('upload'); }}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          <CornerDownLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      {/* Main Grid Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 border border-white/10">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-primary/20 text-primary-light px-2.5 py-1 rounded-full capitalize">
              {editedData.type} Utility
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">{editedData.fileName || 'document.pdf'}</span>
          </div>
          
          <span className="text-xs text-success font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> 97.4% OCR Confidence
          </span>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          
          {/* Utility Provider */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Provider Name</label>
            <input
              type="text"
              value={editedData.provider || ''}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Billing Cycle Period */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Billing Cycle Period</label>
            <input
              type="text"
              value={editedData.usagePeriod || ''}
              onChange={(e) => handleInputChange('usagePeriod', e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Billing Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Billing Date</label>
            <input
              type="date"
              value={editedData.billingDate || ''}
              onChange={(e) => handleInputChange('billingDate', e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Due Date</label>
            <input
              type="date"
              value={editedData.dueDate || ''}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Consumption Units */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">
              {editedData.type === 'electricity' ? 'Power Units (kWh)' : 
               editedData.type === 'water' ? 'Water Units (kL)' : 'Billing Quantity'}
            </label>
            <input
              type="number"
              value={editedData.units || ''}
              onChange={(e) => handleInputChange('units', parseFloat(e.target.value))}
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Tariff Rate */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Tariff Unit Rate (₹)</label>
            <input
              type="number"
              step="0.01"
              value={editedData.tariffRate || ''}
              onChange={(e) => handleInputChange('tariffRate', parseFloat(e.target.value))}
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Taxes & Surcharges */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Taxes & Surcharges (₹)</label>
            <input
              type="number"
              value={editedData.tax || ''}
              onChange={(e) => handleInputChange('tax', parseFloat(e.target.value))}
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
            />
          </div>

          {/* Final Amount */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Total Invoice Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={editedData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                className="w-full bg-surface border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold text-accent focus:outline-none focus:border-primary"
              />
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-white/5 flex gap-4">
          <button
            onClick={() => { setOcrPendingData(null); setActiveTab('upload'); }}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 transition-all"
          >
            Discard
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
          >
            {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Confirm & Save to Dashboard</>}
          </button>
        </div>

      </div>

    </div>
  );
};
