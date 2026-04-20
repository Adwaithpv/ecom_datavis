import { 
  LayoutDashboard, BarChart2, Clock, Star,
  ShoppingBag, Settings, LogOut, Zap
} from 'lucide-react';

// Navigation items strictly derived from the dataset's analytical dimensions
const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: BarChart2, label: 'Delay Analysis' },
  { icon: ShoppingBag, label: 'Refund Trends' },
  { icon: Clock, label: 'Delivery Time' },
  { icon: Star, label: 'Service Rating' },
  { icon: Settings, label: 'Settings' },
];

// The 3 actual platforms from the dataset
const platforms = [
  { label: 'Blinkit', color: '#FFCC00' },
  { label: 'JioMart', color: '#0066CC' },
  { label: 'Swiggy Instamart', color: '#FF6B35' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 mb-6">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
          <BarChart2 className="text-white" size={18} />
        </div>
        <span className="font-bold text-gray-900 text-base tracking-tight">DeliverIQ</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2">
        {navItems.map(({ icon: Icon, label, active }) => (
          <div key={label} className={`sidebar-nav-item ${active ? 'active' : ''}`}>
            <Icon size={16} />
            <span>{label}</span>
          </div>
        ))}
      </nav>

      {/* Platforms — actual dataset values */}
      <div className="px-4 mt-4">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2 pl-1">Platforms</p>
        {platforms.map(({ label, color }) => (
          <div key={label} className="sidebar-nav-item">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[13px]">{label}</span>
          </div>
        ))}
      </div>

      {/* CTA explaining the missing data angle */}
      <div className="mx-3 mt-4 bg-violet-50 rounded-xl p-3 text-center">
        <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-2">
          <Zap size={14} className="text-violet-600" />
        </div>
        <p className="text-xs text-gray-500 leading-snug mb-2">
          Operational data (distance, traffic) missing — key for delay prediction
        </p>
        <button className="w-full text-xs font-semibold py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors">
          Enrich Dataset
        </button>
      </div>

      {/* Logout */}
      <div className="sidebar-nav-item mt-3 mx-2">
        <LogOut size={15} />
        <span className="text-sm">Logout</span>
      </div>
    </aside>
  );
}
