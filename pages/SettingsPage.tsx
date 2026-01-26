
import React, { useState, useRef, useMemo } from 'react';
/* Added ShieldCheck to imports from lucide-react */
import { Settings, Shield, Bell, User as UserIcon, Palette, Globe, Lock, ChevronRight, Save, ArrowLeft, Eye, EyeOff, Code2, Camera, Info, Sun, Sparkles, Check, Trash, Key, Timer, Smartphone, Layout, Type, ToggleRight, Target, Users, Cpu, Github, Linkedin, Twitter, Mail, ExternalLink, Briefcase, UserCheck, ShieldCheck } from 'lucide-react';
import { useAppContext, AVATAR_SILHOUETTES } from '../context/AppContext.tsx';
import { UserRole } from '../types.ts';

interface SettingsPageProps {
  onLock: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  profession: string;
  bio: string;
  seed: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLock }) => {
  const { preferences, updatePreferences, currentUser, updateCurrentUser, showToast } = useAppContext();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [aboutView, setAboutView] = useState<'metadata' | 'team' | 'detail'>('metadata');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  
  const [profileForm, setProfileForm] = useState({ 
    name: currentUser?.name || '', 
    email: currentUser?.email || '',
    profileImage: currentUser?.profileImage || '',
    gender: currentUser?.gender || 'male'
  });
  const [pinForm, setPinForm] = useState(preferences.appPin);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const teamData: TeamMember[] = useMemo(() => [
    {
      id: 'dominic',
      name: 'Dominic Gekonde',
      role: 'Lead Engineer',
      profession: 'Senior Full Stack & AI Architect',
      bio: 'Architect of the Prospera core system. Dominic specializes in building high-performance fintech applications with a focus on localized financial synchronization and autonomous security protocols.',
      seed: 'Felix',
      socials: { github: 'https://github.com', linkedin: 'https://linkedin.com', email: 'dominic@techforge.africa' }
    },
    {
      id: 'barrack',
      name: 'Barrack Rabuku',
      role: 'Product Strategist',
      profession: 'Fintech Analyst & Strategist',
      bio: 'Expert in group financial dynamics and emerging markets. Barrack leads the roadmap for TechForge Africa, ensuring Prospera aligns with the practical needs of modern African savings circles.',
      seed: 'George',
      socials: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' }
    },
    {
      id: 'machel',
      name: 'Machel',
      role: 'Security Ops',
      profession: 'Cybersecurity Specialist',
      bio: 'Guardian of the Vault. Machel manages the E2E encryption standards and penetration testing for the Prospera mainnet, maintaining military-grade integrity for all group dossiers.',
      seed: 'Machel',
      socials: { github: 'https://github.com', email: 'machel@techforge.africa' }
    },
    {
      id: 'seline',
      name: 'Seline',
      role: 'UX Lead',
      profession: 'Visual Architect & UX Researcher',
      bio: 'Seline is the creative force behind Prospera’s high-fidelity terminal aesthetic. She bridges the gap between complex financial data and intuitive, high-performance user experiences.',
      seed: 'Seline',
      socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' }
    },
    {
      id: 'bodi',
      name: 'Bodi',
      role: 'Cloud Architect',
      profession: 'Infrastructure & DevOps Engineer',
      bio: 'Bodi ensures the 4ms mainnet latency. He manages the decentralized node infrastructure and automated scaling protocols that keep Prospera operational 24/7.',
      seed: 'Bodi',
      socials: { github: 'https://github.com', email: 'bodi@techforge.africa' }
    },
    {
      id: 'karen',
      name: 'Karen',
      role: 'Data Scientist',
      profession: 'Financial Modeling Expert',
      bio: 'The logic behind the insights. Karen develops the heuristic modeling and predictive analytics used in the AI Insights engine to forecast group liquidity and growth.',
      seed: 'Karen',
      socials: { linkedin: 'https://linkedin.com', github: 'https://github.com' }
    }
  ], []);

  const sections = [
    { id: 'profile', name: 'Profile Dossier', icon: UserIcon, desc: 'Manage your personal group identity' },
    { id: 'security', name: 'Security Protocol', icon: Shield, desc: 'PIN codes and auto-lock heuristics' },
    { id: 'dashboard', name: 'Dashboard Layout', icon: ToggleRight, desc: 'Personalize your interface modules' },
    ...(isAdmin ? [{ id: 'branding', name: 'Global Branding', icon: Layout, desc: 'Control group UI colors and theme' }] : []),
    { id: 'appearance', name: 'Display Preferences', icon: Palette, desc: 'Switch modes and local UI tweaks' },
    { id: 'about', name: 'System Info', icon: Info, desc: 'Version data and TechForge team' },
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
        if (aboutView === 'metadata') {
          return (
            <div className="space-y-8 animate-in slide-in-from-right duration-400">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black dark:text-white text-gray-900 flex items-center gap-3 tracking-tight">
                  <Code2 className="text-prospera-accent w-6 h-6" />
                  Terminal Metadata
                </h3>
                <div className="px-3 py-1 bg-prospera-accent/10 border border-prospera-accent/20 rounded-lg">
                  <p className="text-[9px] font-black text-prospera-accent uppercase tracking-widest">TechForge Africa</p>
                </div>
              </div>

              <div className="p-8 sm:p-12 bg-gray-50 dark:bg-prospera-darkest/80 rounded-[3rem] border border-gray-100 dark:border-white/5 space-y-10 terminal-grid relative">
                <div className="space-y-2 text-center">
                  <h4 className="text-[10px] font-black text-prospera-gray uppercase tracking-[0.4em] mb-2">Developed By</h4>
                  <div className="flex items-center justify-center gap-3">
                     <div className="p-2 bg-prospera-accent rounded-xl">
                        <Cpu className="w-6 h-6 text-white" />
                     </div>
                     <h2 className="text-4xl font-black dark:text-white text-gray-900 tracking-tighter">TechForge Africa</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  <button 
                    onClick={() => setAboutView('team')}
                    className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl group hover:bg-prospera-accent/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-prospera-accent/10 rounded-xl flex items-center justify-center group-hover:bg-prospera-accent/20 transition-all">
                          <Users className="w-6 h-6 text-prospera-accent" />
                       </div>
                       <div className="text-left">
                          <h5 className="text-[11px] font-black dark:text-white text-gray-900 uppercase tracking-widest">Meet the Brains behind Prospera</h5>
                          <p className="text-[9px] text-prospera-gray font-bold uppercase mt-1">Personnel Dossiers & Strategic Units</p>
                       </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-prospera-gray group-hover:text-prospera-accent group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-center gap-4 text-center">
                   <span className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-prospera-gray tracking-widest uppercase">Version 3.5.1-LTS</span>
                   <span className="px-6 py-2.5 bg-prospera-accent/10 border border-prospera-accent/20 rounded-2xl text-[10px] font-black text-prospera-accent tracking-widest uppercase">Active Protocol Stable</span>
                </div>
                
                <p className="text-[10px] text-prospera-gray font-medium max-w-sm mx-auto leading-relaxed text-center italic">
                  This terminal environment is maintained and optimized by the TechForge Africa engineering collective.
                </p>
              </div>
            </div>
          );
        } else if (aboutView === 'team') {
          return (
            <div className="space-y-8 animate-in slide-in-from-right duration-400">
              <button 
                onClick={() => setAboutView('metadata')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-prospera-gray hover:text-prospera-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Personnel Directory
              </button>

              <div className="space-y-4">
                <h3 className="text-3xl font-black dark:text-white text-gray-900 tracking-tighter">Strategic Assets</h3>
                <p className="text-xs text-prospera-gray font-bold uppercase tracking-widest">TechForge Africa Engineering Core</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamData.map((member) => (
                  <button 
                    key={member.id}
                    onClick={() => { setSelectedMember(member); setAboutView('detail'); }}
                    className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl hover:bg-prospera-accent/5 transition-all text-left group"
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/micah/svg?seed=${member.seed}&backgroundColor=f1f5f9`} 
                      alt={member.name} 
                      className="w-16 h-16 rounded-2xl border-2 border-prospera-accent/20 group-hover:border-prospera-accent transition-all object-cover" 
                    />
                    <div className="flex-1 min-w-0">
                       <p className="text-[12px] font-black dark:text-white text-gray-900 truncate">{member.name}</p>
                       <p className="text-[9px] font-black text-prospera-accent uppercase tracking-widest mt-0.5">{member.role}</p>
                       <p className="text-[8px] text-prospera-gray font-bold uppercase tracking-widest mt-2 flex items-center gap-1.5 opacity-60">
                         <ChevronRight className="w-2.5 h-2.5" /> View Dossier
                       </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        } else if (aboutView === 'detail' && selectedMember) {
          return (
            <div className="space-y-10 animate-in zoom-in-95 duration-400">
               <button 
                onClick={() => setAboutView('team')}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-prospera-gray hover:text-prospera-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Directory
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="relative">
                  <div className="w-40 h-40 rounded-[3rem] border-4 border-prospera-accent/20 p-1 bg-white dark:bg-prospera-darkest shadow-2xl overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${selectedMember.seed}&backgroundColor=f1f5f9`} alt={selectedMember.name} className="w-full h-full rounded-[2.5rem] object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-3 bg-prospera-accent text-white rounded-2xl shadow-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-4xl font-black dark:text-white text-gray-900 tracking-tighter">{selectedMember.name}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                       <span className="px-3 py-1 bg-prospera-accent/10 border border-prospera-accent/20 rounded-lg text-[9px] font-black text-prospera-accent uppercase tracking-widest">{selectedMember.role}</span>
                       <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black text-blue-400 uppercase tracking-widest">{selectedMember.profession}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center sm:justify-start gap-4">
                    {selectedMember.socials.github && (
                      <a href={selectedMember.socials.github} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-prospera-gray hover:text-prospera-accent transition-all"><Github className="w-5 h-5" /></a>
                    )}
                    {selectedMember.socials.linkedin && (
                      <a href={selectedMember.socials.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-prospera-gray hover:text-prospera-accent transition-all"><Linkedin className="w-5 h-5" /></a>
                    )}
                    {selectedMember.socials.twitter && (
                      <a href={selectedMember.socials.twitter} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-prospera-gray hover:text-prospera-accent transition-all"><Twitter className="w-5 h-5" /></a>
                    )}
                    {selectedMember.socials.email && (
                      <a href={`mailto:${selectedMember.socials.email}`} className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-prospera-gray hover:text-prospera-accent transition-all"><Mail className="w-5 h-5" /></a>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray flex items-center gap-2"><Info className="w-3 h-3" /> Personnel Bio</h4>
                    <p className="text-sm leading-relaxed dark:text-gray-300 text-gray-600 font-medium bg-gray-50 dark:bg-white/[0.02] p-6 rounded-3xl border dark:border-white/5 border-gray-100">
                      {selectedMember.bio}
                    </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-prospera-accent/5 border border-prospera-accent/10 rounded-3xl space-y-2">
                       <Briefcase className="w-5 h-5 text-prospera-accent mb-2" />
                       <p className="text-[9px] font-black text-prospera-gray uppercase tracking-widest">Primary Objective</p>
                       <p className="text-sm font-black dark:text-white text-gray-900">TechForge Mainnet Growth</p>
                    </div>
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-2">
                       {/* Fix: Added ShieldCheck to imports to resolve 'Cannot find name ShieldCheck' on line 511 */}
                       <ShieldCheck className="w-5 h-5 text-blue-400 mb-2" />
                       <p className="text-[9px] font-black text-prospera-gray uppercase tracking-widest">Clearance Level</p>
                       <p className="text-sm font-black dark:text-white text-gray-900">L4 - System Sovereign</p>
                    </div>
                 </div>
              </div>

              <div className="pt-6 text-center">
                 <button 
                  onClick={() => setAboutView('team')}
                  className="px-8 py-3 bg-prospera-darkest text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all"
                 >
                   Return to Central Directory
                 </button>
              </div>
            </div>
          );
        }
        return null;
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
              onClick={() => {
                setActiveSection(section.id);
                if (section.id === 'about') {
                  setAboutView('metadata');
                  setSelectedMember(null);
                }
              }} 
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
                <button 
                  onClick={() => setActiveSection(null)} 
                  className="absolute -top-6 -left-6 p-3 text-prospera-gray hover:text-prospera-accent mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors bg-gray-50 dark:bg-white/5 rounded-xl border border-white/5 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Navigation Back
                </button>
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
