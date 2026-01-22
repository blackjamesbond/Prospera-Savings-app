
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
    <div className={`group p-5 rounded-2xl bg-white dark:bg-prospera-dark border border-gray-100 dark:border-white/5 shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-prospera-accent/5 relative overflow-hidden ${className}`}>
      {/* Background Accent Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-prospera-accent/5 rounded-full blur-3xl group-hover:bg-prospera-accent/10 transition-all duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-0.5">
          <p className="text-[9px] text-prospera-gray font-black uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-xl font-black tracking-tight dark:text-white text-gray-900">{value}</h3>
          
          {subtitle && (
            <p className="text-[9px] font-bold text-prospera-gray uppercase tracking-widest pt-0.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-prospera-accent/40" />
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className={`flex items-center gap-1.5 mt-2 px-1.5 py-0.5 w-fit rounded-full text-[8px] font-black tracking-widest uppercase ${trend.isUp ? 'bg-prospera-accent/10 text-prospera-accent' : 'bg-red-500/10 text-red-400'}`}>
              <span>{trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="opacity-40">VOL</span>
            </div>
          )}
        </div>
        
        <div className="p-2.5 bg-gray-50 dark:bg-prospera-darkest/50 border border-gray-100 dark:border-white/5 rounded-xl text-prospera-accent shadow-inner group-hover:bg-prospera-accent group-hover:text-white transition-all duration-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
