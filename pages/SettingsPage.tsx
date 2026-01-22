
import React, { useState, useRef } from 'react';
// Added missing 'Target' to imports from lucide-react
import { Settings, Shield, Bell, User as UserIcon, Palette, Globe, Lock, ChevronRight, Save, ArrowLeft, Eye, EyeOff, Code2, Camera, Info, Sun, Sparkles, Check, Trash, Key, Timer, Smartphone, Layout, Type, ToggleRight, Target } from 'lucide-react';
import { useAppContext, AVATAR_SILHOUETTES } from '../context/AppContext.tsx';
import { UserRole } from '../types.ts';

interface SettingsPageProps {
  onLock: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLock }) => {
  const { preferences, updatePreferences, currentUser, updateCurrentUser, showToast } = useAppContext();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  
  const [profileForm, setProfileForm] = useState({ 
    name: currentUser?.name || '', 
    email: currentUser?.email || '',
    profileImage: currentUser?.profileImage || '',
    gender: currentUser?.gender || 'male'
  });
  const [pinForm, setPinForm] = useState(preferences.appPin);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const sections = [
    { id: 'profile', name: 'Profile Dossier', icon: UserIcon, desc: 'Manage your personal group identity' },
    { id: 'security', name: 'Security Protocol', icon: Shield, desc: 'PIN codes and auto-lock heuristics' },
    { id: 'dashboard', name: 'Dashboard Layout', icon: ToggleRight, desc: 'Personalize your interface modules' },
    ...(isAdmin ? [{ id: 'branding', name: 'Global Branding', icon: Layout, desc: 'Control group UI colors and theme' }] : []),
    { id: 'appearance', name: 'Display Preferences', icon: Palette, desc: 'Switch modes and local UI tweaks' },
    { id: 'about', name: 'System Info', icon: Info, desc: 'Version data and technical logs' },
  ];

  const presets = [
    { name: 'Emerald', color: '#01C38D' },
    { name: 'Sapphire', color: '#3182CE' },
    { name: 'Amethyst', color: '#9F7AEA' },
    { name: 'Crimson', color: '#E53E3E' },
    { name: 'Amber', color: '#D69E2E' },
    { name: 'Terminal', color: '#22C55E' }
  ];

  const handleProfileSave = () => {
    updateCurrentUser(profileForm);
    setActiveSection(null);
  };

  const handleSecuritySave = () => {
    if (pinForm.length !== 4) {
      showToast('PIN must be exactly 4 digits.', 'error');
      return;
    }
    updatePreferences({ appPin: pinForm });
    showToast('Vault security updated.', 'success');
    setActiveSection(null);
  };

  const toggleDashboardModule = (key: keyof typeof preferences.dashboardConfig) => {
    updatePreferences({
      dashboardConfig: {
        ...preferences.dashboardConfig,
        [key]: !preferences.dashboardConfig[key]
      }
    });
  };

  const renderActiveSection = () => {
    const inputClasses = "w-full px-5 py-4 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white text-gray-900 transition-all";
    const subCardClasses = "flex items-center justify-between p-6 bg-gray-50 dark:bg-prospera-darkest rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm";

    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3">
              <UserIcon className="text-prospera-accent w-6 h-6" />
              Member Identity
            </h3>
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-prospera-accent/20 p-1 overflow-hidden bg-white dark:bg-prospera-darkest shadow-2xl group-hover:scale-105 transition-transform">
                  <img src={profileForm.profileImage || AVATAR_SILHOUETTES[profileForm.gender as keyof typeof AVATAR_SILHOUETTES]} alt="" className="w-full h-full rounded-[2rem] object-cover" />
                </div>
                <button onClick={() => profileImageInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-3 bg-prospera-accent text-white rounded-2xl shadow-xl shadow-prospera-accent/30 hover:scale-110 transition-all"><Camera className="w-5 h-5" /></button>
                <input type="file" ref={profileImageInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setProfileForm(p => ({ ...p, profileImage: reader.result as string }));
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Member Alias</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Authorized Protocol Address (Email)</label>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={inputClasses} />
              </div>
              <button onClick={handleProfileSave} className="w-full py-5 bg-prospera-accent text-white font-black uppercase tracking-widest text-[11px] rounded-2xl mt-4 shadow-2xl shadow-prospera-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all">Authorize Identity Commit</button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3">
              <Lock className="text-prospera-accent w-6 h-6" />
              Vault Lockdown Protocols
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest text-center block">Secure PIN Entry</label>
              <input type="password" maxLength={4} value={pinForm} onChange={(e) => setPinForm(e.target.value.replace(/\D/g, ''))} className={`${inputClasses} text-center text-5xl tracking-[1.5em] h-28 bg-prospera-accent/5 border-prospera-accent/20`} placeholder="••••" />
            </div>
            <div className="space-y-4">
               <div className={subCardClasses}>
                  <div className="flex items-center gap-4">
                    <Timer className="w-5 h-5 text-prospera-accent" />
                    <div>
                      <p className="font-bold text-sm dark:text-white text-gray-900">Protocol Hibernation</p>
                      <p className="text-[9px] text-prospera-gray uppercase tracking-widest font-black">Inactivity Period Before Lock</p>
                    </div>
                  </div>
                  <select value={preferences.autoLockTimeout} onChange={(e) => updatePreferences({ autoLockTimeout: Number(e.target.value) })} className="bg-transparent font-black text-prospera-accent text-xs uppercase tracking-widest outline-none cursor-pointer">
                    <option value={1}>1 Min</option>
                    <option value={5}>5 Mins</option>
                    <option value={15}>15 Mins</option>
                    <option value={0}>Disabled</option>
                  </select>
               </div>
               <div className={subCardClasses}>
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-5 h-5 text-prospera-accent" />
                    <div>
                      <p className="font-bold text-sm dark:text-white text-gray-900">Background Masking</p>
                      <p className="text-[9px] text-prospera-gray uppercase tracking-widest font-black">Instant Lock on Blur</p>
                    </div>
                  </div>
                  <button onClick={() => updatePreferences({ lockOnBlur: !preferences.lockOnBlur })} className={`w-14 h-7 rounded-full relative transition-all ${preferences.lockOnBlur ? 'bg-prospera-accent shadow-[0_0_15px_var(--prospera-accent)]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${preferences.lockOnBlur ? 'left-8' : 'left-1'}`} />
                  </button>
               </div>
            </div>
            <button onClick={handleSecuritySave} className="w-full py-5 bg-prospera-darkest text-white border border-white/10 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-2xl transition-all hover:bg-black">Finalize Security State</button>
          </div>
        );
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3">
              <ToggleRight className="text-prospera-accent w-6 h-6" />
              Interface Configuration
            </h3>
            <p className="text-xs text-prospera-gray font-bold uppercase tracking-widest">Toggle visibility of specific dashboard modules.</p>
            
            <div className="space-y-4">
              {[
                { id: 'showAnalytics', name: isAdmin ? 'Distribution Analytics' : 'Performance Insights', icon: Layout },
                { id: 'showLogs', name: isAdmin ? 'Live Governance Logs' : 'System Activity Feed', icon: Bell },
                { id: 'showTarget', name: 'Active Objective Module', icon: Target },
                { id: 'showRecentTransactions', name: 'Recent Ledger Entries', icon: ArrowLeft },
              ].map(module => (
                <div key={module.id} className={subCardClasses}>
                  <div className="flex items-center gap-4">
                    <module.icon className="w-5 h-5 text-prospera-accent" />
                    <div>
                      <p className="font-bold text-sm dark:text-white text-gray-900">{module.name}</p>
                      <p className="text-[9px] text-prospera-gray uppercase tracking-widest font-black">Visibility Protocol</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleDashboardModule(module.id as keyof typeof preferences.dashboardConfig)} 
                    className={`w-14 h-7 rounded-full relative transition-all ${preferences.dashboardConfig[module.id as keyof typeof preferences.dashboardConfig] ? 'bg-prospera-accent shadow-[0_0_15px_var(--prospera-accent)]' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${preferences.dashboardConfig[module.id as keyof typeof preferences.dashboardConfig] ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'branding':
        return (
          <div className="space-y-10 animate-in slide-in-from-right duration-400">
            <div className="space-y-2">
              <h3 className="text-3xl font-black dark:text-white text-gray-900 flex items-center gap-4">
                <Palette className="text-prospera-accent w-8 h-8" />
                Global Branding Portal
              </h3>
              <p className="text-xs text-prospera-gray font-bold uppercase tracking-widest">Administrative Rights Active • Global Propagation Engine</p>
            </div>
            
            <div className="p-8 bg-prospera-accent/5 border border-prospera-accent/20 rounded-[2.5rem] space-y-8">
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Group Accent Protocol</label>
                 <div className="grid grid-cols-6 gap-4">
                   {presets.map(p => (
                     <button 
                        key={p.color} 
                        onClick={() => updatePreferences({ primaryColor: p.color })} 
                        className={`h-12 rounded-xl flex items-center justify-center border-4 transition-all active:scale-90 ${preferences.primaryColor === p.color ? 'border-white dark:border-prospera-accent shadow-2xl' : 'border-transparent'}`} 
                        style={{ backgroundColor: p.color }}
                     >
                       {preferences.primaryColor === p.color && <Check className="text-white w-5 h-5" />}
                     </button>
                   ))}
                 </div>
               </div>
               
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Custom Encryption Color (Hex)</label>
                 <div className="relative">
                    <input type="text" value={preferences.primaryColor} onChange={(e) => updatePreferences({ primaryColor: e.target.value })} className={`${inputClasses} pl-16`} maxLength={7} />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl shadow-inner border border-white/20" style={{ backgroundColor: preferences.primaryColor }} />
                 </div>
               </div>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-prospera-darkest/60 border border-gray-100 dark:border-white/5 rounded-[2.5rem] flex items-center gap-6">
               <div className="p-4 bg-prospera-accent rounded-2xl">
                 <Sparkles className="w-8 h-8 text-white" />
               </div>
               <p className="text-xs text-prospera-gray font-bold leading-relaxed uppercase tracking-wide">
                 NOTICE: Committing a global accent change affects the UI environment of <span className="text-prospera-accent">{currentUser?.groupName}</span> across all member terminals. Propagating now...
               </p>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-12 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 tracking-tight">Terminal Environment</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <button 
                onClick={() => updatePreferences({ theme: 'dark' })} 
                className={`p-10 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-6 relative overflow-hidden ${preferences.theme === 'dark' ? 'border-prospera-accent bg-prospera-accent/5' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-prospera-darkest/50 grayscale opacity-60'}`}
              >
                <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl"><Layout className="text-prospera-accent w-8 h-8" /></div>
                <div className="text-center">
                   <p className="font-black text-xs uppercase tracking-[0.2em] text-white">Deep Space</p>
                   <p className="text-[9px] text-prospera-gray uppercase font-bold mt-1">Maximum Immersion</p>
                </div>
              </button>
              <button 
                onClick={() => updatePreferences({ theme: 'light' })} 
                className={`p-10 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-6 relative overflow-hidden ${preferences.theme === 'light' ? 'border-prospera-accent bg-prospera-accent/5' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-prospera-darkest/50 grayscale opacity-60'}`}
              >
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-gray-100"><Sun className="text-yellow-500 w-8 h-8" /></div>
                <div className="text-center">
                   <p className="font-black text-xs uppercase tracking-[0.2em] text-gray-900">High Contrast</p>
                   <p className="text-[9px] text-prospera-gray uppercase font-bold mt-1">Solar Clarity</p>
                </div>
              </button>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3">
                 <Type className="w-5 h-5 text-prospera-accent" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-prospera-gray">Typography Scaling</h4>
               </div>
               <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-prospera-darkest/50 p-2 rounded-3xl border border-gray-100 dark:border-white/5">
                 {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updatePreferences({ fontSize: size })}
                      className={`py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${preferences.fontSize === size ? 'bg-prospera-accent text-white shadow-xl' : 'text-prospera-gray hover:bg-white/5'}`}
                    >
                      <span className={`font-black ${size === 'small' ? 'text-xs' : size === 'medium' ? 'text-base' : 'text-xl'}`}>Aa</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">{size}</span>
                    </button>
                 ))}
               </div>
               <p className="text-[9px] text-center text-prospera-gray font-black uppercase tracking-widest">Adjusts the root scaling factor across all system panels.</p>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3 tracking-tight">
              <Code2 className="text-prospera-accent w-6 h-6" />
              Terminal Metadata
            </h3>
            <div className="p-12 bg-gray-50 dark:bg-prospera-darkest/80 rounded-[4rem] border border-gray-100 dark:border-white/5 space-y-10 text-center terminal-grid relative">
              <div className="relative inline-block">
                 <img src={preferences.developerImage || AVATAR_SILHOUETTES.male} alt="" className="w-32 h-32 rounded-[3rem] border-4 border-prospera-accent mx-auto object-cover shadow-2xl" />
                 <div className="absolute -bottom-2 -right-2 bg-prospera-accent text-white p-2 rounded-xl shadow-xl">
                    <Shield className="w-4 h-4" />
                 </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-3xl font-black dark:text-white text-gray-900 tracking-tighter">Dominic Gekonde</h4>
                <p className="text-prospera-accent text-[11px] font-black uppercase tracking-[0.4em]">Lead Terminal Architect</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <span className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-prospera-gray tracking-widest uppercase">Version 3.5.1-LTS</span>
                 <span className="px-6 py-2.5 bg-prospera-accent/10 border border-prospera-accent/20 rounded-2xl text-[10px] font-black text-prospera-accent tracking-widest uppercase">Active Protocol Stable</span>
              </div>
              <p className="text-xs text-prospera-gray font-medium max-w-sm mx-auto leading-relaxed">
                This terminal is protected by decentralized encryption protocols. All records are verified on the group ledger.
              </p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black dark:text-white text-gray-900 tracking-tighter flex items-center gap-5">
            <div className="p-4 bg-prospera-accent rounded-3xl shadow-2xl shadow-prospera-accent/30">
              <Settings className="text-white w-8 h-8" />
            </div>
            Terminal Control
          </h1>
          <p className="text-prospera-gray font-black uppercase tracking-[0.3em] text-[10px] ml-20">Member Profile & System Configurations</p>
        </div>
        <button onClick={onLock} className="px-10 py-5 bg-red-500 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
           <Lock className="w-4 h-4" /> Hard Lockdown
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-4">
          {sections.map(section => (
            <button 
              key={section.id} 
              onClick={() => setActiveSection(section.id)} 
              className={`w-full p-6 rounded-[2rem] flex items-center gap-6 transition-all text-left group relative overflow-hidden ${activeSection === section.id ? 'bg-prospera-accent text-white shadow-2xl shadow-prospera-accent/40' : 'bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 text-prospera-gray hover:text-prospera-accent shadow-xl'}`}
            >
              {activeSection === section.id && (
                 <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
                    <section.icon className="w-16 h-16" />
                 </div>
              )}
              <section.icon className={`w-6 h-6 shrink-0 transition-colors ${activeSection === section.id ? 'text-white' : 'text-prospera-accent'}`} />
              <div className="min-w-0 relative z-10">
                <p className="text-md font-black tracking-tight">{section.name}</p>
                <p className="text-[10px] font-bold opacity-60 truncate uppercase tracking-widest mt-0.5">{section.desc}</p>
              </div>
              <ChevronRight className={`w-5 h-5 ml-auto opacity-40 group-hover:translate-x-1 transition-transform ${activeSection === section.id && 'hidden'}`} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="p-10 md:p-14 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[4rem] shadow-2xl min-h-[600px] relative overflow-hidden flex flex-col">
            {activeSection ? (
              <div className="relative h-full animate-in fade-in duration-500">
                <button onClick={() => setActiveSection(null)} className="absolute -top-6 -left-6 p-3 text-prospera-gray hover:text-prospera-accent mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors bg-gray-50 dark:bg-white/5 rounded-xl border border-white/5 shadow-sm"><ArrowLeft className="w-4 h-4" /> Navigation Back</button>
                <div className="pt-12">{renderActiveSection()}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-10">
                <div className="w-40 h-40 bg-prospera-gray/10 rounded-full flex items-center justify-center mb-10"><Settings className="w-20 h-20 dark:text-white text-gray-900" /></div>
                <h3 className="text-3xl font-black dark:text-white text-gray-900 uppercase tracking-[0.4em]">Standby Profile</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
