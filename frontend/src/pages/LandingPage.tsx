import React, { useState } from 'react';
import { Sparkles, FileText, ArrowRight, ShieldCheck, Cpu, HelpCircle, BarChart3, Globe, Mic, MessageSquare, AlertTriangle, Play, HelpCircle as HelpIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { translate, setAuthStatus, setActiveTab } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const startApp = () => {
    setAuthStatus('authenticated');
    setActiveTab('dashboard');
  };

  const faqData = [
    {
      q: "How does AI Bill Guardian extract information from bills?",
      a: "We utilize advanced OCR technology powered by Gemini and Google Vision models to scan PDFs and images. It automatically identifies the utility provider, tariff rate, total units consumed, taxes, and due dates."
    },
    {
      q: "Is my personal utility data secure?",
      a: "Absolutely. We encrypt all data in transit and at rest using banking-grade AES-256 protocols. Your bills are stored securely in isolated private bucket containers."
    },
    {
      q: "What types of bills are supported?",
      a: "We support electricity, water, pipeline gas, mobile, broadband, and general internet bills. You can upload files as PDF, JPEG, or PNG."
    },
    {
      q: "How accurate are the forecasting models?",
      a: "Our machine learning models analyze your history, seasonal weather changes, and provider tariff tiers to achieve a 94%+ forecasting accuracy."
    }
  ];

  return (
    <div className="bg-mesh min-h-screen overflow-x-hidden">
      
      {/* Navigation Header */}
      <nav className="glass-panel sticky top-0 z-40 border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-primary-light bg-clip-text text-transparent">
            AI Bill Guardian
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#problem" className="hover:text-white transition-colors">{translate('problem_sec')}</a>
          <a href="#features" className="hover:text-white transition-colors">{translate('features')}</a>
          <a href="#how" className="hover:text-white transition-colors">{translate('how_it_works')}</a>
          <a href="#pricing" className="hover:text-white transition-colors">{translate('pricing')}</a>
          <a href="#faq" className="hover:text-white transition-colors">{translate('faqs')}</a>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={startApp} className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 transition-colors">
            {translate('login')}
          </button>
          <button 
            onClick={startApp} 
            className="text-xs font-bold bg-primary hover:bg-primary-light text-white rounded-xl px-5 py-2.5 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            {translate('cta_start')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-bold tracking-wider uppercase mb-6 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Gen AI Utility Intelligence
        </div>
        
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-white tracking-tight leading-tight mb-6">
          Understand Every Bill.<br />
          <span className="bg-gradient-to-r from-primary-light via-secondary-light to-accent bg-clip-text text-transparent">
            Predict Every Expense.
          </span>
        </h1>
        
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          {translate('hero_subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={startApp} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white text-sm font-bold rounded-2xl px-8 py-4 shadow-xl shadow-primary/30 transition-all duration-300"
          >
            {translate('cta_start')} <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={startApp} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-2xl px-8 py-4 border border-white/10 transition-all"
          >
            <Play className="w-4 h-4 fill-white text-white" /> {translate('cta_demo')}
          </button>
        </div>

        {/* Hero Dashboard Illustration */}
        <div className="relative mx-auto max-w-4xl glass-panel rounded-2xl border border-white/10 p-4 shadow-3xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20 blur-xl -z-10" />
          <div className="bg-surface-dark/90 rounded-xl overflow-hidden aspect-[16/9] flex flex-col">
            {/* Window bar */}
            <div className="bg-surface/80 border-b border-white/5 py-3 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-danger inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-warning inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-success inline-block"></span>
              </div>
              <div className="text-[10px] bg-slate-800 text-slate-400 px-10 py-1 rounded-md">ai-bill-guardian.com/dashboard</div>
              <div className="w-12"></div>
            </div>
            
            {/* Mock Dashboard contents */}
            <div className="flex-1 p-6 grid grid-cols-3 gap-4 text-left">
              <div className="col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface border border-white/5 space-y-2">
                    <span className="text-[10px] text-slate-500">Monthly Utility Cost</span>
                    <h3 className="text-xl font-bold font-display text-white">₹9,800</h3>
                    <span className="text-[9px] text-danger font-semibold flex items-center gap-0.5">▲ +12% vs base</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-white/5 space-y-2">
                    <span className="text-[10px] text-slate-500">AI Savings Forecast</span>
                    <h3 className="text-xl font-bold font-display text-accent">₹930/mo</h3>
                    <span className="text-[9px] text-success font-semibold">4 active recommendations</span>
                  </div>
                </div>
                {/* Trend Chart Mock */}
                <div className="p-4 rounded-xl bg-surface border border-white/5 h-36 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">Utility Cost Time-Series Predictions</span>
                    <span className="text-[9px] bg-primary/20 text-primary-light px-2 py-0.5 rounded-full font-bold">94.8% AI Confidence</span>
                  </div>
                  <div className="flex items-end gap-2 h-20 px-2">
                    <div className="w-full bg-white/5 h-[30%] rounded"></div>
                    <div className="w-full bg-white/5 h-[35%] rounded"></div>
                    <div className="w-full bg-white/5 h-[40%] rounded"></div>
                    <div className="w-full bg-primary h-[60%] rounded relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] bg-primary text-white px-1 rounded font-bold">May</span>
                    </div>
                    <div className="w-full bg-primary/60 border-t-2 border-dashed border-accent h-[75%] rounded relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] bg-accent text-white px-1 rounded font-bold">Proj</span>
                    </div>
                    <div className="w-full bg-primary/40 border-t-2 border-dashed border-accent h-[85%] rounded"></div>
                  </div>
                </div>
              </div>

              {/* Sidebar Anomaly List */}
              <div className="space-y-4 col-span-1">
                <div className="p-4 rounded-xl bg-surface border border-white/5 h-full space-y-3">
                  <span className="text-[10px] text-slate-400 font-bold block">Guardian Intelligence</span>
                  <div className="p-2.5 rounded-lg bg-danger/10 border border-danger/20 flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[10px] font-bold text-danger">Electricity Spike</h5>
                      <p className="text-[8px] text-slate-400 leading-normal">Consumption increased by 97.0%. AI detected high HVAC seasonal spikes.</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-warning/10 border border-warning/20 flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[10px] font-bold text-warning">Water Leak Alert</h5>
                      <p className="text-[8px] text-slate-400 leading-normal">Constant baseline charge detected. Check pipe fittings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 md:px-12 bg-surface-dark/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              {translate('problem_sec')}
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Utility bills are designed to be confusing. Hidden costs, tariff tiers, and unexpected spikes steal money from household budgets monthly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
              <h3 className="font-display font-extrabold text-4xl text-primary-light mb-2">130M+</h3>
              <h4 className="font-semibold text-sm text-slate-200 mb-2">Households Billing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive complex paper or digital utility bills every single month across the nation.
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
              <h3 className="font-display font-extrabold text-4xl text-accent mb-2">67%</h3>
              <h4 className="font-semibold text-sm text-slate-200 mb-2">Cannot Explain Increases</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Of surveyed households have no clear understanding of why their bills fluctuated compared to baseline months.
              </p>
            </div>
            
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-secondary/30 transition-all duration-300">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
              <h3 className="font-display font-extrabold text-4xl text-secondary-light mb-2">₹9,400</h3>
              <h4 className="font-semibold text-sm text-slate-200 mb-2">Average Annual Overspend</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lost to late fees, unoptimized tariff packages, undetected leaks, and subscription creeps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
            Powerful Features Built for Clarity
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Harness the power of cutting-edge AI and machine learning to scan, organize, and forecast your bills automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">AI Bill Explanation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explains cost adjustments in a friendly paragraph. Know exactly if AC use or tariff rates drove the increase.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary-light mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">OCR Bill Extraction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag and drop any utility bill image or PDF. Our scanner reads rates, units, taxes, and dates in seconds.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">Bill Prediction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forecasts utility spending for 1, 3, and 6 months out with built-in weather and usage seasonality.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">Savings Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive highly personalized tips with exact estimated monthly savings to match your household habits.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">Anomaly Detection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Catch spikes, constant baseline water usage (leaks), subscription hikes, and rate creeping early.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">8 Local Languages</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully localized in Hindi, Tamil, Telugu, Marathi, Bengali, Kannada, and Gujarati for elder-friendly access.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary-light mb-4">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">Voice AI Assistant</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Talk directly to your advisor. Ask "Why is my bill higher?" and hear voice-spoken intelligence.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100 mb-2">WhatsApp Integration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simply snap a photo of your paper invoice and text it to our bot to get warnings and analysis on the go.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="py-20 px-6 md:px-12 bg-surface-dark/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              {translate('how_it_works')}
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Go from confusing invoices to clear savings in 5 simple, automated steps.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light font-display font-bold text-base mx-auto group-hover:scale-110 transition-transform">
                1
              </div>
              <h4 className="font-display font-semibold text-xs text-white">Upload Bill</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Upload a PDF, JPG photo, or use camera capture.
              </p>
            </div>

            <div className="text-center space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary-light font-display font-bold text-base mx-auto group-hover:scale-110 transition-transform">
                2
              </div>
              <h4 className="font-display font-semibold text-xs text-white">AI Reads Bill</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Optical OCR extracts units, rates, due dates, and taxes.
              </p>
            </div>

            <div className="text-center space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-display font-bold text-base mx-auto group-hover:scale-110 transition-transform">
                3
              </div>
              <h4 className="font-display font-semibold text-xs text-white">Compare History</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Matches metrics with your past cycles to track trends.
              </p>
            </div>

            <div className="text-center space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-success/20 border border-success/30 flex items-center justify-center text-success font-display font-bold text-base mx-auto group-hover:scale-110 transition-transform">
                4
              </div>
              <h4 className="font-display font-semibold text-xs text-white">Generate Insights</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                AI outlines reasons for hikes and flags leaks.
              </p>
            </div>

            <div className="text-center space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light font-display font-bold text-base mx-auto group-hover:scale-110 transition-transform">
                5
              </div>
              <h4 className="font-display font-semibold text-xs text-white">Save Money</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Apply actionable tips to lower utility overheads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              Why Households and Small Businesses Rely on AI Guardian
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              We translate utility raw billing metrics into simple, actionable intelligence. It's like having a dedicated utility auditor in your pocket 24/7.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded bg-success/15 flex items-center justify-center text-success shrink-0 mt-1">✓</div>
                <div>
                  <h5 className="font-semibold text-xs text-white">Financial Clarity</h5>
                  <p className="text-[11px] text-slate-400">Never get caught off guard by electricity board changes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded bg-success/15 flex items-center justify-center text-success shrink-0 mt-1">✓</div>
                <div>
                  <h5 className="font-semibold text-xs text-white">Better Budgeting</h5>
                  <p className="text-[11px] text-slate-400">Predict future utility costs up to 6 months in advance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded bg-success/15 flex items-center justify-center text-success shrink-0 mt-1">✓</div>
                <div>
                  <h5 className="font-semibold text-xs text-white">Utility Cost Reduction</h5>
                  <p className="text-[11px] text-slate-400">Access tailored, verified tips designed to slash costs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded bg-success/15 flex items-center justify-center text-success shrink-0 mt-1">✓</div>
                <div>
                  <h5 className="font-semibold text-xs text-white">Sustainability Awareness</h5>
                  <p className="text-[11px] text-slate-400">Track and lower carbon footprints by managing resources.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-secondary/15 to-primary/15 blur-lg -z-10" />
            <h4 className="font-display font-bold text-sm text-white mb-6">User Success Story</h4>
            <blockquote className="text-xs text-slate-300 italic leading-relaxed mb-6">
              "We noticed our water bill creeping up over three months. AI Bill Guardian immediately flagged it as a water leak anomaly in March, estimating an 83% spike. We checked and found a major toilet leak behind the tiling. It saved us thousands!"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-primary-light">
                AS
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">Ananya Sen</h5>
                <p className="text-[10px] text-slate-500">Salaried Professional, Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 md:px-12 bg-surface-dark/50 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Start free and unlock premium AI features as your household or business scales.
            </p>

            {/* Toggle Billing */}
            <div className="inline-flex items-center gap-2 bg-surface border border-white/10 rounded-full p-1 mt-6">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`text-[10px] font-semibold px-4 py-1.5 rounded-full transition-all ${billingCycle === 'monthly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`text-[10px] font-semibold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Yearly
                <span className="text-[8px] bg-accent/20 text-accent-light px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Plan</span>
                <h3 className="text-3xl font-display font-bold text-white mt-4">₹0</h3>
                <p className="text-[10px] text-slate-500 mt-2">For single households getting started</p>
                <hr className="border-white/10 my-6" />
                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ Upload 2 bills per month</li>
                  <li className="flex items-center gap-2">✓ Standard OCR Data Extraction</li>
                  <li className="flex items-center gap-2">✓ Basic Spend Analytics</li>
                  <li className="flex items-center gap-2 text-slate-500">✗ AI Bill Explanations</li>
                  <li className="flex items-center gap-2 text-slate-500">✗ Time-Series Predictions</li>
                </ul>
              </div>
              <button onClick={startApp} className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 rounded-xl border border-white/10 transition-all">
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border-2 border-primary relative overflow-hidden shadow-xl shadow-primary/10">
              <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold tracking-widest uppercase px-4 py-1 rounded-bl">
                Popular
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary-light uppercase tracking-wider">Pro Plan</span>
                <h3 className="text-3xl font-display font-bold text-white mt-4">
                  {billingCycle === 'yearly' ? '₹199' : '₹249'}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-2">Perfect for nuclear families & professionals</p>
                <hr className="border-white/10 my-6" />
                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ Unlimited uploads</li>
                  <li className="flex items-center gap-2">✓ AI Bill Hikes Explanation</li>
                  <li className="flex items-center gap-2">✓ 6-Month Predictive Forecasts</li>
                  <li className="flex items-center gap-2">✓ Leak & Subscription Anomaly Alerts</li>
                  <li className="flex items-center gap-2">✓ Voice Assistant & WhatsApp access</li>
                </ul>
              </div>
              <button onClick={startApp} className="w-full mt-8 bg-primary hover:bg-primary-light text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-primary/20 transition-all">
                Start Free Trial
              </button>
            </div>

            {/* Family/Business */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border border-white/5 hover:border-white/10 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Family Plan</span>
                <h3 className="text-3xl font-display font-bold text-white mt-4">
                  {billingCycle === 'yearly' ? '₹399' : '₹499'}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-2">For multi-home monitoring & small businesses</p>
                <hr className="border-white/10 my-6" />
                <ul className="space-y-3.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ Up to 5 linked accounts</li>
                  <li className="flex items-center gap-2">✓ High-priority OCR extraction</li>
                  <li className="flex items-center gap-2">✓ Custom API & database export</li>
                  <li className="flex items-center gap-2">✓ Multi-language localized SMS alerts</li>
                  <li className="flex items-center gap-2">✓ Shared team/family dashboards</li>
                </ul>
              </div>
              <button onClick={startApp} className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 rounded-xl border border-white/10 transition-all">
                Select Family Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">
            Everything you need to know about AI Bill Guardian.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className="glass-panel rounded-xl overflow-hidden border border-white/5 transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-5 flex items-center justify-between text-left text-xs font-semibold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <HelpIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === index && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-surface-dark py-12 px-6 md:px-12 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-slate-300">AI Bill Guardian</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#problem" className="hover:text-slate-300">Privacy</a>
            <a href="#features" className="hover:text-slate-300">Terms</a>
            <a href="#how" className="hover:text-slate-300">Support</a>
          </div>
          
          <p>© {new Date().getFullYear()} AI Bill Guardian. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};
