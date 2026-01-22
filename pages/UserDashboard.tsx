
import React, { useMemo } from 'react';
import { Target, Bell, Trophy, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import DashboardCard from '../components/DashboardCard.tsx';
import TransactionTable from '../components/TransactionTable.tsx';

const UserDashboard: React.FC = () => {
  const { transactions, target, notifications, currentUser, preferences } = useAppContext();
  
  if (!currentUser) return null;

  const myApproved = useMemo(() => transactions.filter(t => t.userId === currentUser.id && t.status === 'APPROVED'), [transactions, currentUser.id]);
  const myTotal = useMemo(() => myApproved.reduce((sum, t) => sum + t.amount, 0), [myApproved]);
  const groupTotal = useMemo(() => transactions.filter(t => t.status === 'APPROVED').reduce((sum, t) => sum + t.amount, 0), [transactions]);
  
  const progress = (target.targetAmount > 0) ? (groupTotal / target.targetAmount) * 100 : 0;
  const remainingToTarget = Math.max(0, target.targetAmount - groupTotal);
  const { dashboardConfig } = preferences;

  return (
    <div className="space-y-4 animate-in fade-in duration-700 pb-20">
      <div className="relative p-6 bg-prospera-accent rounded-2xl shadow-xl overflow-hidden group">
         <div className="absolute top-0 right-0 p-6 opacity-10 transform group-hover:rotate-6 duration-700"><Trophy className="w-32 h-32 text-white" /></div>
         <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-white" /><span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/80">Ingress Authorized</span></div>
            <h2 className="text-2xl font-black tracking-tight text-white">Greetings, {currentUser.name}</h2>
            <p className="text-xs text-white/80 font-medium max-w-lg">
               Assets secured: <span className="font-black text-white">{preferences.currency} {myTotal.toLocaleString()}</span>. 
               Circle standing: <span className="font-black text-white">#{currentUser.rank}</span>.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Personal Stake" value={`${preferences.currency} ${myTotal.toLocaleString()}`} subtitle="Audited Deposits" icon={TrendingUp} />
        {dashboardConfig.showTarget && <DashboardCard title="Goal Progress" value={`${Math.round(progress)}%`} subtitle={`${preferences.currency} ${remainingToTarget.toLocaleString()} deficit`} icon={Target} />}
        <DashboardCard title="Alerts" value={notifications.filter(n => !n.read && (!n.recipientId || n.recipientId === currentUser.id)).length} icon={Bell} subtitle="System Notifications" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dashboardConfig.showTarget && (
          <div className="p-5 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl flex flex-col justify-between terminal-grid">
            <div>
               <div className="flex items-center justify-between mb-4"><h2 className="text-[10px] font-black dark:text-white text-gray-900 uppercase tracking-widest">Active Objective</h2><div className="p-1.5 bg-prospera-accent/10 rounded-lg"><Zap className="text-prospera-accent w-3.5 h-3.5" /></div></div>
               <p className="text-sm font-black dark:text-white text-gray-900 mb-1">{target.title}</p>
               <p className="text-[9px] text-prospera-gray italic line-clamp-2">"{target.motive}"</p>
            </div>
            <div className="space-y-2.5 mt-6">
              <div className="flex justify-between items-end"><span className="text-[7px] font-black uppercase tracking-widest text-prospera-gray">Liquidity Progress</span><span className="text-lg font-black text-prospera-accent tracking-tighter">{Math.round(progress)}%</span></div>
              <div className="h-2.5 bg-gray-100 dark:bg-prospera-darkest rounded-full overflow-hidden p-0.5 border dark:border-white/5 border-gray-200">
                <div style={{ width: `${Math.min(progress, 100)}%` }} className="h-full bg-prospera-accent rounded-full transition-all duration-1000 shadow-[0_0_8px_var(--prospera-accent)]"/>
              </div>
            </div>
          </div>
        )}

        {dashboardConfig.showLogs && (
          <div className="p-5 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl">
            <h2 className="text-[10px] font-black mb-4 dark:text-white text-gray-900 uppercase tracking-widest">Personal Log</h2>
            <div className="space-y-2.5">
              {notifications.filter(n => !n.recipientId || n.recipientId === currentUser.id).slice(0, 3).map(n => (
                <div key={n.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-prospera-darkest/50 border border-gray-100 dark:border-white/5">
                  <div className={`p-2 rounded-lg h-fit ${n.type === 'success' ? 'bg-prospera-accent text-white' : n.type === 'warning' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'}`}><Bell className="w-3 h-3" /></div>
                  <div>
                    <h4 className="text-[8px] font-black dark:text-white text-gray-900 uppercase tracking-tight mb-0.5">{n.title}</h4>
                    <p className="text-[10px] text-prospera-gray leading-tight line-clamp-1">{n.message}</p>
                  </div>
                </div>
              ))}
              {notifications.filter(n => !n.recipientId || n.recipientId === currentUser.id).length === 0 && (
                <p className="text-[9px] text-prospera-gray font-black italic py-6 text-center uppercase tracking-widest opacity-40">Logs Clear</p>
              )}
            </div>
          </div>
        )}
      </div>

      {dashboardConfig.showRecentTransactions && (
        <div className="p-5 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl">
          <h2 className="text-[10px] font-black mb-4 dark:text-white text-gray-900 uppercase tracking-widest">Recent Activity</h2>
          <TransactionTable transactions={myApproved.slice(0, 5)} showActions={false} />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
