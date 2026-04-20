import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDir?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  iconColor?: string;
  iconBg?: string;
}

export function KPICard({ title, value, icon: Icon, trend, trendDir = 'neutral', subtitle, iconColor = 'text-violet-600', iconBg = 'bg-violet-50' }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <span className={trendDir === 'up' ? 'badge-up' : trendDir === 'down' ? 'badge-down' : 'badge-neutral'}>
              {trendDir === 'up' ? <TrendingUp size={10} /> : trendDir === 'down' ? <TrendingDown size={10} /> : null}
              {trend}
            </span>
          )}
        </div>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      {subtitle && (
        <p className="text-[11px] text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
