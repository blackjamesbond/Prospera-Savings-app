
import React from 'react';
import { Target, ArrowLeftRight, Bell, Trophy, Zap, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';
import DashboardCard from '../components/DashboardCard.tsx';
import TransactionTable from '../components/TransactionTable.tsx';

const UserDashboard: React.FC = () => {
  const { transactions, users, target, notifications, currentUser } = useAppContext();
  
  // Guard against null currentUser during session initialization
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-prospera-gray font-black uppercase tracking-widest">
          Initializing Vault Session...
        </div>
      </div>
    );
  }

  const myTransactions = transactions.filter(t => t.userId === currentUser.id);
  const myApproved = myTransactions.filter(t => t.status === 'APPROVED');
  
  const progress = (target.targetAmount > 0) ? (target.currentAmount / target.targetAmount) * 100 : 0;
  const remainingToTarget = Math.max(0, target.targetAmount - target.currentAmount);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-prospera-accent/10 border border-prospera-accent/20 rounded-2xl p-6 flex items-center gap-6 overflow-hidden relative">
        <div className="flex-1 relative z-10">
          <h2 className="text-2xl font-bold mb-2 dark:text-white text-gray-900">Welcome Back, {currentUser.name}!</h2>
          <p className="text-prospera-gray max-w-md">
            You've contributed <span className="text-prospera-accent font-bold">KES {currentUser.totalContributed.toLocaleString()}</span> so far. You are ranked <span className="text-prospera-accent font-bold">#{currentUser.rank}</span> in the group.
          </p>
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-prospera-accent text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Explore Analytics
            </button>
            <button className="px-6 py-2 bg-white/10 dark:bg-white/10 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-gray-200 dark:border-transparent">
              Invite Friends
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <Trophy className="w-32 h-32 text-prospera-accent/30 absolute -right-4 -bottom-4 rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="My Contributions" 
          value={`KES ${currentUser.totalContributed.toLocaleString()}`}
          subtitle="All time"
          icon={TrendingUp}
        />
        <DashboardCard 
          title="Group Progress" 
          value={`${Math.round(progress)}%`}
          subtitle={`Remaining: KES ${remainingToTarget.toLocaleString()}`}
          icon={Target}
        />
        <DashboardCard 
          title="Recent Alerts" 
          value={notifications.filter(n => !n.read).length}
          icon={Bell}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white text-gray-900">Savings Goal Progress</h2>
            <Zap className="text-prospera-accent w-5 h-5" />
          </div>
          <p className="text-sm text-prospera-gray mb-4">{target.title}: {target.motive}</p>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-prospera-accent bg-prospera-accent/10">
                  Target Status
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-prospera-accent">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-50 dark:bg-prospera-darkest border border-gray-100 dark:border-white/5">
              <div 
                style={{ width: `${Math.min(progress, 100)}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-prospera-accent transition-all duration-1000 ease-out"
              ></div>
            </div>
            <p className="text-xs text-prospera-gray text-center">We need KES {remainingToTarget.toLocaleString()} more to reach our holiday goal!</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-lg">
          <h2 className="text-xl font-bold mb-6 dark:text-white text-gray-900">Latest Updates</h2>
          <div className="space-y-4">
            {notifications.slice(0, 3).map(n => (
              <div key={n.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-prospera-darkest/50 border border-gray-100 dark:border-white/5 transition-colors hover:bg-white dark:hover:bg-prospera-darkest">
                <div className={`p-2 rounded-lg h-fit ${
                  n.type === 'success' ? 'bg-prospera-accent/20 text-prospera-accent' : 
                  n.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold dark:text-white text-gray-900">{n.title}</h4>
                  <p className="text-xs text-prospera-gray mt-1">{n.message}</p>
                  <p className="text-[10px] text-prospera-gray mt-2">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-lg">
        <h2 className="text-xl font-bold mb-6 dark:text-white text-gray-900">My Recent Contributions</h2>
        <TransactionTable transactions={myApproved.slice(0, 5)} showActions={false} />
      </div>
    </div>
  );
};

export default UserDashboard;
