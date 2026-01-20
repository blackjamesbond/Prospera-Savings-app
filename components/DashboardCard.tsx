
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, subtitle, icon: Icon, trend, className = "" }) => {
  return (
    <div className={`group p-8 rounded-[2rem] bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-prospera-accent/5 relative overflow-hidden ${className}`}>
      {/* Background Accent Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-prospera-accent/5 rounded-full blur-3xl group-hover:bg-prospera-accent/10 transition-all duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] text-prospera-gray font-black uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-3xl font-black tracking-tight dark:text-white text-gray-900">{value}</h3>
          
          {subtitle && (
            <p className="text-[10px] font-bold text-prospera-gray uppercase tracking-widest pt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-prospera-accent/40" />
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className={`flex items-center gap-1.5 mt-4 px-2 py-0.5 w-fit rounded-full text-[10px] font-black tracking-widest uppercase ${trend.isUp ? 'bg-prospera-accent/10 text-prospera-accent' : 'bg-red-500/10 text-red-400'}`}>
              <span>{trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="opacity-40">VOL</span>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-prospera-darkest/50 border border-gray-100 dark:border-white/5 rounded-2xl text-prospera-accent shadow-inner group-hover:bg-prospera-accent group-hover:text-white transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
