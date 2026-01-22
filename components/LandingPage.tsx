
import React, { useCallback } from 'react';
import { 
  Target, 
  Shield, 
  Zap, 
  ArrowRight, 
  Smartphone, 
  Globe, 
  MessageCircle, 
  Sparkles, 
  BrainCircuit,
  Lock,
  Activity,
  Fingerprint,
  Users,
  ShieldCheck,
  LayoutGrid,
  ShieldAlert,
  ChevronRight,
  LogIn
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
    <div className="min-h-screen bg-white dark:bg-prospera-darkest selection:bg-prospera-accent selection:text-white">
      
      {/* MOBILE VIEW (High-Impact Immersive) */}
      <div className="md:hidden relative h-screen w-full overflow-hidden flex flex-col">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-110"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000")' }}
        >
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Top Header Mobile */}
        <div className="relative z-20 p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-prospera-accent rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">Prospera</span>
          </div>
          <button onClick={onLogin} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
            <LogIn className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Fade & CTA Mobile */}
        <div className="mt-auto relative z-20 p-8 pb-12 bg-gradient-to-t from-prospera-darkest via-prospera-darkest/90 to-transparent">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-white leading-tight">
              Invest in your <br />
              <span className="text-prospera-accent">community.</span>
            </h1>
            <p className="text-gray-300 text-sm font-medium px-4">
              Secure, autonomous group savings. Manage your circle with professional tools and military-grade security.
            </p>
            <div className="pt-6">
              <button 
                onClick={onStart}
                className="w-full py-5 bg-prospera-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-prospera-accent/40 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Get Started Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Shapely Light/Dark Mix) */}
      <div className="hidden md:block">
        {/* Nav Desktop */}
        <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-prospera-accent rounded-xl flex items-center justify-center shadow-lg shadow-prospera-accent/20">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter dark:text-white text-gray-900">Prospera</span>
            </div>
            
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] dark:text-gray-400 text-gray-500">
              <button onClick={onLogin} className="hover:text-prospera-accent transition-colors">Access Vault</button>
              <button onClick={onStart} className="px-6 py-3 bg-prospera-accent text-white rounded-xl shadow-xl shadow-prospera-accent/20 hover:scale-105 active:scale-95 transition-all">Found Circle</button>
            </div>
          </div>
        </nav>

        {/* Hero Section Desktop */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Shapely Background Components */}
          <div className="absolute inset-0 z-0">
            {/* Light side */}
            <div className="absolute inset-0 bg-gray-50" />
            {/* Dark Slanted side */}
            <div 
              className="absolute top-0 right-0 w-1/2 h-full bg-prospera-darkest transform translate-x-20 -skew-x-12 z-10"
              style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              <div className="absolute inset-0 terminal-grid opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-br from-prospera-accent/10 to-transparent" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-2 relative z-20 pt-20">
            {/* Left Column (Light/Info) */}
            <div className="space-y-10 pr-12">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-prospera-accent/10 border border-prospera-accent/20 rounded-full text-prospera-accent text-[9px] font-black uppercase tracking-[0.3em]">
                <Sparkles className="w-4 h-4" /> Strategic Savings Infrastructure
              </div>
              <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-gray-900">
                Financial <br />
                Cohesion. <br />
                <span className="text-prospera-accent">Simplified.</span>
              </h1>
              <p className="text-lg text-gray-600 font-medium max-w-md leading-relaxed">
                Empowering communities with a professional-grade platform for group savings, automated verification, and goal tracking.
              </p>
              <div className="flex items-center gap-6">
                <button 
                  onClick={onStart}
                  className="px-10 py-5 bg-prospera-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-prospera-accent/30 hover:scale-105 transition-all flex items-center gap-3"
                >
                  Establish Terminal <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Right Column (Dark/Visual) */}
            <div className="flex items-center justify-center pl-12">
              <div className="relative w-full max-w-md">
                {/* Floating Abstract Cards */}
                <div className="absolute -top-10 -right-10 w-64 h-80 bg-prospera-accent/20 rounded-[3rem] blur-3xl animate-pulse" />
                
                <div className="relative space-y-6">
                   <div className="p-8 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl transform hover:scale-105 transition-transform duration-500">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-prospera-accent rounded-2xl flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vault Security</p>
                          <p className="text-xs font-bold text-white">Active Protocol</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-prospera-accent" />
                        </div>
                        <div className="h-2 w-3/4 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-blue-500" />
                        </div>
                      </div>
                   </div>

                   <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl ml-12 transform hover:scale-105 transition-transform duration-500 delay-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Sync Latency</p>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Mainnet: 4ms</p>
                        </div>
                      </div>
                   </div>

                   <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl -ml-6 transform hover:scale-105 transition-transform duration-500 delay-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Biometric Auth</p>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status: Verified</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section Desktop (Transition back to Dark) */}
        <section id="features" className="py-40 bg-prospera-darkest relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-gray-50 to-transparent z-0 opacity-100 md:hidden" />
          
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-white">Platform Core</h2>
                <p className="text-gray-400 font-medium text-lg max-w-xl">
                  Engineered with the latest fintech heuristics to provide a seamless coordination layer for your circle.
                </p>
              </div>
              <div className="hidden lg:block w-32 h-0.5 bg-prospera-accent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: BrainCircuit, title: 'Algorithmic Read', desc: 'Instant extraction of contribution data from bank and mobile money messages.', color: 'text-prospera-accent', bg: 'bg-prospera-accent/5' },
                { icon: Shield, title: 'Vault Shield', desc: 'Military-grade encryption for all shared ledgers and administrative logs.', color: 'text-blue-500', bg: 'bg-blue-500/5' },
                { icon: Target, title: 'Objective Sync', desc: 'Real-time progress tracking against collective group targets and goals.', color: 'text-yellow-500', bg: 'bg-yellow-500/5' }
              ].map((feat, i) => (
                <div key={i} className="group p-10 bg-white/5 border border-white/5 rounded-[3rem] hover:bg-white/[0.08] hover:border-prospera-accent/30 transition-all shadow-2xl">
                  <div className={`w-16 h-16 ${feat.bg} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                    <feat.icon className={`w-8 h-8 ${feat.color}`} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{feat.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Desktop */}
        <footer className="py-20 bg-prospera-darkest border-t border-white/5">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-prospera-accent rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">Prospera</span>
            </div>
            
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <button className="hover:text-white transition-colors">Documentation</button>
              <button className="hover:text-white transition-colors">Privacy Shield</button>
              <button className="hover:text-white transition-colors">Support Portal</button>
            </div>
            
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
              © 2025 Prospera. AES-256 Verified.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
