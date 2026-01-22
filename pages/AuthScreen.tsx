
import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, Shield, User as UserIcon, Settings, Globe, Search, ChevronDown, Check, Loader2, Key, ShieldAlert } from 'lucide-react';
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
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const [foundName, setFoundName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [currency, setCurrency] = useState('KES');

  // React to initialMode changes if the component is re-mounted
  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      if (authMode === 'FOUND') {
        const newGroup = createGroup(foundName, adminName, email, currency);
        login(email, UserRole.ADMIN, newGroup.id, adminName, newGroup);
        onLogin(UserRole.ADMIN);
      } else if (authMode === 'JOIN') {
        login(email, UserRole.USER, selectedGroup);
        onLogin(UserRole.USER);
      } else {
        // LOGIN mode: Strict membership check
        try {
          const role = email.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER;
          const targetGroup = selectedGroup || (groups.length > 0 ? groups[0].id : '');
          login(email, role, targetGroup);
          onLogin(role);
        } catch (err: any) {
          if (err.message === "MEMBER_NOT_FOUND") {
            showToast("Invalid user, sign up with the circle first.", "error");
            setAuthMode('JOIN'); // Redirect to Join form
          } else {
            showToast("Authentication protocol failed.", "error");
          }
        }
      }
    } catch (error) {
      console.error('Auth failure:', error);
      showToast("Critical system error during authentication.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-prospera-darkest flex items-center justify-center p-6 terminal-grid">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <Target className="absolute -top-40 -left-40 w-[800px] h-[800px] text-prospera-accent rotate-12" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-prospera-accent rounded-[1.8rem] mb-8 shadow-2xl shadow-prospera-accent/40 ring-4 ring-prospera-accent/20">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-3 text-white">Prospera Vault</h1>
          <p className="text-prospera-gray font-black uppercase tracking-[0.4em] text-[10px] opacity-70">Secured Intelligence Terminal</p>
        </div>

        <div className="bg-prospera-dark border border-white/10 p-10 rounded-[3rem] shadow-2xl shadow-black/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <Key className="w-48 h-48 text-white" />
          </div>

          <div className="flex bg-prospera-darkest/80 p-1.5 rounded-2xl mb-10 border border-white/5 relative z-10">
             {(['LOGIN', 'JOIN', 'FOUND'] as const).map((mode) => (
               <button 
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${authMode === mode ? 'bg-prospera-accent text-white shadow-xl shadow-prospera-accent/20' : 'text-prospera-gray hover:text-white'}`}
               >
                 {mode === 'LOGIN' ? 'Access' : mode === 'JOIN' ? 'Join' : 'Found'}
               </button>
             ))}
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {authMode === 'FOUND' && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1 text-center block">Circle Identifier (Name)</label>
                  <input required type="text" value={foundName} onChange={e => setFoundName(e.target.value)} className="w-full px-6 py-5 bg-prospera-darkest/50 border border-white/5 rounded-2xl focus:border-prospera-accent outline-none text-white font-bold text-sm shadow-inner" placeholder="e.g. Phoenix Vanguard" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1 text-center block">Lead Founder</label>
                    <input required type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full px-6 py-5 bg-prospera-darkest/50 border border-white/5 rounded-2xl focus:border-prospera-accent outline-none text-white font-bold text-sm shadow-inner" placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1 text-center block">Currency</label>
                    <div className="relative">
                      <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-6 py-5 bg-prospera-darkest/50 border border-white/5 rounded-2xl focus:border-prospera-accent outline-none text-white font-black text-[11px] uppercase tracking-widest appearance-none shadow-inner cursor-pointer">
                         <option value="KES">KES</option>
                         <option value="USD">USD</option>
                         <option value="EUR">EUR</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prospera-gray pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(authMode === 'JOIN' || authMode === 'LOGIN') && (
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1 text-center block">Target Infrastructure (Circle)</label>
                <div className="relative">
                  <select 
                    required 
                    value={selectedGroup} 
                    onChange={e => setSelectedGroup(e.target.value)}
                    className="w-full px-6 py-5 bg-prospera-darkest/50 border border-white/5 rounded-2xl focus:border-prospera-accent outline-none text-white font-bold text-sm appearance-none shadow-inner cursor-pointer"
                  >
                    <option value="" disabled>Select Target Protocol...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prospera-gray pointer-events-none" />
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1 text-center block">Authorized Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-5 bg-prospera-darkest/50 border border-white/5 rounded-2xl focus:border-prospera-accent outline-none text-white font-bold text-sm shadow-inner" placeholder="name@vault.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1 text-center block">Encryption Key (Password)</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-5 bg-prospera-darkest/50 border border-white/5 rounded-2xl focus:border-prospera-accent outline-none text-white font-bold text-sm shadow-inner" placeholder="••••••••" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-6 bg-prospera-accent text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[1.8rem] flex items-center justify-center gap-4 shadow-2xl shadow-prospera-accent/40 hover:scale-[1.02] transition-all active:scale-[0.98] mt-8 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {authMode === 'FOUND' ? 'Initialize Circle' : authMode === 'JOIN' ? 'Request Ingress' : 'Verify Identity'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
             <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 rounded-full border border-white/5 shadow-inner">
                <Shield className="w-4 h-4 text-prospera-accent" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-prospera-gray">AES-256 Protocol Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
