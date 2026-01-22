
import React, { useState, useEffect, useMemo } from 'react';
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
import { UserRole, SavingsTarget, TransactionStatus } from '../types.ts';

const SavingsTargetPage: React.FC<{ role: UserRole }> = ({ role }) => {
  const { target, setTarget, transactions, showToast, preferences } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<SavingsTarget>(target);

  const todayStr = new Date().toISOString().split('T')[0];

  const verifiedTotal = useMemo(() => {
    return transactions
      .filter(t => t.status === TransactionStatus.APPROVED)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const progress = target.targetAmount > 0 ? (verifiedTotal / target.targetAmount) * 100 : 0;
  const statusLabel = progress >= 100 ? 'GOAL MET' : progress >= 80 ? 'ALMOST THERE' : 'SAVING';

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const lastUpdate = target.lastUpdated || 0;
  const nextPossibleUpdate = lastUpdate + SEVEN_DAYS_MS;
  const canUpdate = Date.now() >= nextPossibleUpdate;

  const formatDateSafely = (timestamp: number | undefined) => {
    if (!timestamp) return 'Never updated';
    try {
      const d = new Date(timestamp);
      if (isNaN(d.getTime())) return 'Invalid Date';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

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
      showToast(`Locked: You can change this again in ${timeLeft}.`, 'error');
      return;
    }
    
    if (formData.deadline < todayStr) {
      showToast('Error: Date cannot be in the past.', 'error');
      return;
    }

    if (formData.targetAmount <= 0) {
      showToast('Error: Amount must be more than zero.', 'error');
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
      <div className={`p-4 rounded-2xl border transition-all ${isChanged ? 'bg-prospera-accent/5 border-prospera-accent/20' : 'bg-gray-50 dark:bg-prospera-darkest/40 border-gray-100 dark:border-white/5 opacity-60'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-2.5 h-2.5 ${isChanged ? 'text-prospera-accent' : 'text-prospera-gray'}`} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-prospera-gray">{label}</span>
          {isChanged && <span className="ml-auto text-[6px] bg-prospera-accent text-prospera-darkest px-1.5 py-0.5 rounded-full font-black uppercase">Changed</span>}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-[6px] text-prospera-gray uppercase font-black mb-0.5 opacity-50 tracking-widest">Current</p>
            <p className="text-[10px] font-bold dark:text-gray-400 text-gray-500 truncate">{original}</p>
          </div>
          <ChevronRight className={`w-3 h-3 shrink-0 ${isChanged ? 'text-prospera-accent' : 'text-prospera-gray/20'}`} />
          <div className="flex-1 text-right">
            <p className="text-[6px] text-prospera-gray uppercase font-black mb-0.5 opacity-50 tracking-widest">New</p>
            <p className={`text-[10px] font-black truncate ${isChanged ? 'text-prospera-accent' : 'dark:text-gray-400 text-gray-500'}`}>{proposed}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tighter dark:text-white text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-prospera-accent rounded-lg">
              <Target className="text-white w-5 h-5" />
            </div>
            Group Savings Goal
          </h1>
          <p className="text-prospera-gray font-bold uppercase tracking-widest text-[8px] ml-1">Plan your future together</p>
        </div>
        
        {role === UserRole.ADMIN && !isEditing && (
          <button 
            disabled={!canUpdate}
            onClick={() => { setFormData(target); setIsEditing(true); }}
            className={`px-5 py-2.5 rounded-xl font-black text-[8px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 border shadow-lg ${
              canUpdate 
              ? 'bg-prospera-accent text-white border-prospera-accent shadow-prospera-accent/30 hover:scale-105 active:scale-95' 
              : 'bg-white/5 text-prospera-gray border-white/5 cursor-not-allowed'
            }`}
          >
            {canUpdate ? <LayoutGrid className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {canUpdate ? 'Edit Goal' : `Locked for ${timeLeft}`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {isEditing ? (
            <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 space-y-5 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShieldAlert className="w-40 h-40 text-prospera-accent" />
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-1 h-4 bg-prospera-accent rounded-full" />
                 <h2 className="text-lg font-black tracking-tight dark:text-white text-gray-900">Change Goal</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-[8px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Goal Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:border-prospera-accent outline-none font-bold text-[11px] dark:text-white text-gray-900" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Money Needed ({preferences.currency})</label>
                  <input type="number" className="w-full px-4 py-3 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:border-prospera-accent outline-none font-bold text-[11px] dark:text-white text-gray-900" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Target Date</label>
                  <input 
                    type="date" 
                    min={todayStr} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:border-prospera-accent outline-none font-bold text-[11px] dark:text-white text-gray-900" 
                    value={formData.deadline} 
                    onChange={e => setFormData({...formData, deadline: e.target.value})} 
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-prospera-gray font-black uppercase tracking-[0.2em] ml-1">Why are we saving?</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-xl focus:border-prospera-accent outline-none h-20 font-medium text-[10px] dark:text-white text-gray-900" value={formData.motive} onChange={e => setFormData({...formData, motive: e.target.value})} />
                </div>
              </div>
              
              <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex gap-3">
                 <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                 <p className="text-[8px] text-yellow-600/80 dark:text-yellow-500/80 font-bold leading-tight tracking-tight">
                   NOTE: After you save, you cannot change this again for 7 days.
                 </p>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-white/5">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl font-black text-[8px] uppercase tracking-[0.2em] text-prospera-gray hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={handlePreSave} className="flex-1 py-3 bg-prospera-accent text-white rounded-xl font-black text-[8px] uppercase tracking-[0.2em] shadow-lg shadow-prospera-accent/30 hover:scale-[1.01] transition-all">Confirm Changes</button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 md:p-10 space-y-10 shadow-xl relative overflow-hidden terminal-grid">
              <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
                <Target className="w-48 h-48 text-prospera-accent" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 relative z-10">
                <div className="space-y-2 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-prospera-accent animate-ping" />
                    <h2 className="text-2xl font-black tracking-tight dark:text-white text-gray-900">{target.title}</h2>
                  </div>
                  <p className="text-xs text-prospera-gray italic font-medium leading-relaxed">"{target.motive}"</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-sm ${
                  statusLabel === 'GOAL MET' ? 'bg-prospera-accent text-prospera-darkest' : 
                  statusLabel === 'ALMOST THERE' ? 'bg-yellow-500 text-prospera-darkest' : 
                  'bg-red-500 text-white'
                }`}>
                  {statusLabel}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-prospera-darkest/60 rounded-[1.2rem] border border-gray-100 dark:border-white/5 shadow-inner">
                  <div className="p-3 bg-prospera-accent/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-prospera-accent" />
                  </div>
                  <div>
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-[0.2em] mb-0.5 opacity-60">Total Needed</p>
                    <p className="text-xl font-black text-prospera-accent tracking-tighter">{preferences.currency} {target.targetAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-prospera-darkest/60 rounded-[1.2rem] border border-gray-100 dark:border-white/5 shadow-inner">
                  <div className="p-3 bg-prospera-accent/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-prospera-accent" />
                  </div>
                  <div>
                    <p className="text-[8px] text-prospera-gray uppercase font-black tracking-[0.2em] mb-0.5 opacity-60">Target Date</p>
                    <p className="text-xl font-black dark:text-white text-gray-900 tracking-tighter">{target.deadline}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-prospera-gray opacity-60">Money Saved</p>
                    <p className="text-sm font-black dark:text-white text-gray-900">{preferences.currency} {verifiedTotal.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-prospera-accent tracking-tighter">{Math.round(progress)}%</p>
                  </div>
                </div>
                <div className="w-full h-6 bg-gray-100 dark:bg-prospera-darkest/80 rounded-full overflow-hidden p-1 border border-gray-200 dark:border-white/5 shadow-md">
                  <div className="h-full bg-prospera-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(1,195,141,0.5)]" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[7px] text-prospera-gray uppercase font-black tracking-[0.3em] px-1">
                  <span>Start</span>
                  <span className="text-prospera-accent">{preferences.currency} {Math.max(0, target.targetAmount - verifiedTotal).toLocaleString()} to go</span>
                  <span>Goal</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="p-6 bg-prospera-accent/5 border border-prospera-accent/10 rounded-[1.8rem] shadow-xl relative overflow-hidden group">
             <div className="absolute -bottom-8 -right-8 opacity-[0.04] transform group-hover:scale-110 duration-700">
                <ShieldCheck className="w-24 h-24 text-prospera-accent" />
             </div>
            <h3 className="font-black text-[9px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2 text-prospera-accent">
              <ShieldCheck className="w-3.5 h-3.5" />
              How it works
            </h3>
            <ul className="space-y-5">
              {[
                { title: 'Only Verified Money', desc: 'Progress only shows money confirmed by the admin.' },
                { title: 'Goal Lock', desc: 'Changes are locked for 7 days after saving.' },
                { title: 'Keep Saving', desc: 'You can keep saving even after hitting the goal.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-1 h-1 rounded-full bg-prospera-accent mt-1.5 shadow-[0_0_5px_#01C38D]" />
                  <div>
                    <h4 className="text-[8px] font-black uppercase dark:text-white text-gray-900 tracking-widest mb-0.5">{item.title}</h4>
                    <p className="text-[9px] text-prospera-gray leading-tight font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-6 bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-[1.8rem] shadow-xl">
            <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-prospera-gray mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-prospera-accent" /> Goal History
            </h3>
            <div className="p-3.5 bg-gray-50 dark:bg-prospera-darkest/40 rounded-xl border-l-4 border-prospera-accent">
              <p className="text-[8px] text-prospera-gray font-black uppercase tracking-widest mb-0.5">Last Update</p>
              <p className="text-xs font-black dark:text-white text-gray-900">{formatDateSafely(lastUpdate)}</p>
              {!canUpdate && (
                <div className="mt-2 pt-2 border-t dark:border-white/5 border-gray-100">
                   <p className="text-[7px] text-red-400 font-black uppercase tracking-[0.2em] flex items-center gap-1">
                     <Lock className="w-2.5 h-2.5" /> Locked for: {timeLeft}
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-prospera-dark border border-white/10 rounded-[2.2rem] w-full max-w-xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b dark:border-white/5 border-gray-100 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-prospera-accent text-white rounded-lg shadow-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight dark:text-white text-gray-900">Check Your Changes</h3>
                  <p className="text-[8px] text-prospera-gray uppercase tracking-[0.3em] font-black">Goal Review</p>
                </div>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-white/10 rounded-full text-prospera-gray"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto no-scrollbar max-h-[50vh]">
              <div className="grid grid-cols-1 gap-3">
                <DiffItem label="Goal Name" original={target.title} proposed={formData.title} icon={Target} />
                <DiffItem label="Money Needed" original={`${preferences.currency} ${target.targetAmount.toLocaleString()}`} proposed={`${preferences.currency} ${formData.targetAmount.toLocaleString()}`} icon={DollarSign} />
                <DiffItem label="Target Date" original={target.deadline} proposed={formData.deadline} icon={Calendar} />
                
                <div className={`p-4 rounded-xl border transition-all ${target.motive !== formData.motive ? 'bg-prospera-accent/5 border-prospera-accent/20' : 'bg-gray-50 dark:bg-prospera-darkest/40 border-gray-100 dark:border-white/5 opacity-40'}`}>
                   <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className={`w-2.5 h-2.5 ${target.motive !== formData.motive ? 'text-prospera-accent' : 'text-prospera-gray'}`} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-prospera-gray">Why we save</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="space-y-0.5">
                      <p className="text-[6px] text-prospera-gray uppercase font-black mb-0.5 opacity-50 tracking-widest">Old Reason</p>
                      <p className="text-[9px] text-prospera-gray italic leading-tight">"{target.motive}"</p>
                    </div>
                    {target.motive !== formData.motive && (
                      <div className="space-y-0.5 mt-2 pt-2 border-t dark:border-white/5 border-gray-100">
                        <p className="text-[6px] text-prospera-accent uppercase font-black mb-0.5 tracking-widest">New Reason</p>
                        <p className="text-[10px] dark:text-white text-gray-900 font-bold leading-tight">"{formData.motive}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4">
                <div className="p-2 bg-red-500 rounded-lg shadow-lg">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500 mb-0.5">Wait!</h4>
                  <p className="text-[9px] text-prospera-gray leading-tight font-bold">
                    After you save, you <span className="text-red-500">cannot change these details again for 7 days</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t dark:border-white/5 border-gray-100 bg-white/[0.01] flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] text-prospera-gray hover:bg-white/5 transition-all">Go Back</button>
              <button onClick={handleFinalCommit} className="flex-1 py-3 bg-prospera-accent text-white rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-lg shadow-prospera-accent/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">Confirm and Save <CheckCircle className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsTargetPage;
