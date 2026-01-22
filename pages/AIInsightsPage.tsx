
import React, { useMemo } from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, Target, BarChart4, ChevronRight, CheckCircle2, Info, ArrowUpRight, Zap, CheckCircle, Calculator, Rocket, Lightbulb, ShieldAlert, TrendingDown, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext.tsx';

const AIInsightsPage: React.FC = () => {
  const { transactions, users, target, preferences } = useAppContext();

  // LOCAL DETERMINISTIC ANALYSIS & RECOMMENDATION ENGINE
  const localAnalytics = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'APPROVED');
    const totalSaved = approved.reduce((acc, t) => acc + t.amount, 0);
    const required = Math.max(0, target.targetAmount - totalSaved);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentApproved = approved.filter(t => new Date(t.date) >= thirtyDaysAgo);
    const monthlyVelocity = recentApproved.reduce((acc, t) => acc + t.amount, 0);
    const dailyVelocity = monthlyVelocity / 30;
    
    const daysToGoal = dailyVelocity > 0 ? required / dailyVelocity : Infinity;
    const deadlineDate = new Date(target.deadline);
    const daysUntilDeadline = (deadlineDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    
    const avg = approved.length > 0 ? totalSaved / approved.length : 0;
    const variance = approved.reduce((acc, t) => acc + Math.pow(t.amount - avg, 2), 0) / (approved.length || 1);
    const consistencyScore = Math.max(0, 100 - (Math.sqrt(variance) / (avg || 1)) * 10);

    const recommendations: { title: string, desc: string, type: 'success' | 'warning' | 'info' | 'danger', icon: any }[] = [];

    if (required > 0) {
      if (daysToGoal > daysUntilDeadline || dailyVelocity === 0) {
        const reqDaily = required / (daysUntilDeadline > 0 ? daysUntilDeadline : 1);
        recommendations.push({
          title: "Acceleration Strategy",
          desc: `Current speed is too low. To hit the ${target.deadline} deadline, the group needs to save ${preferences.currency} ${Math.round(reqDaily).toLocaleString()} daily.`,
          type: 'danger',
          icon: TrendingDown
        });
      } else {
        recommendations.push({
          title: "Momentum Maintained",
          desc: "You are currently pacing ahead of your deadline. Maintain this flow to reach the target comfortably.",
          type: 'success',
          icon: TrendingUp
        });
      }
    }

    if (consistencyScore < 60) {
      recommendations.push({
        title: "Stability Protocol",
        desc: "Contribution patterns are irregular. Recommend setting a 'Group Sync Day' (e.g., every 1st of the month) to stabilize cash flow.",
        type: 'warning',
        icon: ShieldAlert
      });
    } else {
      recommendations.push({
        title: "Discipline Shield",
        desc: "High behavioral consistency detected. This level of predictability significantly lowers group financial risk.",
        type: 'success',
        icon: CheckCircle2
      });
    }

    const memberAverage = totalSaved / (users.length || 1);
    const lowContributors = users.filter(u => u.totalContributed < memberAverage * 0.5);
    if (lowContributors.length > 0) {
      recommendations.push({
        title: "Equity Adjustment",
        desc: `${lowContributors.length} members are contributing significantly less than the group average. Consider a morale-boosting check-in.`,
        type: 'info',
        icon: Users
      });
    }

    return {
      totalSaved,
      required,
      monthlyVelocity,
      dailyVelocity,
      daysToGoal,
      daysUntilDeadline,
      consistencyScore: Math.min(100, Math.round(consistencyScore)),
      recommendations
    };
  }, [transactions, target, users, preferences.currency]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black dark:text-white text-gray-900 tracking-tight">Algorithmic Insights</h1>
          <p className="text-prospera-gray mt-2 font-medium text-lg">Real-time local logic and deterministic modeling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="p-10 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
            <Calculator className="w-20 h-20 text-prospera-accent" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray mb-10">Stability Index</h3>
          <div className="space-y-2">
            <p className="text-5xl font-black dark:text-white text-gray-900 tracking-tighter">{localAnalytics.consistencyScore}<span className="text-prospera-accent">%</span></p>
            <p className="text-sm font-bold text-prospera-gray">Heuristic Consistency Score</p>
          </div>
        </div>

        <div className="p-10 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-20 h-20 text-blue-500" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray mb-10">Capital Velocity</h3>
          <div className="space-y-2">
            <p className="text-5xl font-black dark:text-white text-gray-900 tracking-tighter">
              {Math.round(localAnalytics.dailyVelocity).toLocaleString()}
            </p>
            <p className="text-sm font-bold text-prospera-gray">{preferences.currency} / Daily Average</p>
          </div>
        </div>

        <div className="p-10 dark:bg-prospera-dark bg-white border dark:border-white/5 border-gray-100 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:-translate-y-2 transition-transform">
            <Rocket className="w-20 h-20 text-yellow-500" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-prospera-gray mb-10">Maturity Projection</h3>
          <div className="space-y-2">
            <p className="text-5xl font-black dark:text-white text-gray-900 tracking-tighter">
              {localAnalytics.daysToGoal === Infinity ? '∞' : Math.round(localAnalytics.daysToGoal)}
            </p>
            <p className="text-sm font-bold text-prospera-gray">Days to Completion</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-widest text-prospera-gray flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-prospera-accent" />
          Deterministic System Directives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localAnalytics.recommendations.map((rec, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] shadow-xl ${
              rec.type === 'success' ? 'bg-prospera-accent/5 border-prospera-accent/20' :
              rec.type === 'danger' ? 'bg-red-500/5 border-red-500/20' :
              rec.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-blue-500/5 border-blue-500/20'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  rec.type === 'success' ? 'bg-prospera-accent text-white' :
                  rec.type === 'danger' ? 'bg-red-500 text-white' :
                  rec.type === 'warning' ? 'bg-yellow-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  <rec.icon className="w-5 h-5" />
                </div>
                <h4 className="font-black text-sm dark:text-white text-gray-900">{rec.title}</h4>
              </div>
              <p className="text-xs font-medium dark:text-gray-300 text-gray-600 leading-relaxed">
                {rec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;
