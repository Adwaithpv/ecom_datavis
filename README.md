# DeliverIQ: E-Commerce Delivery Analytics

DeliverIQ is a modern, responsive web dashboard built to visualize insights from an extensive e-commerce delivery analytics project. Analyzing a dataset of **100,000 orders** across major quick-commerce platforms (Blinkit, JioMart, Swiggy Instamart), the dashboard translates complex machine learning findings into clear, actionable business intelligence for stakeholders.

## 📊 Key Business Insights

The dashboard illustrates the core findings of the project's data science analysis:
* **Missing Operational Signals:** Predictive modeling (Logistic Regression, Random Forest) yielded a baseline ROC-AUC of 0.5. The dashboard explains that delivery delays are driven by *missing operational variables* (like traffic and distance), not by pre-order features like Product Category or Order Value.
* **Uniform Delay Distribution:** Visualizes that the ~13.7% delay rate remains consistent across platforms and order values.
* **Refund Independence:** Demonstrates that the ~45.8% refund rate holds steady regardless of whether an order was delayed.
* **Delivery Time Correlation:** Shows that delivery time clearly separates delayed vs. on-time orders, but acts as a post-outcome variable.

## 💻 Tech Stack

* **Frontend Framework:** React (with Vite)
* **Styling:** Tailwind CSS (configured for a sleek, light-mode SaaS aesthetic)
* **Data Visualization:** Recharts
* **Icons:** Lucide React
* **Deployment Context:** Ready for Vercel deployment with root directory configuration.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone this repository (if you haven't already).
2. Navigate to the `dashboard` directory:
   ```bash
   cd dashboard
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server, run:
```bash
npm run dev
```
Then, open your browser and navigate to the URL provided in your terminal (usually `http://localhost:5173` or `http://localhost:5174`).

## 📁 Project Structure

* **`dashboard/`**: Contains the React frontend application.
  * `src/components/`: UI components including the Sidebar, Topbar, KPI Cards, and Charts.
  * `src/data/mockData.ts`: Aggregated dataset accurately reflecting the original CSV analytics.
  * `src/App.tsx`: Main layout assembly.
* **`Ecommerce_Delivery_Analytics_New.csv`**: The original dataset containing the 100,000 e-commerce orders.
* **`main.py`**: Python script used for the initial machine learning and exploratory data analysis.
* **`vercel.json`**: Configuration files to support seamless deployment to Vercel.

## ☁️ Deployment

This project is configured for deployment on Vercel. 
If deploying via the Vercel dashboard, ensure the **Root Directory** setting is pointed to `dashboard` (or rely on the `vercel.json` provided at the repository root).
