import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthPageProps {
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const { loginUser, signupUser } = useApp();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isLoginMode && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLoginMode) {
        await loginUser(email, password);
      } else {
        await signupUser(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Auth Container Card */}
      <div className="w-full max-w-[400px] glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl relative space-y-6">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary/10 to-accent/10 blur-xl -z-10" />
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mx-auto shadow-lg shadow-primary/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">AI Bill Guardian</h3>
          <p className="text-[10px] text-slate-500">
            {isLoginMode ? 'Sign in to access your bill intelligence' : 'Create an account to start saving'}
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="grid grid-cols-2 bg-surface-dark/60 rounded-xl p-1 border border-white/5">
          <button
            onClick={() => { setIsLoginMode(true); setError(null); }}
            className={`text-xs font-semibold py-2 rounded-lg transition-all ${
              isLoginMode ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginMode(false); setError(null); }}
            className={`text-xs font-semibold py-2 rounded-lg transition-all ${
              !isLoginMode ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-danger/10 border border-danger/25 text-danger rounded-xl text-[10px] flex items-start gap-2 text-left font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Name Field (Sign Up only) */}
          {!isLoginMode && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Subham Sharma"
                  className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLoginMode ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

        </form>

        {/* Demo credentials tip (Login only) */}
        {isLoginMode && (
          <div className="p-3 bg-primary/5 border border-primary/15 rounded-xl text-center space-y-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Demo Account Details</span>
            <div className="text-[10px] text-slate-400 font-mono">
              Email: <span className="text-white font-bold">subham.sharma@example.com</span><br />
              Password: <span className="text-white font-bold">password123</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
