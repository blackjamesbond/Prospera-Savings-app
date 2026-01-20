
import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  X,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import { UserRole, SavingsTarget } from '../types.ts';

const SavingsTargetPage: React.FC<{ role: UserRole }> = ({ role }) => {
  const { target, setTarget, showToast, preferences } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<SavingsTarget>(target);

  const progress = (target.currentAmount / target.targetAmount) * 100;
  const status = progress >= 100 ? 'MET' : progress >= 80 ? 'ALMOST MET' : 'NOT MET';

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const lastUpdate = target.lastUpdated || 0;
  const nextPossibleUpdate = lastUpdate + SEVEN_DAYS_MS;
  const canUpdate = Date.now() >= nextPossibleUpdate;

  const getRemainingTime = () => {
    if (canUpdate) return null;
    const diff = nextPossibleUpdate - Date.now();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    return `${days}d ${hours}h left`;
  };

  const [timeLeft, setTimeLeft] = useState(getRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getRemainingTime()), 60000);
    return () => clearInterval(timer);
  }, [nextPossibleUpdate]);

  const handlePreSave = () => {
    if (!canUpdate) {
      showToast(`Governance Lock: Protocol active for another ${timeLeft}.`, 'error');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalCommit = () => {
    setTarget(formData);
    setIsEditing(false);
    setShowConfirmModal(false);
  };

  const DiffItem = ({ label, original, proposed, icon: Icon }: { label: string, original: string | number, proposed: string | number, icon: any }) => {
    const isChanged = original !== proposed;
    return (
      <div className={`p-5 rounded-3xl border transition-all ${isChanged ? 'bg-prospera-accent/5 border-prospera-accent/20' : 'bg-gray-50 dark:bg-prospera-darkest/40 border-gray-100 dark:border-white/5 opacity-60'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Icon className={`w-3 h-3 ${isChanged ? 'text-prospera-accent' : 'text-prospera-gray'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-prospera-gray">{label}</span>
          {isChanged && <span className="ml-auto text-[8px] bg-prospera-accent text-prospera-darkest px-2 py-0.5 rounded-full font-black uppercase">Modified</span>}
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <p className="text-[8px] text-prospera-gray uppercase font-black mb-1 opacity-50 tracking-widest">Active State</p>
            <p className="text-sm font-bold dark:text-gray-400 text-gray-500 truncate">{original}</p>
          </div>
          <ChevronRight className={`w-4 h-4 shrink-0 ${isChanged ? 'text-prospera-accent' : 'text-prospera-gray/20'}`} />
          <div className="flex-1 text-right">
            <p className="text-[8px] text-prospera-gray uppercase font-black mb-1 opacity-50 tracking-widest">Proposed State</p>
            <p className={`text-sm font-black truncate ${isChanged ? 'text-prospera-accent' : 'dark:text-gray-400 text-gray-500'}`}>{proposed}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter dark:text-white text-gray-900 flex items-center gap-4">
            <div className="p-3 bg-prospera-accent rounded-2xl">
              <Target className="text-white w-6 h-6" />
            </div>
            Governance Portal
          </h1>
          <p className="text-prospera-gray font-bold uppercase tracking-widest text-[10px] ml-16">Global Collective Goals & Performance Heuristics</p>
        </div>
        
        {role === UserRole.ADMIN && !isEditing && (
          <button 
            disabled={!canUpdate}
            onClick={() => { setFormData(target); setIsEditing(true); }}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 border shadow-2xl ${
              canUpdate 
              ? 'bg-prospera-accent text-white border-prospera-accent shadow-prospera-accent/30 hover:scale-105 active:scale-95' 
              : 'bg-white/5 text-prospera-gray border-white/5 cursor-not-allowed'
            }`}
          >
            {canUpdate ? <LayoutGrid className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {canUpdate ? 'Initiate Modification' : `Protocol Locked (${timeLeft})`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {isEditing ? (
            <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <ShieldAlert className="w-64 h-64 text-prospera-accent" />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-1.5 h-6 bg-prospera-accent rounded-full" />
                 <h2 className="text-2xl font-black tracking-tight dark:text-white text-gray-900">Modification Terminal</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Protocol Identifier (Title)</label>
                  <input type="text" className="w-full px-6 py-5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white text-gray-900" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Capital Target ({preferences.currency})</label>
                  <input type="number" className="w-full px-6 py-5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white text-gray-900" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Maturity Deadline</label>
                  <input type="date" className="w-full px-6 py-5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none font-bold text-sm dark:text-white text-gray-900" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Strategic Logic (Motive)</label>
                  <textarea className="w-full px-6 py-5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-2xl focus:border-prospera-accent outline-none h-32 font-medium text-sm dark:text-white text-gray-900" value={formData.motive} onChange={e => setFormData({...formData, motive: e.target.value})} />
                </div>
              </div>
              
              <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-3xl flex gap-4">
                 <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                 <p className="text-[11px] text-yellow-600/80 dark:text-yellow-500/80 font-bold leading-relaxed tracking-tight">
                   ATTENTION: By committing these changes, you authorize the platform to lock all global target parameters for a standard governance cooling period of 168 hours (7 days).
                 </p>
              </div>

              <div className="flex gap-6 pt-6 border-t border-gray-100 dark:border-white/5">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-5 bg-white/5 border border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-prospera-gray hover:bg-white/10 transition-all">Discard Changes</button>
                <button onClick={handlePreSave} className="flex-1 py-5 bg-prospera-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-prospera-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all">Authorize Commit</button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[3.5rem] p-12 md:p-16 space-y-16 shadow-2xl relative overflow-hidden terminal-grid">
              <div className="absolute top-0 right-0 p-16 opacity-[0.04] pointer-events-none">
                <Target className="w-80 h-80 text-prospera-accent" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start justify-between gap-8 relative z-10">
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-prospera-accent animate-ping" />
                    <h2 className="text-4xl font-black tracking-tight dark:text-white text-gray-900">{target.title}</h2>
                  </div>
                  <p className="text-xl text-prospera-gray italic font-medium leading-relaxed">"{target.motive}"</p>
                </div>
                <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl ${
                  status === 'MET' ? 'bg-prospera-accent text-prospera-darkest' : 
                  status === 'ALMOST MET' ? 'bg-yellow-500 text-prospera-darkest' : 
                  'bg-red-500 text-white'
                }`}>
                  {status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="flex items-center gap-8 p-8 bg-gray-50 dark:bg-prospera-darkest/60 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
                  <div className="p-5 bg-prospera-accent/10 rounded-[1.5rem] shadow-xl">
                    <DollarSign className="w-10 h-10 text-prospera-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-prospera-gray uppercase font-black tracking-[0.2em] mb-2 opacity-60">Global Goal</p>
                    <p className="text-3xl font-black text-prospera-accent tracking-tighter">{preferences.currency} {target.targetAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 p-8 bg-gray-50 dark:bg-prospera-darkest/60 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner">
                  <div className="p-5 bg-prospera-accent/10 rounded-[1.5rem] shadow-xl">
                    <Calendar className="w-10 h-10 text-prospera-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-prospera-gray uppercase font-black tracking-[0.2em] mb-2 opacity-60">Maturation</p>
                    <p className="text-3xl font-black dark:text-white text-gray-900 tracking-tighter">{target.deadline}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-prospera-gray opacity-60">Capital Accumulation</p>
                    <p className="text-lg font-black dark:text-white text-gray-900">{preferences.currency} {target.currentAmount.toLocaleString()} Verified</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-black text-prospera-accent tracking-tighter">{Math.round(progress)}%</p>
                  </div>
                </div>
                <div className="w-full h-10 bg-gray-100 dark:bg-prospera-darkest/80 rounded-full overflow-hidden p-2 border border-gray-200 dark:border-white/5 shadow-2xl">
                  <div className="h-full bg-prospera-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_25px_rgba(1,195,141,0.7)]" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-prospera-gray uppercase font-black tracking-[0.3em] px-4">
                  <span>Inception</span>
                  <span className="text-prospera-accent">Delta: {preferences.currency} {(target.targetAmount - target.currentAmount).toLocaleString()}</span>
                  <span>Goal Maturity</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="p-10 bg-prospera-accent/5 border border-prospera-accent/10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute -bottom-10 -right-10 opacity-[0.04] transform group-hover:scale-125 transition-transform duration-700">
                <ShieldCheck className="w-48 h-48 text-prospera-accent" />
             </div>
            <h3 className="font-black text-[11px] uppercase tracking-[0.3em] mb-10 flex items-center gap-3 text-prospera-accent">
              <ShieldCheck className="w-5 h-5" />
              Security Heuristics
            </h3>
            <ul className="space-y-8">
              {[
                { title: 'Global Sync', desc: 'Protocol changes propagate to all member terminals instantly.' },
                { title: 'Cooling Period', desc: 'Active modification locks for 7 days post-verification.' },
                { title: 'Goal Maturity', desc: '100% accumulation triggers platform-wide legacy status.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-prospera-accent mt-1.5 shadow-[0_0_10px_#01C38D]" />
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest mb-1">{item.title}</h4>
                    <p className="text-xs text-prospera-gray leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-10 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[3rem] shadow-2xl">
            <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-prospera-gray mb-6 flex items-center gap-3">
              <Clock className="w-5 h-5 text-prospera-accent" /> System Logs
            </h3>
            <div className="p-5 bg-gray-50 dark:bg-prospera-darkest/40 rounded-3xl border-l-4 border-prospera-accent">
              <p className="text-[10px] text-prospera-gray font-black uppercase tracking-widest mb-1">Latest Revision</p>
              <p className="text-md font-black dark:text-white text-gray-900">{new Date(lastUpdate).toLocaleDateString()} @ {new Date(lastUpdate).toLocaleTimeString()}</p>
              {!canUpdate && (
                <div className="mt-4 pt-4 border-t border-white/5">
                   <p className="text-[9px] text-red-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                     <Lock className="w-3 h-3" /> Protocol Lock: {timeLeft}
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dossier Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-prospera-dark border border-white/10 rounded-[3rem] w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-prospera-accent text-white rounded-2xl shadow-xl shadow-prospera-accent/20">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight dark:text-white text-gray-900">Final Verification</h3>
                  <p className="text-[10px] text-prospera-gray uppercase tracking-[0.3em] font-black">Modification Dossier Review</p>
                </div>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-prospera-gray"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto no-scrollbar max-h-[65vh]">
              <div className="grid grid-cols-1 gap-6">
                <DiffItem label="Protocol ID" original={target.title} proposed={formData.title} icon={Target} />
                <DiffItem label="Capital Target" original={`${preferences.currency} ${target.targetAmount.toLocaleString()}`} proposed={`${preferences.currency} ${formData.targetAmount.toLocaleString()}`} icon={DollarSign} />
                <DiffItem label="Deadline" original={target.deadline} proposed={formData.deadline} icon={Calendar} />
                
                <div className={`p-6 rounded-[2rem] border transition-all ${target.motive !== formData.motive ? 'bg-prospera-accent/5 border-prospera-accent/20' : 'bg-gray-50 dark:bg-prospera-darkest/40 border-gray-100 dark:border-white/5 opacity-40'}`}>
                   <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className={`w-3 h-3 ${target.motive !== formData.motive ? 'text-prospera-accent' : 'text-prospera-gray'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-prospera-gray">Strategic Motive Logic</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[9px] text-prospera-gray uppercase font-black tracking-widest opacity-50">Active Statement</p>
                      <p className="text-sm text-prospera-gray italic leading-relaxed">"{target.motive}"</p>
                    </div>
                    {target.motive !== formData.motive && (
                      <div className="space-y-2">
                        <p className="text-[9px] text-prospera-accent uppercase font-black tracking-widest">Proposed Revision</p>
                        <p className="text-sm dark:text-white text-gray-900 font-bold leading-relaxed">"{formData.motive}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center gap-6">
                <div className="p-4 bg-red-500 rounded-2xl shadow-xl shadow-red-500/20">
                  <ShieldAlert className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Final Authorization Notice</h4>
                  <p className="text-xs text-prospera-gray leading-relaxed font-bold tracking-tight">
                    Committing this revision will finalize the ledger and initiate a <span className="text-red-500 uppercase">7-Day Immutable Lock</span>. No further target adjustments will be permitted until the cooling period expires.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex gap-6">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-5 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] text-prospera-gray hover:bg-white/5 transition-all">Abondon Revision</button>
              <button onClick={handleFinalCommit} className="flex-1 py-5 bg-prospera-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-prospera-accent/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">Authorize Commit <CheckCircle className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsTargetPage;
