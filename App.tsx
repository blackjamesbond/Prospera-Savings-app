
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext.tsx';
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
import { UserRole } from './types.ts';
import { Shield, Lock, Fingerprint, Scan, AlertOctagon, ShieldAlert, Key, Delete, CheckCircle2, RotateCcw, Sparkles, Smartphone, Timer, ChevronRight, ArrowRight, UserCog, UserCheck, Loader2 } from 'lucide-react';

// Security layer for PIN and biometric authentication
const SecurityLock: React.FC<{ onUnlock: () => void, onResetRequest: () => void }> = ({ onUnlock, onResetRequest }) => {
  const { preferences, updatePreferences, showToast } = useAppContext();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isBiometric, setIsBiometric] = useState(false);
  const [shake, setShake] = useState(false);
  const [resetStep, setResetStep] = useState(1);

  const ATTEMPT_LIMIT = 5;

  const handleKeyPress = (key: string | number) => {
    if (preferences.isBlocked && !preferences.resetAuthorized) return;
    if (key === 'DELETE') {
      if (preferences.resetAuthorized) {
        if (resetStep === 1) setPin(prev => prev.slice(0, -1));
        else setConfirmPin(prev => prev.slice(0, -1));
      } else {
        setPin(prev => prev.slice(0, -1));
      }
      return;
    }
    const currentPin = preferences.resetAuthorized ? (resetStep === 1 ? pin : confirmPin) : pin;
    if (currentPin.length < 4) {
      const nextChar = String(key);
      if (preferences.resetAuthorized) {
        if (resetStep === 1) {
          const newPin = pin + nextChar;
          setPin(newPin);
          if (newPin.length === 4) setTimeout(() => setResetStep(2), 400);
        } else {
          const newConfirm = confirmPin + nextChar;
          setConfirmPin(newConfirm);
          if (newConfirm.length === 4) {
             if (newConfirm === pin) {
                updatePreferences({ appPin: pin, isBlocked: false, failedAttempts: 0, resetAuthorized: false });
                showToast('PIN recovery successful!', 'success');
                onUnlock();
             } else {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setConfirmPin('');
                showToast('PINs do not match.', 'error');
             }
          }
        }
      } else {
        const newPin = pin + nextChar;
        setPin(newPin);
        if (newPin.length === 4) {
          if (newPin === preferences.appPin) {
            updatePreferences({ failedAttempts: 0 });
            onUnlock();
          } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setPin('');
            const newFails = preferences.failedAttempts + 1;
            if (newFails >= ATTEMPT_LIMIT) {
              updatePreferences({ failedAttempts: newFails, isBlocked: true });
              showToast('Security Breach: App Locked.', 'error');
            } else {
              updatePreferences({ failedAttempts: newFails });
              showToast(`Incorrect PIN. ${ATTEMPT_LIMIT - newFails} trials remaining.`, 'error');
            }
          }
        }
      }
    }
  };

  const handleBiometric = () => {
    if (preferences.isBlocked) return;
    setIsBiometric(true);
    setTimeout(() => {
      updatePreferences({ failedAttempts: 0 });
      onUnlock();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-prospera-darkest flex items-center justify-center p-6 backdrop-blur-3xl">
      <div className={`w-full max-w-sm text-center transition-transform ${shake ? 'animate-bounce' : ''}`}>
        <div className="mb-10 relative inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className={`absolute inset-0 transition-colors duration-500 ${preferences.resetAuthorized ? 'bg-prospera-accent/10' : preferences.isBlocked ? 'bg-red-500/10' : 'bg-white/5'}`} />
          {preferences.resetAuthorized ? <UserCog className="w-10 h-10 text-prospera-accent animate-pulse" /> : 
           preferences.isBlocked ? <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" /> : 
           isBiometric ? <Scan className="w-10 h-10 text-prospera-accent animate-pulse" /> : <Lock className="w-10 h-10 text-white/50" />}
        </div>
        <h2 className="text-3xl font-black mb-2 text-white tracking-tighter">
          {preferences.resetAuthorized ? (resetStep === 1 ? 'Reset Vault PIN' : 'Confirm PIN') : preferences.isBlocked ? 'Vault Lockdown' : 'Vault Access'}
        </h2>
        <p className="text-prospera-gray font-black uppercase tracking-[0.4em] text-[8px] mb-12">
          {preferences.resetAuthorized ? 'Establish a new key' : preferences.isBlocked ? 'Trial limit exceeded' : 'Verification Required'}
        </p>
        <div className="flex justify-center gap-6 mb-16">
          {[0, 1, 2, 3].map((i) => {
            const active = preferences.resetAuthorized ? (resetStep === 1 ? pin.length > i : confirmPin.length > i) : pin.length > i;
            return <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${active ? 'bg-prospera-accent border-prospera-accent shadow-[0_0_15px_var(--prospera-accent)]' : 'border-white/10'}`} />;
          })}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'BIO'].map(num => (
            <button
              key={num}
              onClick={() => num === 'DEL' ? handleKeyPress('DELETE') : num === 'BIO' ? handleBiometric() : handleKeyPress(num as number)}
              className={`h-16 rounded-[1.5rem] flex items-center justify-center text-xl font-black transition-all active:scale-90 ${typeof num === 'number' ? 'bg-white/5 text-white hover:bg-white/10 border border-white/5' : num === 'DEL' ? 'bg-red-500/10 text-red-500' : 'bg-prospera-accent/10 text-prospera-accent'}`}
            >
              {num === 'DEL' ? <Delete className="w-6 h-6" /> : num === 'BIO' ? <Fingerprint className="w-6 h-6" /> : num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppInternal: React.FC = () => {
  const { currentUser, logout, preferences, updatePreferences, toast } = useAppContext();
  const [isLocked, setIsLocked] = useState(true);
  const [currentPath, setCurrentPath] = useState('dashboard');
  const lockTimerRef = useRef<number | null>(null);

  // Dynamic Theme Controller
  useEffect(() => {
    document.documentElement.style.setProperty('--prospera-accent', preferences.primaryColor);
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.primaryColor, preferences.theme]);

  const resetLockTimer = useCallback(() => {
    if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
    if (preferences.autoLockTimeout > 0 && !isLocked) {
      lockTimerRef.current = window.setTimeout(() => setIsLocked(true), preferences.autoLockTimeout * 60 * 1000);
    }
  }, [preferences.autoLockTimeout, isLocked]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handler = () => resetLockTimer();
    events.forEach(e => window.addEventListener(e, handler));
    resetLockTimer();
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, [resetLockTimer]);

  if (!currentUser) return <AuthScreen onLogin={() => setCurrentPath('dashboard')} />;
  if (isLocked) return <SecurityLock onUnlock={() => setIsLocked(false)} onResetRequest={() => {}} />;

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
      default: return currentUser.role === UserRole.ADMIN ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  return (
    <MainLayout 
      role={currentUser.role} 
      onLogout={logout} 
      currentPath={currentPath} 
      onNavigate={setCurrentPath} 
      isDarkMode={preferences.theme === 'dark'}
      toggleDarkMode={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
    >
      <div className="animate-in fade-in duration-700">{renderContent()}</div>
      <AIChatBot />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </MainLayout>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppInternal />
  </AppProvider>
);

export default App;
