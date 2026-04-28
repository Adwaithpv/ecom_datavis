import { Package, Clock, RefreshCcw, AlertTriangle } from 'lucide-react';
import { KPICard } from './components/ui/KPICard';
import { Sidebar } from './components/Sidebar';
import { Topbar, PageHeader } from './components/Topbar';
import { InsightsSection } from './components/InsightsSection';
import { TableauEmbed } from './components/TableauEmbed';
import {
  MonthlyOrdersChart, PlatformBreakdown,
  CategoryDelayTable, OrderHourChart, RefundDelayChart,
  DeliveryTimeChart, OrderValueChart, ServiceRatingChart
} from './components/charts/DashboardCharts';

function App() {
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />

      <div className="main-content flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <PageHeader
            title="Delivery Analytics Dashboard"
            subtitle="100,000 orders · Blinkit, JioMart & Swiggy Instamart · Binary classification for delivery delays"
          />

          {/* KPI Cards — aligned to CSV columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <KPICard
              title="Total Orders"
              value="1,00,000"
              icon={Package}
              trend="Full Dataset"
              trendDir="neutral"
              subtitle="All 3 platforms combined"
              iconBg="bg-violet-50"
              iconColor="text-violet-600"
            />
            <KPICard
              title="Delivery Delay Rate"
              value="13.7%"
              icon={AlertTriangle}
              trend="↑ 13,700 orders"
              trendDir="up"
              subtitle="Target variable (Yes/No)"
              iconBg="bg-red-50"
              iconColor="text-red-500"
            />
            <KPICard
              title="Refund Requested"
              value="45.8%"
              icon={RefreshCcw}
              trend="No delay link"
              trendDir="neutral"
              subtitle="Independent of delay status"
              iconBg="bg-orange-50"
              iconColor="text-orange-500"
            />
            <KPICard
              title="Avg Delivery Time"
              value="31.4 min"
              icon={Clock}
              trend="↑ Longer if delayed"
              trendDir="up"
              subtitle="Post-outcome signal only"
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
            />
          </div>

          <div className="mb-5 flex flex-col gap-5">
            <TableauEmbed
              viewPath="EcommerceDeliveryDashboard/Dashboard1"
              title="Tableau: Ecommerce Delivery Dashboard"
            />
            <TableauEmbed
              viewPath="DeliveryPerformance_17773564982410/Dashboard1"
              title="Tableau: Delivery Performance"
              blurb="Delivery performance workbook (Dashboard 1) from Tableau Public."
            />
          </div>

          {/* Row 1: Monthly stacked chart + Platform breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <MonthlyOrdersChart />
            </div>
            <PlatformBreakdown />
          </div>

          {/* Row 2: Category table + Order Hour line chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <CategoryDelayTable />
            </div>
            <OrderHourChart />
          </div>

          {/* Row 3: Refund chart + Delivery time (minutes) + Order value (INR) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <RefundDelayChart />
            <DeliveryTimeChart />
            <OrderValueChart />
          </div>

          {/* Row 4: Service Rating — CSV column "Service Rating" (1–5) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <ServiceRatingChart />
            {/* Spacer cards for alignment */}
            <div className="lg:col-span-2 card flex items-center justify-center text-center p-8">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Customer Feedback Column</p>
                <p className="text-sm text-gray-500 max-w-sm">The dataset includes free-text <em>Customer Feedback</em> field (sentiment). Sentiment analysis was not performed — it is a future enrichment opportunity.</p>
              </div>
            </div>
          </div>

          {/* ML Insights + Conclusion */}
          <InsightsSection />
        </main>
      </div>
    </div>
  );
}

export default App;
