
import React, { useState, useEffect, useMemo } from 'react';
import { Target, Calendar, MessageSquare, DollarSign, CheckCircle, AlertCircle, Clock, ShieldAlert, Lock, ShieldCheck, ChevronRight, X, Zap, LayoutGrid } from 'lucide-react';
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
      showToast(`Locked: Cooldown expires in ${timeLeft}.`, 'error');
      return;
    }
    if (formData.deadline < todayStr) {
      showToast('Validation Error: Target date must be future-dated.', 'error');
      return;
    }
    if (formData.targetAmount <= 0) {
      showToast('Validation Error: Liquidity target must exceed zero.', 'error');
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
      <div className={`p-3 rounded-xl border transition-all ${isChanged ? 'bg-prospera-accent/5 border-prospera-accent/20' : 'bg-gray-50 dark:bg-prospera-darkest/40 border-gray-100 dark:border-white/5 opacity-60'}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className={`w-2.5 h-2.5 ${isChanged ? 'text-prospera-accent' : 'text-prospera-gray'}`} />
          <span className="text-[7px] font-black uppercase tracking-widest text-prospera-gray">{label}</span>
          {isChanged && <span className="ml-auto text-[5px] bg-prospera-accent text-prospera-darkest px-1 py-0.5 rounded-sm font-black uppercase">Diff</span>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-bold dark:text-gray-400 text-gray-500 truncate">{original}</p>
          </div>
          <ChevronRight className={`w-3 h-3 shrink-0 ${isChanged ? 'text-prospera-accent' : 'text-prospera-gray/20'}`} />
          <div className="flex-1 text-right">
            <p className={`text-[10px] font-black truncate ${isChanged ? 'text-prospera-accent' : 'dark:text-gray-400 text-gray-500'}`}>{proposed}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black tracking-tight dark:text-white text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-prospera-accent rounded-lg">
              <Target className="text-white w-4 h-4" />
            </div>
            Circle Objective
          </h1>
          <p className="text-prospera-gray font-bold uppercase tracking-[0.3em] text-[7px] ml-1">Strategic Savings Deployment</p>
        </div>
        
        {role === UserRole.ADMIN && !isEditing && (
          <button 
            disabled={!canUpdate}
            onClick={() => { setFormData(target); setIsEditing(true); }}
            className={`px-4 py-2 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm ${
              canUpdate 
              ? 'bg-prospera-accent text-white border-prospera-accent shadow-prospera-accent/10 hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-white/5 text-prospera-gray border-white/5 cursor-not-allowed'
            }`}
          >
            {canUpdate ? <LayoutGrid className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {canUpdate ? 'Edit Parameters' : `Locked: ${timeLeft}`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {isEditing ? (
            <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <ShieldAlert className="w-24 h-24 text-prospera-accent" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest dark:text-white text-gray-900">Adjust Goal Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-prospera-gray font-black uppercase tracking-widest ml-1">Objective Title</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-lg focus:border-prospera-accent outline-none font-bold text-xs dark:text-white text-gray-900" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-prospera-gray font-black uppercase tracking-widest ml-1">Liquidity Target ({preferences.currency})</label>
                  <input type="number" className="w-full px-3 py-2.5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-lg focus:border-prospera-accent outline-none font-bold text-xs dark:text-white text-gray-900" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-prospera-gray font-black uppercase tracking-widest ml-1">Finality Date</label>
                  <input type="date" min={todayStr} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-lg focus:border-prospera-accent outline-none font-bold text-xs dark:text-white text-gray-900" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                   <label className="text-[8px] text-prospera-gray font-black uppercase tracking-widest ml-1">Objective Motive</label>
                   <textarea className="w-full px-3 py-2.5 bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/10 rounded-lg focus:border-prospera-accent outline-none h-20 font-medium text-xs dark:text-white" value={formData.motive} onChange={e => setFormData({...formData, motive: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 bg-white/5 border border-white/5 rounded-lg font-black text-[9px] uppercase tracking-widest text-prospera-gray">Cancel</button>
                <button onClick={handlePreSave} className="flex-1 py-2.5 bg-prospera-accent text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-prospera-accent/10">Authorize Updates</button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 rounded-2xl p-6 md:p-8 space-y-8 shadow-xl relative overflow-hidden terminal-grid">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Target className="w-32 h-32 text-prospera-accent" />
              </div>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 relative z-10">
                <div className="space-y-1 max-w-lg">
                  <h2 className="text-xl font-black tracking-tight dark:text-white text-gray-900">{target.title}</h2>
                  <p className="text-[10px] text-prospera-gray italic font-medium leading-relaxed">"{target.motive}"</p>
                </div>
                <div className={`px-3 py-1 rounded-md text-[7px] font-black uppercase tracking-widest shadow-sm ${
                  statusLabel === 'GOAL MET' ? 'bg-prospera-accent text-prospera-darkest' : 
                  statusLabel === 'ALMOST THERE' ? 'bg-yellow-500 text-prospera-darkest' : 
                  'bg-red-500 text-white'
                }`}>
                  {statusLabel}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-prospera-darkest/60 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="p-2.5 bg-prospera-accent/10 rounded-lg"><DollarSign className="w-5 h-5 text-prospera-accent" /></div>
                  <div><p className="text-[7px] text-prospera-gray uppercase font-black tracking-widest mb-0.5">Principal Required</p><p className="text-lg font-black text-prospera-accent tracking-tighter">{preferences.currency} {target.targetAmount.toLocaleString()}</p></div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-prospera-darkest/60 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="p-2.5 bg-prospera-accent/10 rounded-lg"><Calendar className="w-5 h-5 text-prospera-accent" /></div>
                  <div><p className="text-[7px] text-prospera-gray uppercase font-black tracking-widest mb-0.5">Target Finality</p><p className="text-lg font-black dark:text-white text-gray-900 tracking-tighter">{target.deadline}</p></div>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5"><p className="text-[7px] font-black uppercase tracking-widest text-prospera-gray opacity-60">Assets Accumulated</p><p className="text-xs font-black dark:text-white text-gray-900">{preferences.currency} {verifiedTotal.toLocaleString()}</p></div>
                  <p className="text-2xl font-black text-prospera-accent tracking-tighter">{Math.round(progress)}%</p>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-prospera-darkest/80 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-white/5 shadow-inner">
                  <div className="h-full bg-prospera-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(1,195,141,0.4)]" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-prospera-accent/5 border border-prospera-accent/10 rounded-2xl shadow-xl relative overflow-hidden group">
             <div className="absolute -bottom-6 -right-6 opacity-[0.03] transform group-hover:scale-110 duration-700"><ShieldCheck className="w-16 h-16 text-prospera-accent" /></div>
            <h3 className="font-black text-[8px] uppercase tracking-widest mb-6 flex items-center gap-2 text-prospera-accent">Governance Logic</h3>
            <ul className="space-y-4">
              {[
                { title: 'Asset Validation', desc: 'Only admin-verified funds impact progress metrics.' },
                { title: 'Edit Lockout', desc: 'Protocol parameters freeze for 7 days post-update.' },
                { title: 'Surplus Ingress', desc: 'Contributions may exceed the set objective threshold.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <div className="w-0.5 h-3 bg-prospera-accent mt-1" />
                  <div>
                    <h4 className="text-[8px] font-black uppercase dark:text-white text-gray-900 tracking-widest mb-0.5">{item.title}</h4>
                    <p className="text-[9px] text-prospera-gray leading-tight font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-prospera-dark border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b dark:border-white/5 border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-prospera-accent" /><h3 className="text-sm font-black uppercase tracking-widest dark:text-white text-gray-900">Audit Adjustments</h3></div>
              <button onClick={() => setShowConfirmModal(false)} className="p-1 hover:bg-white/10 rounded-md text-prospera-gray"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto no-scrollbar max-h-[60vh]">
              <DiffItem label="Header" original={target.title} proposed={formData.title} icon={Target} />
              <DiffItem label="Target" original={`${preferences.currency} ${target.targetAmount.toLocaleString()}`} proposed={`${preferences.currency} ${formData.targetAmount.toLocaleString()}`} icon={DollarSign} />
              <DiffItem label="Deadline" original={target.deadline} proposed={formData.deadline} icon={Calendar} />
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-[9px] text-prospera-gray leading-tight font-bold">
                  NOTICE: Authorizing these changes will initiate a <span className="text-red-500">168-hour lockdown</span> on the objective terminal.
                </p>
              </div>
            </div>
            <div className="p-4 border-t dark:border-white/5 border-gray-100 flex gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2.5 border border-white/10 rounded-lg font-black text-[9px] uppercase tracking-widest text-prospera-gray">Reject</button>
              <button onClick={handleFinalCommit} className="flex-1 py-2.5 bg-prospera-accent text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-prospera-accent/10">Authorize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsTargetPage;
