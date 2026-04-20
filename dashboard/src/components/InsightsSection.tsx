import { AlertTriangle, TrendingUp, Database, Cpu } from 'lucide-react';

const modelMetrics = [
  { label: 'Logistic Regression Accuracy', value: '50%', color: 'text-red-500', bg: 'bg-red-50', bar: '#ef4444', pct: 50 },
  { label: 'Random Forest Accuracy', value: '60%', color: 'text-orange-500', bg: 'bg-orange-50', bar: '#f97316', pct: 60 },
  { label: 'ROC-AUC Score', value: '0.5', color: 'text-red-500', bg: 'bg-red-50', bar: '#ef4444', pct: 50 },
];

const insights = [
  { color: '#7c3aed', text: 'Delivery delays are NOT strongly driven by platform, product category, or order value. The ~13.7% delay rate is nearly uniform across all features.' },
  { color: '#7c3aed', text: 'Refund behavior is largely independent of delivery delays — showing the same ~46% rate whether or not an order was delayed.' },
  { color: '#f97316', text: 'Operational variables (distance, traffic, logistics hub, carrier) are missing and are likely the primary drivers of delivery delays.' },
  { color: '#f97316', text: 'Predictive modeling is ineffective with only pre-order data. A baseline ROC-AUC of 0.5 equals random guessing.' },
];

export function InsightsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
      
      {/* ML Model Panel */}
      <div className="card lg:col-span-2 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
            <Cpu size={14} className="text-violet-600" />
          </div>
          <h3 className="section-header">ML Model Performance</h3>
        </div>

        <div className="flex flex-col gap-3">
          {modelMetrics.map(m => (
            <div key={m.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{m.label}</span>
                <span className={`font-bold ${m.color}`}>{m.value}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.bar }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-1 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-2">
            <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Model performance is low due to lack of predictive features</strong>, not due to poor modeling. The data science is sound — the data is incomplete.
            </p>
          </div>
        </div>
      </div>

      {/* Key Insights Panel */}
      <div className="card lg:col-span-3 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
            <TrendingUp size={14} className="text-blue-500" />
          </div>
          <h3 className="section-header">Key Business Insights</h3>
        </div>
        <div className="flex flex-col gap-3">
          {insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: ins.color }} />
              <p className="text-xs text-gray-600 leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion banner */}
      <div className="lg:col-span-5 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Database size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm mb-1">Project Conclusion</p>
          <p className="text-violet-100 text-xs leading-relaxed">
            The central insight of this project is identifying <strong className="text-white">missing operational signals</strong>, not maximizing accuracy on the wrong data. 
            This demonstrates data-driven reasoning: understanding what the data <em>cannot</em> tell you is as valuable as what it can. 
            The next step is enriching the dataset with carrier, geolocation, and traffic variables before re-modeling.
          </p>
        </div>
      </div>

    </div>
  );
}
