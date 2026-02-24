import { useEffect, useState } from "react";
import api from "../api/axios";
import ExpenseCharts from "../components/ExpenseCharts";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);

  // filter mode
  const [mode, setMode] = useState("month"); // "month" | "year"

  // month & year values
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    let filtered = [];

    if (mode === "month") {
      filtered = expenses.filter((e) =>
        e.date?.startsWith(month)
      );
    } else {
      filtered = expenses.filter((e) =>
        e.date?.startsWith(year)
      );
    }

    let sum = 0;
    const map = {};

    filtered.forEach((exp) => {
      sum += Number(exp.amount);
      const cat = exp.category?.name || "Other";
      map[cat] = (map[cat] || 0) + Number(exp.amount);
    });

    setTotal(sum);
    setByCategory(map);
  }, [expenses, month, year, mode]);

  // unique years for dropdown
  const years = [...new Set(
    expenses.map((e) => e.date?.slice(0, 4)).filter(Boolean)
  )];

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Dashboard</h2>
            <span className="subtitle">
              {mode === "month" ? "Monthly overview" : "Yearly overview"}
            </span>
          </div>
        </div>

        {/* FILTER CONTROLS */}
        <div className="filter-controls">
          <div className="filter-group">
            <label>View:</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className="filter-select"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Period:</label>
            {mode === "month" ? (
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="filter-input"
              />
            ) : (
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="filter-select"
              >
                {years.length === 0 ? (
                  <option>{new Date().getFullYear()}</option>
                ) : (
                  years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="dashboard-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <span className="stat-label">Total Spent</span>
          </div>
          <h1 className="stat-value">₹ {total.toLocaleString()}</h1>
          <div className="stat-trend">
            {mode === "month" ? "This month" : "This year"}
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-header">
            <span className="stat-label">By Category</span>
          </div>

          {Object.keys(byCategory).length === 0 ? (
            <div className="empty-state">
              <p>No expenses found</p>
              <small>Add some expenses to see the breakdown</small>
            </div>
          ) : (
            <div className="category-breakdown">
              <ul className="category-list">
                {Object.entries(byCategory)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 4)
                  .map(([cat, amt]) => {
                    const percent = total > 0 ? ((amt / total) * 100).toFixed(1) : 0;
                    return (
                      <li key={cat} className="category-item">
                        <div className="category-info">
                          <div className="category-dot"></div>
                          <div className="category-details">
                            <span className="category-name">{cat}</span>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="category-amount">
                          <strong>₹{amt.toLocaleString()}</strong>
                          <small>{percent}%</small>
                        </div>
                      </li>
                    );
                  })}
              </ul>
              {Object.keys(byCategory).length > 4 && (
                <div className="more-categories">
                  +{Object.keys(byCategory).length - 4} more categories
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-section">
        <ExpenseCharts byCategory={byCategory} />
      </div>
    </div>
  );
};

export default Dashboard;
