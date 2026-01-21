
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext.tsx';
import LandingPage from './components/LandingPage.tsx';
import AuthScreen from './pages/AuthScreen.tsx';
import MainLayout from './components/Layout.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import UserDashboard from './pages/UserDashboard.tsx';
import TransactionManagement from './pages/TransactionManagement.tsx';
import SavingsTargetPage from './pages/SavingsTargetPage.tsx';
import UsersManagement from './pages/UsersManagement.tsx';
import AnnouncementsPage from './pages/AnnouncementsPage.tsx';
import AIInsightsPage from './pages/AIInsightsPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx';
import AIChatBot from './components/AIChatBot.tsx';
import Toast from './components/Toast.tsx';
import { UserRole, UserStatus } from './types.ts';
import { Shield, Lock, Fingerprint, Scan, ShieldAlert, Key, Delete, Timer, Smartphone, UserCog, Loader2, Hourglass, ShieldCheck } from 'lucide-react';

const SecurityLock: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const { preferences, updatePreferences, showToast } = useAppContext();
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const handleKeyPress = (key: string | number) => {
    if (preferences.isBlocked) return;
    if (key === 'DELETE') { setPin(prev => prev.slice(0, -1)); return; }
    if (pin.length < 4) {
      const newPin = pin + String(key); setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === preferences.appPin) { updatePreferences({ failedAttempts: 0 }); onUnlock(); }
        else { setShake(true); setTimeout(() => setShake(false), 500); setPin(''); const newFails = preferences.failedAttempts + 1; updatePreferences({ failedAttempts: newFails, isBlocked: newFails >= 5 }); showToast(newFails >= 5 ? 'App Locked.' : 'Incorrect PIN.', 'error'); }
      }
    }
  };
  return (
    <div className="fixed inset-0 z-[9999] bg-prospera-darkest flex items-center justify-center p-6 backdrop-blur-3xl">
      <div className={`w-full max-w-xs text-center transition-transform ${shake ? 'animate-bounce' : ''}`}>
        <div className="mb-8 relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 shadow-2xl overflow-hidden">
          {preferences.isBlocked ? <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" /> : <Lock className="w-8 h-8 text-white/50" />}
        </div>
        <h2 className="text-2xl font-black mb-1 text-white tracking-tighter">{preferences.isBlocked ? 'Lockdown' : 'Vault Access'}</h2>
        <p className="text-prospera-gray font-black uppercase tracking-[0.4em] text-[7px] mb-10">Verification Required</p>
        <div className="flex justify-center gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all ${pin.length > i ? 'bg-prospera-accent border-prospera-accent' : 'border-white/10'}`} />)}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'BIO'].map(num => (
            <button key={num} onClick={() => num === 'DEL' ? handleKeyPress('DELETE') : handleKeyPress(num as number)} className={`h-14 rounded-2xl flex items-center justify-center text-lg font-black transition-all active:scale-90 ${typeof num === 'number' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-prospera-accent/10 text-prospera-accent'}`}>{num === 'DEL' ? <Delete className="w-5 h-5" /> : num === 'BIO' ? <Fingerprint className="w-5 h-5" /> : num}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PendingAccessScreen: React.FC = () => {
  const { logout } = useAppContext();
  return (
    <div className="fixed inset-0 z-[9999] bg-prospera-darkest flex items-center justify-center p-8 terminal-grid">
      <div className="max-w-md w-full p-10 bg-prospera-dark border border-white/5 rounded-[3rem] text-center space-y-8 shadow-2xl">
        <div className="w-24 h-24 bg-prospera-accent/10 rounded-[2rem] flex items-center justify-center mx-auto">
          <Hourglass className="w-10 h-10 text-prospera-accent animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tighter">Awaiting Clearance</h2>
          <p className="text-prospera-gray font-bold text-sm leading-relaxed">Your ingress request has been logged. The Lead Founder must authorize your vault credentials before you can access the group ledger.</p>
        </div>
        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-prospera-accent" />
          <p className="text-[9px] font-black uppercase tracking-widest text-prospera-gray">Protocol: Security Vetting Active</p>
        </div>
        <button onClick={logout} className="w-full py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-white/10">Back to Terminal</button>
      </div>
    </div>
  );
};

const AppInternal: React.FC = () => {
  const { currentUser, logout, preferences, updatePreferences, toast } = useAppContext();
  const [showAuth, setShowAuth] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'LOGIN' | 'FOUND' | 'JOIN'>('LOGIN');
  const [isLocked, setIsLocked] = useState(true);
  const [currentPath, setCurrentPath] = useState('dashboard');
  const lockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--prospera-accent', preferences.primaryColor);
    document.documentElement.setAttribute('data-font-size', preferences.fontSize || 'medium');
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences.primaryColor, preferences.theme, preferences.fontSize]);

  const resetLockTimer = useCallback(() => {
    if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
    if (preferences.autoLockTimeout > 0 && !isLocked) lockTimerRef.current = window.setTimeout(() => setIsLocked(true), preferences.autoLockTimeout * 60 * 1000);
  }, [preferences.autoLockTimeout, isLocked]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handler = () => resetLockTimer();
    events.forEach(e => window.addEventListener(e, handler)); resetLockTimer();
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, [resetLockTimer]);

  if (!currentUser) {
    if (showAuth) return <AuthScreen initialMode={authInitialMode} onLogin={() => setCurrentPath('dashboard')} />;
    return <LandingPage onStart={() => { setAuthInitialMode('FOUND'); setShowAuth(true); }} onLogin={() => { setAuthInitialMode('LOGIN'); setShowAuth(true); }} />;
  }

  if (isLocked) return <SecurityLock onUnlock={() => setIsLocked(false)} />;
  if (currentUser.status === UserStatus.PENDING) return <PendingAccessScreen />;

  const renderContent = () => {
    switch (currentPath) {
      case 'dashboard': return currentUser.role === UserRole.ADMIN ? <AdminDashboard /> : <UserDashboard />;
      case 'transactions': return <TransactionManagement role={currentUser.role} />;
      case 'savings-target': return <SavingsTargetPage role={currentUser.role} />;
      case 'users': return <UsersManagement />;
      case 'announcements': return <AnnouncementsPage role={currentUser.role} />;
      case 'reports': return <ReportsPage />;
      case 'ai-insights': return <AIInsightsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'settings': return <SettingsPage onLock={() => setIsLocked(true)} />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <MainLayout role={currentUser.role} onLogout={logout} currentPath={currentPath} onNavigate={setCurrentPath} isDarkMode={preferences.theme === 'dark'} toggleDarkMode={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}>
      <div className="animate-in fade-in duration-500">{renderContent()}</div>
      <AIChatBot />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </MainLayout>
  );
};

const App: React.FC = () => <AppProvider><AppInternal /></AppProvider>;
export default App;
