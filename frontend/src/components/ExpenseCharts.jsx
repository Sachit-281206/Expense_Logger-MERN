import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ExpenseCharts = ({ byCategory }) => {
  const labels = Object.keys(byCategory);
  const values = Object.values(byCategory);

  if (labels.length === 0) return null;

  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#2563eb",
          "#22c55e",
          "#f97316",
          "#ef4444",
          "#a855f7",
          "#06b6d4",
          "#facc15",
        ],
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: values,
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 12,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h3>Analytics</h3>
        <p>Visual breakdown of your spending</p>
      </div>
      
      <div className="chart-grid">
        <div className="chart-card pie-chart">
          <div className="chart-header">
            <h4>Category Distribution</h4>
            <span className="chart-subtitle">Spending by category</span>
          </div>
          <div className="chart-wrapper">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-card bar-chart">
          <div className="chart-header">
            <h4>Spending Comparison</h4>
            <span className="chart-subtitle">Amount comparison</span>
          </div>
          <div className="chart-wrapper">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
