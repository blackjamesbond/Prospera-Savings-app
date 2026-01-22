
import React, { useMemo } from 'react';
import { Target, Users, Bell, DollarSign, Activity, Terminal, ShieldPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext.tsx';
import DashboardCard from '../components/DashboardCard.tsx';
import TransactionTable from '../components/TransactionTable.tsx';
import { UserStatus } from '../types.ts';

const AdminDashboard: React.FC = () => {
  const { transactions, users, target, notifications, preferences } = useAppContext();

  const totalSaved = useMemo(() => 
    transactions.filter(t => t.status === 'APPROVED').reduce((sum, t) => sum + t.amount, 0),
  [transactions]);

  const pendingMembers = useMemo(() => users.filter(u => u.status === UserStatus.PENDING).length, [users]);

  const contributionData = useMemo(() => {
    return users.map(u => {
      const userTotal = transactions.filter(t => t.userId === u.id && t.status === 'APPROVED').reduce((s, t) => s + t.amount, 0);
      return { name: u.name.split(' ')[0], amount: userTotal };
    }).sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [users, transactions]);

  const progress = target.targetAmount > 0 ? (totalSaved / target.targetAmount) * 100 : 0;
  const { dashboardConfig } = preferences;

  return (
    <div className="space-y-4 animate-in fade-in duration-700 pb-20">
      <div className="relative p-5 bg-prospera-accent/5 border border-prospera-accent/10 rounded-xl overflow-hidden terminal-grid">
         <div className="absolute top-0 right-0 p-6 opacity-10"><Activity className="w-20 h-20 text-prospera-accent animate-pulse" /></div>
         <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
               <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-prospera-accent animate-ping" /><h2 className="text-lg font-black dark:text-white text-gray-900 leading-none">Admin Control Panel</h2></div>
               <p className="text-prospera-gray font-black uppercase tracking-[0.3em] text-[7px]">Circle Integrity Overview</p>
            </div>
            <div className="flex gap-2">
               <div className="px-3 py-1.5 bg-white dark:bg-prospera-dark rounded-lg border border-gray-100 dark:border-white/5 shadow-lg text-center"><p className="text-[7px] text-prospera-gray font-black uppercase mb-0.5 tracking-widest">Terminal</p><p className="text-[10px] font-black text-prospera-accent uppercase tracking-widest">Online</p></div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Group Total" value={`${preferences.currency} ${totalSaved.toLocaleString()}`} icon={DollarSign} subtitle="Validated Assets" />
        {dashboardConfig.showTarget && <DashboardCard title="Goal Status" value={`${Math.round(progress)}%`} subtitle={target.title} icon={Target} />}
        <DashboardCard title="Circle Members" value={users.filter(u => u.status === UserStatus.ACTIVE).length} icon={Users} subtitle="Verified Entities" />
        <DashboardCard title="Join Requests" value={pendingMembers} icon={ShieldPlus} subtitle="Awaiting Ingress" className={pendingMembers > 0 ? 'border-prospera-accent animate-pulse' : ''} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {dashboardConfig.showAnalytics && (
          <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl">
            <h2 className="text-[10px] font-black tracking-tight dark:text-white text-gray-900 mb-6 uppercase tracking-widest">Asset Distribution</h2>
            <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={contributionData}><CartesianGrid strokeDasharray="3 3" stroke={preferences.theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} /><XAxis dataKey="name" stroke="#696E79" fontSize={8} tickLine={false} axisLine={false} fontWeight="bold" dy={5} /><YAxis stroke="#696E79" fontSize={8} tickLine={false} axisLine={false} fontWeight="bold" /><Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#191E29', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#01C38D', fontSize: '10px' }} /><Bar dataKey="amount" fill="var(--prospera-accent)" radius={[2, 2, 0, 0]} barSize={14} /></BarChart></ResponsiveContainer></div>
          </div>
        )}
        
        {dashboardConfig.showLogs && (
          <div className={`${dashboardConfig.showAnalytics ? 'lg:col-span-1' : 'lg:col-span-3'} p-5 rounded-xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl flex flex-col`}>
            <h2 className="text-[10px] font-black mb-4 flex items-center dark:text-white text-gray-900 uppercase tracking-widest"><Bell className="w-3.5 h-3.5 mr-2 text-prospera-accent" /> Governance Feed</h2>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] no-scrollbar">
              {notifications.length > 0 ? notifications.map(n => (<div key={n.id} className="p-3 rounded-lg bg-gray-50 dark:bg-prospera-darkest/50 border-l-2 border-prospera-accent group hover:bg-prospera-accent/5 transition-colors"><p className="text-[7px] font-black dark:text-white text-gray-900 uppercase tracking-widest mb-0.5">{n.title}</p><p className="text-[9px] text-prospera-gray line-clamp-2 leading-tight">{n.message}</p></div>)) : <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-10"><Terminal className="w-8 h-8 text-prospera-gray mb-2" /><p className="text-[7px] font-black uppercase tracking-widest">Feed Null</p></div>}
            </div>
          </div>
        )}
      </div>

      {dashboardConfig.showRecentTransactions && (
        <div className="p-5 rounded-xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl">
          <h2 className="text-[10px] font-black dark:text-white text-gray-900 mb-4 tracking-widest uppercase">Validated Ledger Entries</h2>
          <TransactionTable transactions={transactions.filter(t => t.status === 'APPROVED').slice(0, 5)} showActions={false} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
