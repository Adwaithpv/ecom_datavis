import { Search, Bell, Calendar, Download } from 'lucide-react';

export function Topbar() {
  return (
    <div className="topbar">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-1.5 text-sm bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-violet-400 w-52 text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AD
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-tight">Adwaith Pv</p>
            <p className="text-[10px] text-gray-400">Data Analyst</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 text-xs font-medium text-gray-600 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <Calendar size={13} />
          100k Orders · Full Dataset
        </button>
        <button className="flex items-center gap-2 text-xs font-semibold text-white bg-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
          <Download size={13} />
          Export Data
        </button>
      </div>
    </div>
  );
}
