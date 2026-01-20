
import React, { useState, useRef } from 'react';
import { Settings, Shield, Bell, User as UserIcon, Palette, Globe, Lock, ChevronRight, Save, ArrowLeft, Eye, EyeOff, Code2, Camera, Info, Sun, Sparkles, Check, Trash, Key, Timer, Smartphone, Layout } from 'lucide-react';
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
    name: currentUser.name, 
    email: currentUser.email,
    profileImage: currentUser.profileImage || '',
    gender: currentUser.gender || 'male'
  });
  const [pinForm, setPinForm] = useState(preferences.appPin);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  const sections = [
    { id: 'profile', name: 'Profile Dossier', icon: UserIcon, desc: 'Manage your personal group identity' },
    { id: 'security', name: 'Security Protocol', icon: Shield, desc: 'PIN codes and auto-lock heuristics' },
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

  const renderActiveSection = () => {
    const inputClasses = "w-full px-5 py-4 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white text-gray-900";
    const subCardClasses = "flex items-center justify-between p-5 bg-gray-50 dark:bg-prospera-darkest rounded-2xl border border-gray-100 dark:border-white/5";

    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3">
              <UserIcon className="text-prospera-accent w-6 h-6" />
              Member Identity
            </h3>
            <div className="flex flex-col items-center gap-6 py-6 border-b border-gray-100 dark:border-white/5">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-prospera-accent/20 p-1 overflow-hidden bg-white dark:bg-prospera-darkest shadow-2xl">
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
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Member Name</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={inputClasses} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Encrypted Email</label>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={inputClasses} />
              </div>
              <button onClick={handleProfileSave} className="w-full py-5 bg-prospera-accent text-white font-black uppercase tracking-widest text-[10px] rounded-2xl mt-4 shadow-2xl shadow-prospera-accent/20">Authorize Profile Update</button>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3">
              <Key className="text-prospera-accent w-6 h-6" />
              Vault Lockdown
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest text-center block">Global Access PIN</label>
              <input type="password" maxLength={4} value={pinForm} onChange={(e) => setPinForm(e.target.value.replace(/\D/g, ''))} className={`${inputClasses} text-center text-4xl tracking-[1.5em] h-24`} placeholder="••••" />
            </div>
            <div className="space-y-4">
               <div className={subCardClasses}>
                  <div className="flex items-center gap-4">
                    <Timer className="w-5 h-5 text-prospera-accent" />
                    <div>
                      <p className="font-bold text-sm dark:text-white text-gray-900">Auto-Lock Timer</p>
                      <p className="text-[10px] text-prospera-gray uppercase tracking-widest">Inactivity Period</p>
                    </div>
                  </div>
                  <select value={preferences.autoLockTimeout} onChange={(e) => updatePreferences({ autoLockTimeout: Number(e.target.value) })} className="bg-transparent font-black text-prospera-accent text-xs uppercase tracking-widest outline-none">
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
                      <p className="font-bold text-sm dark:text-white text-gray-900">Privacy Masking</p>
                      <p className="text-[10px] text-prospera-gray uppercase tracking-widest">Lock on Background</p>
                    </div>
                  </div>
                  <button onClick={() => updatePreferences({ lockOnBlur: !preferences.lockOnBlur })} className={`w-12 h-6 rounded-full relative transition-all ${preferences.lockOnBlur ? 'bg-prospera-accent' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.lockOnBlur ? 'left-7 shadow-lg' : 'left-1'}`} />
                  </button>
               </div>
            </div>
            <button onClick={handleSecuritySave} className="w-full py-5 bg-prospera-accent text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-prospera-accent/20">Commit Security Changes</button>
          </div>
        );
      case 'branding':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <div className="space-y-1">
              <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3">
                <Palette className="text-prospera-accent w-6 h-6" />
                Global Branding Engine
              </h3>
              <p className="text-xs text-prospera-gray font-medium">As Admin, these changes affect all members.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Accent Protocol</label>
                 <div className="grid grid-cols-3 gap-3">
                   {presets.map(p => (
                     <button key={p.color} onClick={() => updatePreferences({ primaryColor: p.color })} className="h-10 rounded-xl flex items-center justify-center border-2 border-white/5 transition-transform active:scale-90" style={{ backgroundColor: p.color }}>
                       {preferences.primaryColor === p.color && <Check className="text-white w-4 h-4 shadow-xl" />}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-black text-prospera-gray uppercase tracking-widest ml-1">Custom Hex Code</label>
                 <div className="relative">
                    <input type="text" value={preferences.primaryColor} onChange={(e) => updatePreferences({ primaryColor: e.target.value })} className={inputClasses} maxLength={7} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg shadow-inner" style={{ backgroundColor: preferences.primaryColor }} />
                 </div>
               </div>
            </div>
            <div className="p-6 bg-prospera-accent/5 border border-prospera-accent/20 rounded-3xl flex items-center gap-4">
               <Sparkles className="w-8 h-8 text-prospera-accent shrink-0" />
               <p className="text-[11px] text-prospera-gray font-bold leading-relaxed">
                 The chosen primary color will propagate across all member terminals, affecting buttons, glows, and analytical indicators globally.
               </p>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900">Display Terminal</h3>
            <div className="grid grid-cols-2 gap-6">
              <button onClick={() => updatePreferences({ theme: 'dark' })} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${preferences.theme === 'dark' ? 'border-prospera-accent bg-prospera-accent/5' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-prospera-darkest/50 grayscale'}`}>
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl"><Layout className="text-prospera-accent w-6 h-6" /></div>
                <p className="font-black text-[10px] uppercase tracking-widest text-white">Deep Space</p>
              </button>
              <button onClick={() => updatePreferences({ theme: 'light' })} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${preferences.theme === 'light' ? 'border-prospera-accent bg-prospera-accent/5' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-prospera-darkest/50 grayscale'}`}>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100"><Sun className="text-yellow-500 w-6 h-6" /></div>
                <p className="font-black text-[10px] uppercase tracking-widest text-gray-900">High Contrast</p>
              </button>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3">
              <Code2 className="text-prospera-accent w-6 h-6" />
              Terminal Metadata
            </h3>
            <div className="p-10 bg-gray-50 dark:bg-prospera-darkest/80 rounded-[3rem] border border-gray-100 dark:border-white/5 space-y-8 text-center terminal-grid">
              <img src={preferences.developerImage || AVATAR_SILHOUETTES.male} alt="" className="w-24 h-24 rounded-[2rem] border-4 border-prospera-accent mx-auto object-cover shadow-2xl" />
              <div>
                <h4 className="text-2xl font-black dark:text-white text-gray-900">Dominic Gekonde</h4>
                <p className="text-prospera-accent text-[10px] font-black uppercase tracking-[0.3em] mt-1">Lead Systems Engineer</p>
              </div>
              <div className="flex justify-center gap-4">
                 <span className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-prospera-gray tracking-widest uppercase">Build 3.2.0-LTS</span>
                 <span className="px-4 py-1.5 bg-prospera-accent/10 border border-prospera-accent/20 rounded-full text-[10px] font-black text-prospera-accent tracking-widest uppercase">Stable Protocol</span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-600 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black dark:text-white text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-prospera-accent rounded-2xl shadow-xl shadow-prospera-accent/20">
              <Settings className="text-white w-6 h-6" />
            </div>
            Terminal Settings
          </h1>
          <p className="text-prospera-gray font-black uppercase tracking-[0.2em] text-[10px] ml-16">Global & Local Protocol Management</p>
        </div>
        <button onClick={onLock} className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all">Emergency Lock</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-3">
          {sections.map(section => (
            <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full p-5 rounded-[1.5rem] flex items-center gap-5 transition-all text-left group ${activeSection === section.id ? 'bg-prospera-accent text-white shadow-2xl shadow-prospera-accent/40' : 'bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 text-prospera-gray hover:text-prospera-accent shadow-lg hover:border-prospera-accent/20'}`}>
              <section.icon className={`w-5 h-5 shrink-0 ${activeSection === section.id ? 'text-white' : 'text-prospera-accent'}`} />
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight">{section.name}</p>
                <p className="text-[10px] font-medium opacity-60 truncate uppercase tracking-widest">{section.desc}</p>
              </div>
              <ChevronRight className={`w-4 h-4 ml-auto opacity-40 group-hover:translate-x-1 transition-transform ${activeSection === section.id && 'hidden'}`} />
            </button>
          ))}
        </div>

        <div className="md:col-span-2">
          <div className="p-10 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[3.5rem] shadow-2xl min-h-[550px] relative overflow-hidden">
            {activeSection ? (
              <div className="relative h-full">
                <button onClick={() => setActiveSection(null)} className="absolute -top-4 -left-4 p-2 text-prospera-gray hover:text-prospera-accent mb-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors"><ArrowLeft className="w-4 h-4" /> Global Menu</button>
                <div className="pt-10">{renderActiveSection()}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-20">
                <div className="w-32 h-32 bg-prospera-gray/10 rounded-full flex items-center justify-center mb-8"><Settings className="w-16 h-16 dark:text-white text-gray-900" /></div>
                <h3 className="text-2xl font-black dark:text-white text-gray-900 uppercase tracking-widest">Awaiting Command</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
