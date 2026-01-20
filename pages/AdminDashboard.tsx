
import React from 'react';
import { Target, ArrowLeftRight, Users, Bell, DollarSign, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useAppContext } from '../context/AppContext.tsx';
import DashboardCard from '../components/DashboardCard.tsx';
import TransactionTable from '../components/TransactionTable.tsx';

const AdminDashboard: React.FC = () => {
  const { transactions, users, target, notifications, preferences } = useAppContext();

  const contributionData = users.map(u => ({
    name: u.name,
    amount: u.totalContributed
  })).sort((a, b) => b.amount - a.amount).slice(0, 5);

  const COLORS = ['#01C38D', '#132D46', '#696E79', '#4FD1C5', '#319795'];

  const recentApproved = transactions
    .filter(t => t.status === 'APPROVED')
    .slice(0, 5);

  // Safety against division by zero
  const progress = target.targetAmount > 0 ? (target.currentAmount / target.targetAmount) * 100 : 0;
  const targetStatus = progress >= 100 ? 'MET' : progress >= 80 ? 'ALMOST MET' : 'INITIALIZING';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Group Funds" 
          value={`${preferences.currency} ${users.reduce((acc, u) => acc + u.totalContributed, 0).toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 0, isUp: true }}
        />
        <DashboardCard 
          title="Savings Target" 
          value={`${Math.round(progress)}%`}
          subtitle={target.title}
          icon={Target}
        />
        <DashboardCard 
          title="Active Users" 
          value={users.length}
          icon={Users}
        />
        <DashboardCard 
          title="Pending Approvals" 
          value={transactions.filter(t => t.status === 'PENDING').length}
          icon={ArrowLeftRight}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Savings Target Overview */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-white text-gray-900">Savings Target Overview</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              targetStatus === 'MET' ? 'bg-prospera-accent/20 text-prospera-accent' : 
              targetStatus === 'ALMOST MET' ? 'bg-yellow-500/20 text-yellow-500' : 
              'bg-gray-500/20 text-gray-500'
            }`}>
              {targetStatus}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-prospera-gray">Current Contribution</span>
              <span className="font-semibold text-prospera-accent">{preferences.currency} {target.currentAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-50 dark:bg-prospera-darkest rounded-full h-4 overflow-hidden border border-gray-100 dark:border-white/5">
              <div 
                className="bg-prospera-accent h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(1,195,141,0.5)]" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-prospera-gray">Target: {preferences.currency} {target.targetAmount.toLocaleString()}</span>
              <span className="text-prospera-gray">Ends: {target.deadline}</span>
            </div>
          </div>

          <div className="mt-8 h-[300px]">
            {contributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={preferences.theme === 'dark' ? "#2D3748" : "#e5e7eb"} vertical={false} />
                  <XAxis dataKey="name" stroke="#696E79" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#696E79" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#132D46', borderColor: 'transparent', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#01C38D' }}
                  />
                  <Bar dataKey="amount" fill="#01C38D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                <p className="text-prospera-gray text-sm">No contribution data to visualize yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="p-6 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center dark:text-white text-gray-900">
            <Bell className="w-5 h-5 mr-2 text-prospera-accent" />
            Notifications
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[480px] pr-2 no-scrollbar">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div key={n.id} className="p-4 rounded-xl bg-gray-50 dark:bg-prospera-darkest/50 border-l-4 border-prospera-accent">
                  <p className="text-sm font-bold dark:text-white text-gray-900">{n.title}</p>
                  <p className="text-xs text-prospera-gray mt-1">{n.message}</p>
                  <p className="text-[10px] text-prospera-gray mt-2 uppercase">{n.date}</p>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                <Bell className="w-12 h-12 text-prospera-gray mb-2" />
                <p className="text-xs text-prospera-gray font-bold uppercase">All quiet in the vault</p>
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-3 rounded-xl bg-prospera-accent/10 text-prospera-accent font-semibold hover:bg-prospera-accent/20 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-lg">
        <h2 className="text-xl font-bold mb-6 dark:text-white text-gray-900">Recent Approved Transactions</h2>
        <TransactionTable transactions={recentApproved} showActions={false} />
      </div>
    </div>
  );
};

export default AdminDashboard;
