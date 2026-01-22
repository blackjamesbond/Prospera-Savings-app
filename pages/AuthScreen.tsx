
import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, Shield, ChevronDown, Loader2, Key } from 'lucide-react';
import { UserRole } from '../types.ts';
import { useAppContext } from '../context/AppContext.tsx';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
  initialMode?: 'LOGIN' | 'FOUND' | 'JOIN';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, initialMode = 'LOGIN' }) => {
  const { groups, createGroup, login, showToast } = useAppContext();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'FOUND' | 'JOIN'>(initialMode);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const [foundName, setFoundName] = useState('');
  const [currency, setCurrency] = useState('KES');

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      if (authMode === 'FOUND') {
        const newGroup = createGroup(foundName, fullName, email, currency);
        login(email, UserRole.ADMIN, newGroup.id, fullName, newGroup);
        onLogin(UserRole.ADMIN);
      } else if (authMode === 'JOIN') {
        if (!fullName.trim()) {
          showToast("Please provide your full name.", "error");
          setIsProcessing(false);
          return;
        }
        login(email, UserRole.USER, selectedGroup, fullName);
        onLogin(UserRole.USER);
      } else {
        try {
          const role = email.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER;
          const targetGroup = selectedGroup || (groups.length > 0 ? groups[0].id : '');
          login(email, role, targetGroup);
          onLogin(role);
        } catch (err: any) {
          if (err.message === "MEMBER_NOT_FOUND") {
            showToast("Member record not found. Please join the group first.", "error");
            setAuthMode('JOIN'); 
          } else {
            showToast("Login failed. Check your details.", "error");
          }
        }
      }
    } catch (error) {
      console.error('Auth failure:', error);
      showToast("System error. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-prospera-darkest flex items-center justify-center p-6 terminal-grid">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <Target className="absolute -top-40 -left-40 w-[800px] h-[800px] text-prospera-accent rotate-12" />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-prospera-accent rounded-xl mb-4 shadow-2xl shadow-prospera-accent/40 ring-4 ring-prospera-accent/20">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter mb-0.5 text-white leading-none">Prospera</h1>
          <p className="text-prospera-gray font-black uppercase tracking-[0.3em] text-[8px] opacity-70 mt-1.5">Secure Savings Terminal</p>
        </div>

        <div className="bg-prospera-dark border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
            <Key className="w-24 h-24 text-white" />
          </div>

          <div className="flex bg-prospera-darkest/80 p-1 rounded-lg mb-6 border border-white/5 relative z-10">
             {(['LOGIN', 'JOIN', 'FOUND'] as const).map((mode) => (
               <button 
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode)}
                className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-md transition-all duration-300 ${authMode === mode ? 'bg-prospera-accent text-white shadow-xl shadow-prospera-accent/20' : 'text-prospera-gray hover:text-white'}`}
               >
                 {mode === 'LOGIN' ? 'Login' : mode === 'JOIN' ? 'Join' : 'Create'}
               </button>
             ))}
          </div>

          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            {authMode === 'FOUND' && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-prospera-gray uppercase tracking-widest ml-1">Group Identifier</label>
                  <input required type="text" value={foundName} onChange={e => setFoundName(e.target.value)} className="w-full px-4 py-2.5 bg-prospera-darkest/50 border border-white/5 rounded-lg focus:border-prospera-accent outline-none text-white font-bold text-xs shadow-inner" placeholder="Alpha Savings Circle" />
                </div>
              </div>
            )}

            {(authMode === 'JOIN' || authMode === 'LOGIN') && (
              <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-500">
                <label className="text-[8px] font-black text-prospera-gray uppercase tracking-widest ml-1">Select Active Group</label>
                <div className="relative">
                  <select 
                    required 
                    value={selectedGroup} 
                    onChange={e => setSelectedGroup(e.target.value)}
                    className="w-full px-4 py-2.5 bg-prospera-darkest/50 border border-white/5 rounded-lg focus:border-prospera-accent outline-none text-white font-bold text-xs appearance-none shadow-inner cursor-pointer"
                  >
                    <option value="" disabled>Choose target vault...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prospera-gray pointer-events-none" />
                </div>
              </div>
            )}

            {(authMode === 'JOIN' || authMode === 'FOUND') && (
              <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-500">
                <label className="text-[8px] font-black text-prospera-gray uppercase tracking-widest ml-1">Full Member Name</label>
                <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2.5 bg-prospera-darkest/50 border border-white/5 rounded-lg focus:border-prospera-accent outline-none text-white font-bold text-xs shadow-inner" placeholder="John Doe" />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-prospera-gray uppercase tracking-widest ml-1">Auth Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-prospera-darkest/50 border border-white/5 rounded-lg focus:border-prospera-accent outline-none text-white font-bold text-xs shadow-inner" placeholder="name@domain.com" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-prospera-gray uppercase tracking-widest ml-1">Passkey</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-prospera-darkest/50 border border-white/5 rounded-lg focus:border-prospera-accent outline-none text-white font-bold text-xs shadow-inner" placeholder="••••••••" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-4 bg-prospera-accent text-white font-black uppercase tracking-[0.3em] text-[9px] rounded-xl flex items-center justify-center gap-2 shadow-2xl shadow-prospera-accent/40 hover:scale-[1.01] transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {authMode === 'FOUND' ? 'Establish Circle' : authMode === 'JOIN' ? 'Request Ingress' : 'Login Terminal'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-white/5 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 shadow-inner">
                <Shield className="w-2.5 h-2.5 text-prospera-accent" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-prospera-gray">AES-256 Vault Encryption</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
