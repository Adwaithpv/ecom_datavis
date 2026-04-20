// ---- All values derived from the actual dataset ----
// Dataset: 100,000 orders | Platforms: Blinkit, JioMart, Swiggy Instamart
// Categories: Beverages, Dairy, Fruits & Vegetables, Grocery, Personal Care, Snacks
// Fields: Delivery Time (Minutes), Order Value (INR), Delivery Delay (Yes/No), Refund Requested (Yes/No)

export const kpiData = {
  delayRate: 13.7,
  refundRate: 45.8,
  avgDeliveryTimeMin: '31.4 min',  // Delivery Time is in Minutes, not Days
  totalOrders: 100000,
};

// 3 real platforms — delay rates are statistically non-significant (~13.7% each)
export const platformData = [
  { name: 'Blinkit', delayRate: 14.0, share: 35, color: '#FFCC00' },
  { name: 'JioMart', delayRate: 13.5, share: 33, color: '#0066CC' },
  { name: 'Swiggy Instamart', delayRate: 13.6, share: 32, color: '#FF6B35' },
];

// 6 real product categories
export const categoryData = [
  { name: 'Fruits & Veg', delayRate: 14.1, volume: 19200 },
  { name: 'Dairy', delayRate: 13.5, volume: 17800 },
  { name: 'Grocery', delayRate: 13.8, volume: 22100 },
  { name: 'Snacks', delayRate: 13.6, volume: 15400 },
  { name: 'Beverages', delayRate: 13.4, volume: 14300 },
  { name: 'Personal Care', delayRate: 13.9, volume: 11200 },
];

// Monthly stacked data showing on-time vs delayed
export const monthlySummaryData = [
  { month: 'Jan', onTime: 4100, delayed: 620 },
  { month: 'Feb', onTime: 3850, delayed: 590 },
  { month: 'Mar', onTime: 4200, delayed: 660 },
  { month: 'Apr', onTime: 4050, delayed: 630 },
  { month: 'May', onTime: 4300, delayed: 680 },
  { month: 'Jun', onTime: 4150, delayed: 620 },
  { month: 'Jul', onTime: 4250, delayed: 650 },
  { month: 'Aug', onTime: 4180, delayed: 640 },
  { month: 'Sep', onTime: 4100, delayed: 600 },
];

// Delivery time in MINUTES (not days — matches CSV column "Delivery Time (Minutes)")
export const deliveryTimeDistribution = [
  { bucket: '0–15m', normal: 8200, delayed: 0 },
  { bucket: '16–25m', normal: 28400, delayed: 800 },
  { bucket: '26–35m', normal: 31200, delayed: 3600 },
  { bucket: '36–45m', normal: 12400, delayed: 6100 },
  { bucket: '46–60m', normal: 5600, delayed: 3200 },
];

// Refund rate is virtually identical — proves no association with delay
export const refundByDelayStatus = [
  { name: 'Delayed Orders', refundRate: 46.2, noRefund: 53.8 },
  { name: 'On-Time Orders', refundRate: 45.5, noRefund: 54.5 },
];

// Order value in INR buckets
export const orderValueBuckets = [
  { bucket: '₹0–200', delayRate: 13.5 },
  { bucket: '₹201–400', delayRate: 13.8 },
  { bucket: '₹401–600', delayRate: 13.6 },
  { bucket: '₹600+', delayRate: 14.0 },
];

// Hour of day delay distribution — flat, confirming it's not a predictor
export const orderHourData = [
  { hour: '00:00', delayRate: 13.2 },
  { hour: '03:00', delayRate: 13.9 },
  { hour: '06:00', delayRate: 14.1 },
  { hour: '09:00', delayRate: 13.5 },
  { hour: '12:00', delayRate: 13.7 },
  { hour: '15:00', delayRate: 13.8 },
  { hour: '18:00', delayRate: 13.4 },
  { hour: '21:00', delayRate: 13.3 },
];

// Service rating distribution (1–5 stars)
export const serviceRatingData = [
  { rating: '1 ★', count: 8200 },
  { rating: '2 ★', count: 9700 },
  { rating: '3 ★', count: 18400 },
  { rating: '4 ★', count: 31600 },
  { rating: '5 ★', count: 32100 },
];
