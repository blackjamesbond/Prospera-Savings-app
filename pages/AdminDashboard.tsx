
import React, { useMemo } from 'react';
import { Target, ArrowLeftRight, Users, Bell, DollarSign, TrendingUp, Activity, Terminal, ShieldPlus } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="relative p-6 bg-prospera-accent/5 border border-prospera-accent/10 rounded-[2.5rem] overflow-hidden terminal-grid">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Activity className="w-32 h-32 text-prospera-accent animate-pulse" /></div>
         <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
               <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-prospera-accent animate-ping" /><h2 className="text-2xl font-black dark:text-white text-gray-900">Admin Panel</h2></div>
               <p className="text-prospera-gray font-black uppercase tracking-[0.4em] text-[8px]">Group Status Overview</p>
            </div>
            <div className="flex gap-3">
               <div className="px-4 py-2 bg-white dark:bg-prospera-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-xl text-center"><p className="text-[8px] text-prospera-gray font-black uppercase mb-0.5">Status</p><p className="text-base font-black text-prospera-accent">Online</p></div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Saved" value={`${preferences.currency} ${totalSaved.toLocaleString()}`} icon={DollarSign} subtitle="Verified Money" />
        {dashboardConfig.showTarget && <DashboardCard title="Goal Progress" value={`${Math.round(progress)}%`} subtitle={target.title} icon={Target} />}
        <DashboardCard title="Group Members" value={users.filter(u => u.status === UserStatus.ACTIVE).length} icon={Users} subtitle="Verified People" />
        <DashboardCard title="New Requests" value={pendingMembers} icon={ShieldPlus} subtitle="Waiting to Join" className={pendingMembers > 0 ? 'border-prospera-accent animate-pulse' : ''} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dashboardConfig.showAnalytics && (
          <div className="lg:col-span-2 p-6 rounded-[2rem] bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-2xl">
            <h2 className="text-lg font-black tracking-tight dark:text-white text-gray-900 mb-6">Savings by Member</h2>
            <div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={contributionData}><CartesianGrid strokeDasharray="3 3" stroke={preferences.theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} /><XAxis dataKey="name" stroke="#696E79" fontSize={9} tickLine={false} axisLine={false} fontWeight="bold" dy={10} /><YAxis stroke="#696E79" fontSize={9} tickLine={false} axisLine={false} fontWeight="bold" /><Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#191E29', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#01C38D', fontWeight: '900' }} /><Bar dataKey="amount" fill="var(--prospera-accent)" radius={[6, 6, 0, 0]} barSize={24} /></BarChart></ResponsiveContainer></div>
          </div>
        )}
        
        {dashboardConfig.showLogs && (
          <div className={`${dashboardConfig.showAnalytics ? 'lg:col-span-1' : 'lg:col-span-3'} p-6 rounded-[2rem] bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col`}>
            <h2 className="text-base font-black mb-4 flex items-center dark:text-white text-gray-900 uppercase tracking-widest"><Bell className="w-4 h-4 mr-2 text-prospera-accent" /> Recent Activity</h2>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] no-scrollbar">
              {notifications.length > 0 ? notifications.map(n => (<div key={n.id} className="p-3 rounded-xl bg-gray-50 dark:bg-prospera-darkest/50 border-l-4 border-prospera-accent group hover:bg-prospera-accent/5"><p className="text-[9px] font-black dark:text-white text-gray-900 uppercase mb-0.5">{n.title}</p><p className="text-[10px] text-prospera-gray line-clamp-2 leading-tight">{n.message}</p></div>)) : <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-10"><Terminal className="w-10 h-10 text-prospera-gray mb-2" /><p className="text-[8px] font-black uppercase tracking-widest">No news yet</p></div>}
            </div>
          </div>
        )}
      </div>

      {dashboardConfig.showRecentTransactions && (
        <div className="p-6 rounded-[2rem] bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-2xl">
          <h2 className="text-lg font-black dark:text-white text-gray-900 mb-4 tracking-tight">Confirmed Deposits</h2>
          <TransactionTable transactions={transactions.filter(t => t.status === 'APPROVED').slice(0, 5)} showActions={false} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
