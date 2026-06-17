import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/UploadPage';
import { OcrPage } from './pages/OcrPage';
import { InsightsPage } from './pages/InsightsPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { WhatsAppBotPage } from './pages/WhatsAppBotPage';
import { DatabaseSchemaPage } from './pages/DatabaseSchemaPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { AdminPage } from './pages/AdminPage';
import { VoiceChatbot } from './components/VoiceChatbot';

import { 
  LayoutDashboard, Upload, Eye, Brain, LineChart, CheckSquare, 
  AlertTriangle, MessageSquare, Database, FileCode, Users, LogOut, 
  Menu, X, Shield, Globe 
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { 
    activeTab, setActiveTab, setAuthStatus, language, setLanguage, 
    translate, profile, alerts 
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  const menuItems = [
    { id: 'dashboard', name: translate('nav_dashboard'), icon: LayoutDashboard },
    { id: 'upload', name: translate('nav_upload'), icon: Upload },
    { id: 'ocr', name: translate('nav_ocr'), icon: Eye },
    { id: 'insights', name: translate('nav_insights'), icon: Brain },
    { id: 'predictions', name: translate('nav_predictions'), icon: LineChart },
    { id: 'recommendations', name: translate('nav_recommendations'), icon: CheckSquare },
    { id: 'anomalies', name: translate('nav_anomalies'), icon: AlertTriangle, badge: activeAlertsCount },
    { id: 'whatsapp', name: translate('nav_whatsapp'), icon: MessageSquare },
    { id: 'schema', name: translate('nav_schema'), icon: Database },
    { id: 'api', name: translate('nav_api'), icon: FileCode },
    { id: 'admin', name: translate('nav_admin'), icon: Users },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'gu', name: 'ગુજરાતી' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setAuthStatus('guest');
    setActiveTab('landing');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <UploadPage />;
      case 'ocr':
        return <OcrPage />;
      case 'insights':
        return <InsightsPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'anomalies':
        return <AnomaliesPage />;
      case 'whatsapp':
        return <WhatsAppBotPage />;
      case 'schema':
        return <DatabaseSchemaPage />;
      case 'api':
        return <ApiDocsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-slate-100">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full fixed top-0 z-30 bg-surface border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-light" />
          <span className="font-display font-bold text-sm text-white">AI Bill Guardian</span>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-white/5 flex flex-col justify-between
        transform md:translate-x-0 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:block'}
        ${mobileMenuOpen ? 'pt-16' : 'pt-0'}
      `}>
        
        {/* Brand details */}
        <div>
          <div className="hidden md:flex items-center gap-2.5 px-6 py-6 border-b border-white/5">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-slate-200">
              AI Bill Guardian
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[60vh] scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isActive 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/15' 
                      : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-danger text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Language panel */}
        <div className="p-4 border-t border-white/5 space-y-4 bg-surface-dark/50">
          
          {/* Language Selector */}
          <div className="flex items-center justify-between gap-2 bg-surface border border-white/5 rounded-xl p-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">Lang</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-[10px] text-slate-300 font-bold focus:outline-none cursor-pointer pr-4"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-surface text-white">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* User profile details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-primary-light border border-white/5">
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h5 className="text-[11px] font-semibold text-slate-200 truncate w-28">{profile.name}</h5>
                <p className="text-[9px] text-slate-500 truncate w-28">{profile.email}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/5 hover:bg-danger/10 text-slate-400 hover:text-danger transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* Main Work Area */}
      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6 min-h-screen overflow-x-hidden">
        {renderContent()}
      </main>

      {/* Speech Chatbot */}
      <VoiceChatbot />

    </div>
  );
};

const AppContent: React.FC = () => {
  const { authStatus } = useApp();
  
  if (authStatus === 'guest') {
    return <LandingPage />;
  }

  return <DashboardLayout />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
