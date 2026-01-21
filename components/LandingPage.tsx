
import React, { useCallback } from 'react';
import { 
  Target, 
  Shield, 
  Zap, 
  ArrowRight, 
  Smartphone, 
  HeartHandshake, 
  Globe, 
  Mail, 
  MessageCircle, 
  Sparkles, 
  BrainCircuit,
  Lock,
  Activity,
  Fingerprint,
  Users,
  ShieldCheck,
  LayoutGrid,
  KeyRound,
  ShieldAlert
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

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-prospera-darkest text-white selection:bg-prospera-accent selection:text-white overflow-x-hidden terminal-grid">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-prospera-darkest/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-prospera-accent rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-prospera-accent/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Prospera</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray">
            <button 
              onClick={() => scrollToSection('features')} 
              className="hover:text-prospera-accent transition-colors flex items-center gap-2 outline-none"
            >
               <LayoutGrid className="w-3 h-3" /> Features
            </button>
            <button 
              onClick={() => scrollToSection('security')} 
              className="hover:text-prospera-accent transition-colors flex items-center gap-2 outline-none"
            >
               <Shield className="w-3 h-3" /> Security
            </button>
            <button 
              onClick={() => scrollToSection('support')} 
              className="hover:text-prospera-accent transition-colors flex items-center gap-2 outline-none"
            >
               <MessageCircle className="w-3 h-3" /> Support
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onLogin} className="hidden sm:block text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray hover:text-white transition-colors">
              Access Vault
            </button>
            <button 
              onClick={onStart} 
              className="px-8 py-4 bg-prospera-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-prospera-accent/40 hover:scale-105 active:scale-95 transition-all"
            >
              Found a Circle
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-52 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-prospera-accent/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-prospera-accent/5 border border-prospera-accent/20 rounded-full text-prospera-accent text-[10px] font-black uppercase tracking-[0.4em] shadow-inner">
            <Sparkles className="w-4 h-4" /> Strategic Collective Intelligence
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Collective Wealth. <br />
            <span className="text-prospera-accent">Simplified.</span>
          </h1>
          
          <p className="text-xl text-prospera-gray max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in duration-1000 delay-300">
            Secure, autonomous, and powered by Gemini. Prospera provides the professional infrastructure your savings circle needs to grow without friction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10 animate-in fade-in duration-1000 delay-500">
            <button 
              onClick={onStart} 
              className="group w-full sm:w-auto px-12 py-6 bg-prospera-accent text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(1,195,141,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-4"
            >
              Initialize Circle <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-4"
            >
              <Users className="w-5 h-5" /> Access Vault
            </button>
          </div>
        </div>
      </section>

      {/* Stats/Proof Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Active Protocols', value: '1,200+' },
              { label: 'Asset Throughput', value: '$45M+' },
              { label: 'Sync Latency', value: '< 10ms' },
              { label: 'Security Grade', value: 'AES-256' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-3xl font-black tracking-tighter text-white">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-32 space-y-6">
          <div className="inline-block p-4 bg-prospera-accent/10 rounded-3xl mb-4">
             <Activity className="w-8 h-8 text-prospera-accent" />
          </div>
          <h2 className="text-5xl font-black tracking-tighter">Core Infrastructure</h2>
          <p className="text-prospera-gray font-medium text-lg max-w-2xl mx-auto">Engineered for high-performance financial coordination.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: BrainCircuit, title: 'Gemini Analysis', desc: 'Real-time financial synthesis that identifies contribution patterns and predicts maturity timelines.', color: 'text-prospera-accent' },
            { icon: Fingerprint, title: 'Biometric Access', desc: 'Secure entry points utilizing modern device security layers for instant, verified vault ingress.', color: 'text-blue-500' },
            { icon: Zap, title: 'Instant Ingress', desc: 'OCR-powered ledger entries that automatically parse contribution records from raw text logs.', color: 'text-yellow-500' }
          ].map((feat, i) => (
            <div key={i} className="p-12 bg-white/[0.03] border border-white/5 rounded-[4rem] hover:bg-white/[0.05] hover:border-prospera-accent/30 transition-all group relative overflow-hidden shadow-2xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-prospera-accent/10 transition-all" />
              <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-inner">
                <feat.icon className={`w-10 h-10 ${feat.color}`} />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">{feat.title}</h3>
              <p className="text-prospera-gray leading-relaxed font-medium text-base">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Focus Section */}
      <section id="security" className="py-40 bg-prospera-darkest/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-40 opacity-[0.02] pointer-events-none">
          <ShieldCheck className="w-[800px] h-[800px] text-prospera-accent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-6xl font-black tracking-tighter leading-tight">
                Vault Security. <br />
                <span className="text-prospera-accent text-5xl">Uncompromising.</span>
              </h2>
              <p className="text-xl text-prospera-gray font-medium leading-relaxed">
                Your group wealth is protected by multi-layered encryption protocols and administrative cooling periods.
              </p>
            </div>
            
            <ul className="space-y-6">
              {[
                { icon: Lock, title: 'Immutable Ledger', desc: 'Every validated deposit is cryptographically signed and permanent.' },
                { icon: KeyRound, title: 'Dual-Key Auth', desc: 'Critical protocol changes require administrative cooling periods.' },
                { icon: ShieldAlert, title: 'Intrusion Block', desc: 'Automatic terminal lockdown after 5 failed authentication attempts.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-6 group">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-prospera-accent/10 transition-colors h-fit shadow-inner">
                    <item.icon className="w-6 h-6 text-prospera-accent" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight text-white mb-2">{item.title}</h4>
                    <p className="text-prospera-gray text-sm font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-prospera-accent/20 rounded-[4rem] blur-[100px] group-hover:opacity-40 transition-opacity" />
            <div className="relative p-12 bg-prospera-dark border border-white/10 rounded-[4rem] shadow-2xl space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-prospera-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray">Security Protocol: Active</span>
                  </div>
                  <Users className="w-5 h-5 text-prospera-accent" />
               </div>
               
               <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded-full w-full" />
                  <div className="h-4 bg-white/5 rounded-full w-3/4" />
                  <div className="h-4 bg-white/5 rounded-full w-1/2" />
               </div>
               
               <div className="pt-8 border-t border-white/5">
                  <button onClick={onStart} className="w-full py-5 bg-white text-prospera-darkest rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:scale-105 transition-all">
                    Initiate Security Check
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support / Contact Section */}
      <section id="support" className="py-40 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-black tracking-tighter">Support Protocol</h2>
              <p className="text-lg text-prospera-gray font-medium leading-relaxed">
                Our lead engineers provide direct oversight for all platform deployments. We ensure your terminal remains operational 24/7.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-prospera-accent/30 transition-colors">
                <Mail className="w-6 h-6 text-prospera-accent mb-6" />
                <h4 className="font-black uppercase tracking-widest text-[10px] text-prospera-gray mb-2">Direct Channel</h4>
                <p className="font-bold text-white">support@prospera.vault</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-prospera-accent/30 transition-colors">
                <Globe className="w-6 h-6 text-prospera-accent mb-6" />
                <h4 className="font-black uppercase tracking-widest text-[10px] text-prospera-gray mb-2">Global Operations</h4>
                <p className="font-bold text-white">Prospera.hq</p>
              </div>
            </div>
          </div>
          
          <div className="p-12 bg-white/[0.01] border border-white/5 rounded-[4rem] shadow-2xl relative group">
             <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                <MessageCircle className="w-32 h-32 text-prospera-accent" />
             </div>
             <h3 className="text-2xl font-black mb-10 tracking-tight">Transmission Terminal</h3>
             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-prospera-gray ml-1">Identifier</label>
                   <input type="text" placeholder="Full Name / Handle" className="w-full px-6 py-5 bg-prospera-darkest border border-white/10 rounded-2xl outline-none focus:border-prospera-accent text-sm font-bold shadow-inner" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-prospera-gray ml-1">Payload (Message)</label>
                   <textarea placeholder="Describe your inquiry..." className="w-full px-6 py-5 bg-prospera-darkest border border-white/10 rounded-2xl outline-none focus:border-prospera-accent h-32 text-sm font-medium shadow-inner" />
                </div>
                <button className="w-full py-6 bg-prospera-accent text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[1.8rem] shadow-2xl shadow-prospera-accent/30 hover:scale-[1.02] transition-all">
                  Broadcast Message
                </button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-prospera-accent rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">Prospera</span>
            </div>
            <p className="text-sm text-prospera-gray font-medium leading-relaxed">
              The global architecture for transparent, high-integrity group financial management. Decentralized logic, centralized transparency.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-prospera-accent mb-10">Protocols</h4>
            <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-prospera-gray">
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Documentation</button></li>
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Pricing Tier</button></li>
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Case Studies</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-prospera-accent mb-10">Ecosystem</h4>
            <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-prospera-gray">
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">iOS Terminal</button></li>
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Android Bridge</button></li>
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Integrations</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-[0.3em] text-[10px] text-prospera-accent mb-10">Governance</h4>
            <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-prospera-gray">
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Circle Terms</button></li>
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Privacy Shield</button></li>
              <li><button onClick={handlePlaceholderClick} className="hover:text-white transition-colors">Compliance</button></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-prospera-gray">© 2025 Prospera Technologies. AES-256 Encrypted.</p>
          <div className="flex gap-8 text-prospera-gray">
             <Globe className="w-5 h-5 hover:text-white transition-all cursor-pointer hover:scale-110" />
             <Smartphone className="w-5 h-5 hover:text-white transition-all cursor-pointer hover:scale-110" />
             <HeartHandshake className="w-5 h-5 hover:text-white transition-all cursor-pointer hover:scale-110" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
