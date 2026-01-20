
import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, DollarSign, PieChart as PieIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../context/AppContext.tsx';

const AnalyticsPage: React.FC = () => {
  const { transactions, users, preferences } = useAppContext();

  const currentYear = new Date().getFullYear();

  const contributionByMonth = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map(month => ({ name: month, amount: 0 }));

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      if (date.getFullYear() === currentYear && tx.status === 'APPROVED') {
        result[date.getMonth()].amount += tx.amount;
      }
    });

    return result.filter((_, i) => i <= new Date().getMonth());
  }, [transactions, currentYear]);

  const userDistribution = useMemo(() => {
    return users.map(u => ({
      name: u.name,
      value: u.totalContributed
    })).filter(v => v.value > 0);
  }, [users]);

  const COLORS = ['#01C38D', '#4FD1C5', '#319795', '#2C7A7B', '#234E52', '#065666'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">Group Analytics</h1>
          <p className="text-prospera-gray">Live visualization of group wealth and contribution patterns.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-prospera-accent/10 border border-prospera-accent/20 rounded-xl text-prospera-accent text-sm font-bold">
          <Calendar className="w-4 h-4" />
          FY {currentYear} Performance
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-prospera-accent/10 rounded-xl">
            <DollarSign className="w-6 h-6 text-prospera-accent" />
          </div>
          <div>
            <p className="text-[10px] text-prospera-gray uppercase font-black">Average Contribution</p>
            <p className="text-xl font-bold dark:text-white text-gray-900">KES {(users.length > 0 ? users.reduce((a, b) => a + b.totalContributed, 0) / users.length : 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="p-6 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-prospera-gray uppercase font-black">Member Participation</p>
            <p className="text-xl font-bold dark:text-white text-gray-900">100% Active</p>
          </div>
        </div>
        <div className="p-6 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-yellow-500/10 rounded-xl">
            <ArrowUpRight className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-[10px] text-prospera-gray uppercase font-black">Group Velocity</p>
            <p className="text-xl font-bold dark:text-white text-gray-900">Strong</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white text-gray-900">
            <TrendingUp className="text-prospera-accent w-5 h-5" />
            Cash Flow Velocity
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contributionByMonth}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#01C38D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#01C38D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={preferences.theme === 'dark' ? "#2D3748" : "#E2E8F0"} vertical={false} />
                <XAxis dataKey="name" stroke="#696E79" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#696E79" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: preferences.theme === 'dark' ? '#132D46' : '#FFFFFF', borderColor: preferences.theme === 'dark' ? 'transparent' : '#E2E8F0', borderRadius: '12px', color: preferences.theme === 'dark' ? '#fff' : '#1A202C' }}
                  itemStyle={{ color: '#01C38D' }}
                  formatter={(value: any) => `KES ${value.toLocaleString()}`}
                />
                <Area type="monotone" dataKey="amount" stroke="#01C38D" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white text-gray-900">
            <PieIcon className="text-prospera-accent w-5 h-5" />
            Contribution Share
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: preferences.theme === 'dark' ? '#132D46' : '#FFFFFF', borderColor: preferences.theme === 'dark' ? 'transparent' : '#E2E8F0', borderRadius: '12px', color: preferences.theme === 'dark' ? '#fff' : '#1A202C' }}
                  formatter={(value: any) => `KES ${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
