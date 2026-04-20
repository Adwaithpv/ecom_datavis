import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  monthlySummaryData, categoryData, orderHourData,
  orderValueBuckets, deliveryTimeDistribution, serviceRatingData
} from '../../data/mockData';
import { MoreHorizontal } from 'lucide-react';

const VIOLET = '#7c3aed';
const VIOLET_LIGHT = '#c4b5fd';
const ORANGE = '#f97316';

const tooltipStyle = {
  contentStyle: {
    background: 'white',
    border: '1px solid #f1f5f9',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    fontSize: '12px',
    padding: '10px 14px',
  },
  labelStyle: { color: '#374151', fontWeight: 600 as const },
  itemStyle: { color: '#6b7280' },
};

// Monthly stacked bar: on-time vs delayed orders
export function MonthlyOrdersChart() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="section-header">Order Delivery Status</h3>
          <div className="flex items-center gap-4 mt-1.5">
            <div>
              <span className="text-[10px] text-gray-400">On Time</span>
              <p className="text-sm font-bold text-gray-800">86,300 <span className="text-[10px] font-normal text-green-500">86.3%</span></p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400">Delayed</span>
              <p className="text-sm font-bold text-gray-800">13,700 <span className="text-[10px] font-normal text-red-500">13.7%</span></p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />On Time</span>
          <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Delayed</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={monthlySummaryData} barSize={22} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="onTime" name="On Time" stackId="a" fill={VIOLET} radius={[0, 0, 0, 0]} />
          <Bar dataKey="delayed" name="Delayed" stackId="a" fill={ORANGE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Platform breakdown — 3 actual platforms from the CSV
export function PlatformBreakdown() {
  const platforms = [
    { name: 'Blinkit', percent: 35, delayRate: 14.0, color: '#FFCC00' },
    { name: 'JioMart', percent: 33, delayRate: 13.5, color: '#0066CC' },
    { name: 'Swiggy Instamart', percent: 32, delayRate: 13.6, color: '#FF6B35' },
  ];

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header">Platform Share</h3>
        <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
      </div>

      <div className="flex items-center gap-3 text-[11px] text-gray-500 flex-wrap">
        {platforms.map(p => (
          <span key={p.name} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
            {p.name}
          </span>
        ))}
      </div>

      {/* Segmented bar */}
      <div className="flex rounded-full overflow-hidden h-2">
        {platforms.map(p => (
          <div key={p.name} style={{ width: `${p.percent}%`, backgroundColor: p.color }} />
        ))}
      </div>

      {/* Stats row */}
      <div className="flex justify-between mt-1">
        {platforms.map(p => (
          <div key={p.name} className="text-center">
            <p className="text-sm font-bold text-gray-800">{p.percent}%</p>
            <p className="text-[10px] text-gray-400 leading-snug">{p.name}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="mt-1">
        <div className="grid grid-cols-3 text-[10px] text-gray-400 font-medium pb-1 border-b border-gray-100">
          <span>Platform</span><span className="text-center">Share</span><span className="text-right">Delay Rate</span>
        </div>
        {platforms.map(p => (
          <div key={p.name} className="grid grid-cols-3 py-2 text-xs border-b border-gray-50 items-center">
            <span className="flex items-center gap-1.5 text-gray-700 font-medium">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
            <span className="text-center text-gray-500">{p.percent}%</span>
            <span className="text-right font-medium text-gray-700">{p.delayRate}%</span>
          </div>
        ))}
        <p className="text-[10px] text-gray-400 italic mt-2">Differences are NOT statistically significant (p &gt; 0.05)</p>
      </div>
    </div>
  );
}

// Category delay table — 6 real categories from the CSV
export function CategoryDelayTable() {
  const [tab, setTab] = useState('All');
  const tabs = ['All', 'Delayed', 'On Time'];

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header">Delay Rate by Product Category</h3>
        <input
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 outline-none focus:border-violet-400 text-gray-600 bg-gray-50 w-32"
          placeholder="🔍 Search..."
        />
      </div>
      <div className="flex gap-4 border-b border-gray-100">
        {tabs.map(t => (
          <button key={t} className={`tab-btn ${t === tab ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div>
        <div className="grid grid-cols-3 text-[10px] uppercase tracking-wide text-gray-400 font-semibold py-1">
          <span>Category</span><span className="text-center">Volume</span><span className="text-right">Delay Rate</span>
        </div>
        {categoryData.map(c => (
          <div key={c.name} className="grid grid-cols-3 py-2.5 border-b border-gray-50 items-center">
            <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              {c.name}
            </span>
            <span className="text-xs text-gray-500 text-center">{c.volume.toLocaleString()}</span>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-orange-400" style={{ width: `${(c.delayRate / 20) * 100}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-800 w-9 text-right">{c.delayRate}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Order hour — flat pattern confirms time-of-day is not predictive
export function OrderHourChart() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header">Delay Rate by Order Hour</h3>
        <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">Flat — Not Predictive</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={orderHourData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[10, 18]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Line type="monotone" dataKey="delayRate" stroke={VIOLET} strokeWidth={2} dot={{ fill: VIOLET, r: 3 }} name="Delay Rate %" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-gray-400 italic">Delays are uniformly distributed across all order hours — no time-based pattern detected.</p>
    </div>
  );
}

// Refund vs delay — nearly identical rates prove no association
export function RefundDelayChart() {
  const data = [
    { name: 'Delayed Orders', refundRate: 46.2, noRefund: 53.8 },
    { name: 'On-Time Orders', refundRate: 45.5, noRefund: 54.5 },
  ];
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header">Refund Rate by Delay Status</h3>
        <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={95} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="refundRate" name="Refunded" fill="#f97316" radius={[0, 0, 0, 0]} stackId="a" />
          <Bar dataKey="noRefund" name="No Refund" fill="#ede9fe" radius={[0, 4, 4, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-gray-400 italic">Refund rate is virtually identical — no statistically significant link with delivery delay.</p>
    </div>
  );
}

// Delivery time in MINUTES (from CSV: "Delivery Time (Minutes)")
export function DeliveryTimeChart() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header">Delivery Time Distribution</h3>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />On Time</span>
          <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Delayed</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={deliveryTimeDistribution} barGap={2} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="bucket" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="normal" name="On Time" fill={VIOLET} stackId="a" />
          <Bar dataKey="delayed" name="Delayed" fill="#ef4444" stackId="a" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-gray-400">Time in minutes. Delayed orders cluster at 36–60 min (post-outcome signal, not predictive pre-order).</p>
    </div>
  );
}

// Order value in INR — from CSV "Order Value (INR)"
export function OrderValueChart() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header">Delay Rate by Order Value (INR)</h3>
        <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">Not Predictive</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={orderValueBuckets} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="bucket" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 20]} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="delayRate" name="Delay Rate %" radius={[4, 4, 0, 0]}>
            {orderValueBuckets.map((_, i) => (
              <Cell key={`cell-${i}`} fill={i % 2 === 0 ? VIOLET : VIOLET_LIGHT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Service Rating distribution (1–5 stars) — from CSV "Service Rating"
export function ServiceRatingChart() {
  const ratingColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="section-header">Service Rating Distribution</h3>
        <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">Avg: 3.8 ★</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={serviceRatingData} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="rating" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="count" name="Orders" radius={[4, 4, 0, 0]}>
            {serviceRatingData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={ratingColors[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-gray-400">Most customers rate 4–5 stars, suggesting delays don't drastically impact satisfaction in this dataset.</p>
    </div>
  );
}
