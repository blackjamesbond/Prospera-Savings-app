
import React, { useCallback } from 'react';
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
  ChevronDown
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-prospera-darkest selection:bg-prospera-accent selection:text-white font-['Inter']">
      
      {/* MOBILE VIEW (Immersive Floor Fade) */}
      <div className="md:hidden relative h-screen w-full overflow-hidden flex flex-col">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200")' }}
        >
          {/* Dark Scrim */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Top Header Mobile (Glass) */}
        <div className="relative z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-prospera-accent rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">Prospera</span>
          </div>
          <button onClick={onLogin} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10">
            <LogIn className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Fade & CTA Mobile */}
        <div className="mt-auto relative z-20 p-8 pb-12 bg-gradient-to-t from-prospera-darkest via-prospera-darkest/95 to-transparent">
          <div className="space-y-4 text-center animate-in slide-in-from-bottom-10 duration-700">
            <h1 className="text-4xl font-black tracking-tighter text-white leading-[1.1]">
              Capital <br />
              Coordination <br />
              <span className="text-prospera-accent">Simplified.</span>
            </h1>
            <p className="text-gray-400 text-xs font-medium px-4 opacity-80 leading-relaxed">
              Securely manage group savings with autonomous ledgers and algorithmic insights.
            </p>
            <div className="pt-8">
              <button 
                onClick={onStart}
                className="w-full py-5 bg-prospera-accent text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-prospera-accent/40 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Launch Terminal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Stretched S-Curve Layout) */}
      <div className="hidden md:block">
        {/* Nav Desktop */}
        <nav className="fixed top-0 left-0 right-0 z-[100] px-12 py-8">
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

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-50">
          {/* Stretched "S" Curved Background */}
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
            
            {/* The Dark Side Content Container */}
            <div className="absolute top-0 right-0 w-[45%] h-full z-10 pointer-events-none">
              <div className="absolute inset-0 terminal-grid opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-prospera-accent/10 via-transparent to-blue-500/10" />
            </div>

            {/* Glowing Accents */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-prospera-accent/5 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-float" />
          </div>

          <div className="max-w-7xl mx-auto px-12 w-full grid grid-cols-12 relative z-20 pt-10">
            {/* Left Content (Solar Section) */}
            <div className="col-span-7 lg:col-span-6 space-y-12 pr-12 animate-in slide-in-from-left duration-1000">
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

              <div className="flex items-center gap-6">
                <button 
                  onClick={onStart}
                  className="px-12 py-6 bg-prospera-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-prospera-accent/30 hover:scale-105 transition-all flex items-center gap-4 group"
                >
                  Establish Terminal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-6 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  Platform Specs
                </button>
              </div>
            </div>

            {/* Right Visuals (Deep Space Section) */}
            <div className="col-span-5 lg:col-span-6 flex items-center justify-center pl-12 animate-in fade-in zoom-in duration-1000">
              <div className="relative w-full max-w-md space-y-8">
                {/* Floating Glassmorphic UI */}
                <div className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-10">
                    <div className="w-14 h-14 bg-prospera-accent rounded-2xl flex items-center justify-center shadow-lg shadow-prospera-accent/40">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vault Security</p>
                      <p className="text-xs font-bold text-white">Active Protocol 256-AES</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-prospera-accent shadow-[0_0_15px_var(--prospera-accent)]" />
                    </div>
                    <div className="h-2 w-3/4 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl ml-20 transform hover:scale-110 transition-transform duration-500 delay-100">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Sync Velocity</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mainnet Latency: 4ms</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl -ml-10 transform hover:scale-110 transition-transform duration-500 delay-200">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <Fingerprint className="w-6 h-6 text-white" />
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
          
          {/* Scroll Prompt */}
          <div className="absolute bottom-10 left-12 flex flex-col items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer animate-bounce" onClick={() => scrollToSection('features')}>
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Protocol Details</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-40 bg-prospera-darkest relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-12 relative z-10">
            <div className="grid grid-cols-3 gap-20">
              {[
                { icon: Shield, title: 'Vault Shield', desc: 'Secure local-first ledgers ensuring your group financial data never leaves your circle.', color: 'text-prospera-accent', bg: 'bg-prospera-accent/5' },
                { icon: Zap, title: 'Algorithmic Sync', desc: 'Instant verification of deposits from bank messages and mobile money receipts.', color: 'text-blue-500', bg: 'bg-blue-500/5' },
                { icon: Target, title: 'Objective Tracking', desc: 'Strategic progress monitoring against collective milestones and shared goals.', color: 'text-yellow-500', bg: 'bg-yellow-500/5' }
              ].map((feat, i) => (
                <div key={i} className="group p-12 bg-white/5 border border-white/5 rounded-[3.5rem] hover:bg-white/[0.08] hover:border-prospera-accent/30 transition-all shadow-2xl">
                  <div className={`w-16 h-16 ${feat.bg} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                    <feat.icon className={`w-8 h-8 ${feat.color}`} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feat.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Curved Footer Border (Stretched S Ending) */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gray-50" style={{ clipPath: 'path("M 0 100 Q 50 0 100 100 L 100 100 L 0 100 Z")' }} />
        </section>

        {/* Footer */}
        <footer className="py-24 bg-gray-50 border-t border-gray-100">
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
    </div>
  );
};

export default LandingPage;
