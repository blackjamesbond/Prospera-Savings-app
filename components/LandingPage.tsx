
import React from 'react';
import { Target, Shield, Zap, ArrowRight, Download, Smartphone, HeartHandshake, Globe, Mail, MessageCircle, ChevronRight, Sparkles, BrainCircuit } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-prospera-darkest text-white selection:bg-prospera-accent selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-prospera-darkest/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-prospera-accent rounded-xl flex items-center justify-center shadow-lg shadow-prospera-accent/20">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-prospera-accent">Prospera</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-prospera-gray">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#support" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="px-6 py-2.5 text-sm font-bold hover:text-prospera-accent transition-colors">Login</button>
            <button onClick={onStart} className="px-6 py-2.5 bg-prospera-accent text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-prospera-accent/20 hover:scale-105 transition-all">Found a Circle</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-prospera-accent/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-prospera-accent/10 border border-prospera-accent/20 rounded-full text-prospera-accent text-[10px] font-black uppercase tracking-widest animate-fade-in">
            <Sparkles className="w-3 h-3" /> Re-imagining Group Finance
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-slide-up">
            Invest in your circle. <br />
            <span className="text-prospera-accent">Invest in you.</span>
          </h1>
          <p className="text-xl text-prospera-gray max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in delay-200">
            Prospera is the world's most secure, AI-powered group savings platform. Track contributions, set shared goals, and leverage deep strategic insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 animate-fade-in delay-300">
            <button onClick={onStart} className="group w-full sm:w-auto px-10 py-5 bg-prospera-accent text-white rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-prospera-accent/40 hover:scale-105 transition-all flex items-center justify-center gap-3">
              Start Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Download className="w-5 h-5" /> Download App
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl font-black">Built for Growth</h2>
          <p className="text-prospera-gray">Everything you need to manage collective wealth.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: BrainCircuit, title: 'AI Insights', desc: 'Predictive analytics that forecast your group savings timeline and stability.' },
            { icon: Shield, title: 'Hard Lockdown', desc: 'Vault-level security with 5-trial limits and admin-mediated recovery protocols.' },
            { icon: Zap, title: 'Instant Parsing', desc: 'Automated receipt reading that recognizes transactions directly from text logs.' }
          ].map((feat, i) => (
            <div key={i} className="p-10 bg-prospera-dark border border-white/5 rounded-[3rem] hover:border-prospera-accent/30 transition-all group">
              <div className="w-16 h-16 bg-prospera-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <feat.icon className="w-8 h-8 text-prospera-accent" />
              </div>
              <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
              <p className="text-prospera-gray leading-relaxed text-sm font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support / Contact */}
      <section id="support" className="py-24 bg-prospera-accent/5 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black leading-tight">We've got your <br /><span className="text-prospera-accent">back.</span></h2>
            <p className="text-prospera-gray text-lg font-medium">Our elite support engineers are available 24/7 to ensure your circle's integrity is never compromised.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <Mail className="text-prospera-accent" />
                <div>
                  <p className="text-xs font-black uppercase text-prospera-gray">Direct Line</p>
                  <p className="font-bold">support@prospera.vault</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <MessageCircle className="text-prospera-accent" />
                <div>
                  <p className="text-xs font-black uppercase text-prospera-gray">Live Connect</p>
                  <p className="font-bold">Chat with our engineers</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-10 bg-prospera-dark rounded-[4rem] border border-white/5 relative shadow-2xl">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-prospera-accent/20 blur-3xl" />
             <h3 className="text-2xl font-black mb-8">Quick Inquiry</h3>
             <form className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-4 bg-prospera-darkest rounded-2xl border border-white/10 outline-none focus:border-prospera-accent" />
                <textarea placeholder="Message" className="w-full p-4 bg-prospera-darkest rounded-2xl border border-white/10 outline-none focus:border-prospera-accent h-32" />
                <button className="w-full py-5 bg-prospera-accent text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-prospera-accent/20">Send Inquiry</button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-prospera-accent rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">Prospera</span>
            </div>
            <p className="text-xs text-prospera-gray font-medium leading-relaxed">The global standard for transparent, collective wealth management. Secure, efficient, and intelligent.</p>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-prospera-accent mb-6">Circle</h4>
            <ul className="space-y-3 text-sm font-medium text-prospera-gray">
              <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Group Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-prospera-accent mb-6">Ecosystem</h4>
            <ul className="space-y-3 text-sm font-medium text-prospera-gray">
              <li><a href="#" className="hover:text-white transition-colors">iOS Vault</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Android Ledger</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-prospera-accent mb-6">Legal</h4>
            <ul className="space-y-3 text-sm font-medium text-prospera-gray">
              <li><a href="#" className="hover:text-white transition-colors">Transparency</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Shield</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Circle Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-prospera-gray">© 2024 Prospera Technologies. All records encrypted.</p>
          <div className="flex gap-6 text-prospera-gray">
             <Globe className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
             <Smartphone className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
             <HeartHandshake className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
