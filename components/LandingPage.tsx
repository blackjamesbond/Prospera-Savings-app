
import React, { useCallback, useState, useEffect } from 'react';
import { 
  Target, 
  Shield, 
  Zap, 
  ArrowRight, 
  LogIn,
  Sparkles,
  Activity,
  Fingerprint,
  ShieldCheck,
  ChevronDown,
  LayoutGrid,
  Menu,
  HelpCircle,
  Globe,
  Lock,
  Download,
  Smartphone,
  X,
  ShieldAlert,
  Cpu,
  Globe2,
  LockKeyhole
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

      if (isStandalone) {
        alert("Prospera is already installed on your device.");
      } else if (isIOS) {
        alert("To install on iOS: Tap the 'Share' icon in your browser bottom bar, then select 'Add to Home Screen' ➕.");
      } else {
        alert("To install: Open your browser menu (⋮) and select 'Install App' or 'Add to Home Screen'.");
      }
    }
  };

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-prospera-darkest selection:bg-prospera-accent selection:text-white font-['Inter']">
      
      {/* MOBILE VIEW (High-Performance Fintech Web App) */}
      <div className="md:hidden relative h-screen w-full bg-[#0F131A] flex flex-col overflow-hidden">
        
        {/* Glamorous Glowing Background (Static Layer) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[40%] bg-prospera-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[20%] right-[-20%] w-[90%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-prospera-darkest/50 to-prospera-darkest" />
          <div className="absolute inset-0 terminal-grid opacity-20" />
        </div>

        {/* Fixed Header Section (Ticker + Navigation) */}
        <div className="relative z-50 flex flex-col">
          <div className="w-full bg-black/60 backdrop-blur-xl border-b border-white/5 py-2 px-4 overflow-hidden shadow-lg">
            <div className="flex items-center gap-10 animate-marquee whitespace-nowrap">
              <span className="text-[7px] font-black text-prospera-accent uppercase tracking-widest flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-prospera-accent animate-ping" />
                Core Mainnet: Operational
              </span>
              <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Latency: 0.004s</span>
              <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Protocol 3.5.1 Stable</span>
              <span className="text-[7px] font-black text-prospera-accent uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3" /> Encrypted E2E
              </span>
            </div>
          </div>

          <header className="px-6 py-5 flex justify-between items-center bg-[#0F131A]/80 backdrop-blur-3xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-prospera-accent to-[#00A37A] rounded-xl flex items-center justify-center shadow-lg shadow-prospera-accent/40">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white leading-none">Prospera</span>
                <span className="text-[6px] font-black text-prospera-accent/60 uppercase tracking-[0.4em] mt-1">Founders Portal</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all shadow-inner">
              <Menu className="w-5 h-5" />
            </button>
          </header>
        </div>

        <div className="relative z-20 flex-1 overflow-y-auto no-scrollbar pb-10">
          
          <section className="min-h-[75vh] flex flex-col justify-center px-6 pt-10 pb-20 relative overflow-visible">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] aspect-square pointer-events-none -z-10">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,195,141,0.2)_0%,transparent_70%)] blur-[80px] animate-pulse-slow" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.15)_0%,transparent_60%)] blur-[100px] animate-float" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,rgba(16,185,129,0.1)_0%,transparent_60%)] blur-[90px]" />

               <div className="absolute inset-0 opacity-[0.08] mix-blend-screen" 
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='60' viewBox='0 0 52 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 0l26 15v30L26 60 0 45V15z' fill='none' stroke='%2301C38D' stroke-width='1'/%3E%3C/svg%3E")`,
                      backgroundSize: '40px 46px'
                    }} 
               />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0F131A_85%)]" />
            </div>

            <div className="space-y-8 relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-prospera-accent/10 border border-prospera-accent/20 rounded-lg backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-prospera-accent animate-pulse" />
                <p className="text-[8px] font-black text-prospera-accent uppercase tracking-[0.3em]">Next-Gen Group Equity</p>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.85] drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
                  Collective <br />
                  Capital. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-prospera-accent to-emerald-300">Simplified.</span>
                </h1>
                <p className="text-sm text-white/40 font-medium leading-relaxed pr-8 max-w-sm">
                  Professional-grade coordination for group savings. Transparent ledgers, instant verification, and military security.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 pt-6 max-w-sm">
                <button 
                  onClick={onStart}
                  className="w-full py-5 bg-gradient-to-r from-prospera-accent to-[#00A37A] text-white rounded-xl font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_20px_40px_rgba(1,195,141,0.3)] flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
                >
                  Found Circle <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleInstallApp}
                  className="w-full py-4.5 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-[0.3em] text-[9px] flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-inner backdrop-blur-md"
                >
                  <Download className="w-4 h-4 text-prospera-accent" />
                  Install App Terminal
                </button>
              </div>
            </div>
          </section>

          <section id="features" className="px-6 py-20 space-y-12">
             <div className="space-y-2">
                <p className="text-[9px] font-black text-prospera-accent uppercase tracking-[0.4em]">Protocol Specifications</p>
                <h2 className="text-3xl font-black text-white tracking-tighter">Engineered for <br />Certainty.</h2>
             </div>

             <div className="space-y-6">
                {[
                  { title: 'Algorithmic Sync', icon: Cpu, desc: 'Verification of transaction artifacts at 4ms velocity. Zero-knowledge proof for financial integrity.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { title: 'Vault Logic', icon: ShieldCheck, desc: 'Local-first encrypted dossiers. Your circle\'s capital remains invisible to the core network.', color: 'text-prospera-accent', bg: 'bg-prospera-accent/10' },
                  { title: 'Goal Maturity', icon: Target, desc: 'Deterministic tracking against collective milestones. Real-time liquidity forecasting.', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
                ].map((feat, i) => (
                  <div key={i} className="relative p-[2px] rounded-[2.5rem] group h-full transition-all duration-500 overflow-visible">
                    {/* Surrounding outer glow (Spilled light) */}
                    <div className="absolute inset-[-20px] bg-[conic-gradient(from_0deg,transparent,transparent,var(--prospera-accent),transparent,transparent)] opacity-0 group-hover:opacity-40 transition-opacity duration-700 animate-spin-slow blur-2xl pointer-events-none" />
                    
                    {/* Sharp border line light */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-[conic-gradient(from_0deg,transparent,transparent,var(--prospera-accent),transparent,transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow pointer-events-none" />
                    
                    <div className="relative p-8 bg-[#0F131A] border border-white/5 rounded-[calc(2.5rem-2px)] space-y-6 overflow-hidden h-full shadow-inner">
                      {/* Web Comb Inside Card */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                           style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='60' viewBox='0 0 52 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 0l26 15v30L26 60 0 45V15z' fill='none' stroke='%2301C38D' stroke-width='1'/%3E%3C/svg%3E")`,
                             backgroundSize: '24px 28px'
                           }} 
                      />
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                        <feat.icon className={`w-20 h-20 ${feat.color}`} />
                      </div>
                      <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center`}>
                        <feat.icon className={`w-6 h-6 ${feat.color}`} />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <h3 className="text-xl font-black text-white tracking-tight">{feat.title}</h3>
                        <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section id="security" className="px-6 py-24 my-10 relative">
             <div className="absolute inset-0 bg-gradient-to-br from-prospera-accent/10 via-transparent to-blue-500/5 rounded-[3rem] blur-3xl" />
             <div className="relative z-10 p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl space-y-10 terminal-grid">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                      <ShieldAlert className="w-7 h-7 text-red-500" />
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-2xl font-black text-white tracking-tight">E2E Integrity</h2>
                      <p className="text-[8px] font-black text-prospera-gray uppercase tracking-[0.3em]">Military Cipher Activated</p>
                   </div>
                </div>
                
                <p className="text-sm text-white/50 leading-relaxed font-medium">
                   Prospera utilizes decentralized encryption. Your private financial dossiers never touch our cloud unencrypted. You hold the master terminal key.
                </p>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                      <p className="text-xl font-black text-white">100%</p>
                      <p className="text-[7px] font-black text-prospera-gray uppercase tracking-widest">Ownership</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                      <p className="text-xl font-black text-white">4ms</p>
                      <p className="text-[7px] font-black text-prospera-gray uppercase tracking-widest">Audit Speed</p>
                   </div>
                </div>
             </div>
          </section>

          <footer className="px-6 py-20 text-center space-y-12 bg-gradient-to-b from-transparent to-black/20">
            <div className="flex flex-col items-center gap-5">
              <div className="w-12 h-12 bg-prospera-accent/10 border border-prospera-accent/20 rounded-2xl flex items-center justify-center shadow-xl shadow-prospera-accent/10">
                <Target className="w-7 h-7 text-prospera-accent" />
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black tracking-tighter text-white">Prospera</span>
                <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.5em]">Future of Collective Capital</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
               <button className="hover:text-prospera-accent">Privacy</button>
               <button className="hover:text-prospera-accent">Legal</button>
               <button className="hover:text-prospera-accent">Support</button>
            </div>

            <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] pt-10">
              © 2025 PROSPERA VAULT TERMINAL. <br /> AES-256 COMPLIANT.
            </p>
          </footer>
        </div>

        <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)} />
          <div className={`absolute top-0 right-0 w-[85%] h-full bg-[#0F131A] border-l border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} p-8 flex flex-col`}>
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-prospera-accent" />
                <span className="text-lg font-black tracking-tighter text-white">Prospera</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/5 rounded-xl text-white active:scale-90 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[9px] font-black text-prospera-accent uppercase tracking-[0.4em] opacity-80">Network Access</p>
                <nav className="flex flex-col gap-6">
                  {[
                    { label: 'Vault Terminal', icon: ShieldCheck, onClick: onLogin },
                    { label: 'Establish Circle', icon: Zap, onClick: onStart },
                    { label: 'Security Specs', icon: LockKeyhole, onClick: () => scrollToSection('security') },
                    { label: 'Protocol Growth', icon: Cpu, onClick: () => scrollToSection('features') },
                  ].map((link, i) => (
                    <button key={i} onClick={link.onClick} className="flex items-center gap-4 text-white/70 hover:text-white transition-all group active:translate-x-2">
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-prospera-accent/10 transition-colors">
                        <link.icon className="w-5 h-5 text-prospera-accent" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em]">{link.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">External Links</p>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={handleInstallApp} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 active:scale-95 transition-transform">
                      <Download className="w-5 h-5 text-prospera-accent" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40">INSTALL</span>
                   </button>
                   <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 active:scale-95 transition-transform">
                      <HelpCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Docs</span>
                   </button>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <button 
                onClick={onStart}
                className="w-full py-5 bg-gradient-to-br from-prospera-accent to-[#00A37A] text-white rounded-xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-prospera-accent/20 active:scale-95 transition-all"
              >
                Sync Terminal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Stretched S-Curve Layout - Preserved) */}
      <div className="hidden md:block">
        <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-5 bg-white/80 dark:bg-prospera-darkest/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-prospera-accent rounded-xl flex items-center justify-center shadow-lg shadow-prospera-accent/20">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter dark:text-white text-gray-900">Prospera</span>
            </div>
            
            <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] dark:text-gray-400 text-gray-500">
              <button onClick={onLogin} className="hover:text-prospera-accent transition-colors">Access Vault</button>
              <button onClick={onStart} className="px-8 py-3.5 bg-prospera-accent text-white rounded-xl shadow-xl shadow-prospera-accent/20 hover:scale-105 active:scale-95 transition-all">Found Circle</button>
            </div>
          </div>
        </nav>

        <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-50">
          <div className="absolute inset-0 z-0">
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M 55,0 C 75,30 35,70 55,100 L 100,100 L 100,0 Z" 
                className="fill-prospera-darkest"
              />
            </svg>
            <div className="absolute top-0 right-0 w-[45%] h-full z-10 pointer-events-none">
              <div className="absolute inset-0 terminal-grid opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-prospera-accent/10 via-transparent to-blue-500/10" />
            </div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-prospera-accent/5 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-float" />
          </div>

          <div className="max-w-7xl mx-auto px-12 w-full grid grid-cols-12 relative z-20 pt-10">
            <div className="col-span-7 lg:col-span-6 space-y-10 pr-12 animate-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-prospera-accent/10 border border-prospera-accent/20 rounded-full text-prospera-accent text-[9px] font-black uppercase tracking-[0.4em]">
                <Sparkles className="w-4 h-4" /> Global Ingress Protocol 3.5.1
              </div>
              <div className="space-y-6">
                <h1 className="text-[5rem] lg:text-[6.5rem] font-black tracking-tighter leading-[0.85] text-gray-900">
                  Collective <br />
                  Capital. <br />
                  <span className="text-prospera-accent">Simplified.</span>
                </h1>
                <p className="text-xl text-gray-600 font-medium max-w-md leading-relaxed">
                  Military-grade coordination for group savings. Encrypted, autonomous, and designed for strategic growth.
                </p>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  onClick={onStart}
                  className="px-10 py-5 bg-prospera-accent text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-prospera-accent/30 hover:scale-105 transition-all flex items-center gap-4 group"
                >
                  Establish Terminal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('features-desktop')}
                  className="px-8 py-5 bg-white text-gray-900 border border-gray-200 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  Platform Specs
                </button>
              </div>
            </div>

            <div className="col-span-5 lg:col-span-6 flex items-center justify-center pl-12 animate-in fade-in zoom-in duration-1000">
              <div className="relative w-full max-w-md space-y-6">
                <div className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-prospera-accent rounded-xl flex items-center justify-center shadow-lg shadow-prospera-accent/40">
                      <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vault Security</p>
                      <p className="text-xs font-bold text-white">Active Protocol 256-AES</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-prospera-accent shadow-[0_0_15px_var(--prospera-accent)]" />
                    </div>
                    <div className="h-1.5 w-3/4 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl shadow-xl ml-16 transform hover:scale-110 transition-transform duration-500 delay-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Sync Velocity</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mainnet Latency: 4ms</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl shadow-xl -ml-6 transform hover:scale-110 transition-transform duration-500 delay-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Fingerprint className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Biometric Gate</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-12 flex flex-col items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer animate-bounce" onClick={() => scrollToSection('features-desktop')}>
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Protocol Details</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </section>

        <section id="features-desktop" className="py-40 bg-prospera-darkest relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-12 relative z-10">
            <div className="grid grid-cols-3 gap-12">
              {[
                { icon: Shield, title: 'Vault Shield', desc: 'Secure local-first ledgers ensuring your group financial data never leaves your circle.', color: 'text-prospera-accent', bg: 'bg-prospera-accent/5' },
                { icon: Zap, title: 'Algorithmic Sync', desc: 'Instant verification of deposits from bank messages and mobile money receipts.', color: 'text-blue-500', bg: 'bg-blue-500/5' },
                { icon: Target, title: 'Objective Tracking', desc: 'Strategic progress monitoring against collective milestones and shared goals.', color: 'text-yellow-500', bg: 'bg-yellow-500/5' }
              ].map((feat, i) => (
                <div key={i} className="relative p-[2px] rounded-2xl group transition-all duration-500 overflow-visible h-full">
                  {/* Surrounding outer glow (Spilled light) - blurred */}
                  <div className="absolute inset-[-25px] bg-[conic-gradient(from_0deg,transparent,transparent,var(--prospera-accent),transparent,transparent)] opacity-0 group-hover:opacity-40 transition-opacity duration-700 animate-spin-slow blur-2xl pointer-events-none" />
                  
                  {/* Sharp border line light */}
                  <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_0deg,transparent,transparent,var(--prospera-accent),transparent,transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow pointer-events-none" />
                  
                  <div className="relative h-full p-10 bg-[#161B24] border border-white/5 rounded-[calc(1rem-2px)] hover:bg-[#1A202A] transition-all shadow-2xl flex flex-col">
                    {/* Web Comb inside card */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{
                           backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='60' viewBox='0 0 52 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 0l26 15v30L26 60 0 45V15z' fill='none' stroke='%2301C38D' stroke-width='1'/%3E%3C/svg%3E")`,
                           backgroundSize: '32px 36px'
                         }} 
                    />
                    <div className={`w-14 h-14 ${feat.bg} rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10`}>
                      <feat.icon className={`w-7 h-7 ${feat.color}`} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-3 tracking-tight relative z-10">{feat.title}</h3>
                    <p className="text-gray-400 text-[13px] font-medium leading-relaxed relative z-10">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gray-50" style={{ clipPath: 'path("M 0 100 Q 50 0 100 100 L 100 100 L 0 100 Z")' }} />
        </section>

        <footer className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-prospera-accent rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900">Prospera</span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
              <button className="hover:text-prospera-accent transition-colors">Documentation</button>
              <button className="hover:text-prospera-accent transition-colors">Security Audit</button>
              <button className="hover:text-prospera-accent transition-colors">Support Portal</button>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              © 2025 PROSPERA VAULT TERMINAL. AES-256 COMPLIANT.
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin-slow {
          animation: spin 3.5s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
