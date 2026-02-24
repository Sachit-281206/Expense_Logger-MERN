import { useEffect, useState } from "react";
import api from "../api/axios";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [query, setQuery] = useState("");

  const [error, setError] = useState("");



  const fetchData = async () => {
    const [expRes, catRes] = await Promise.all([
      api.get("/expenses"),
      api.get("/categories"),
    ]);
    setExpenses(expRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExpenses = expenses.filter((e) => {
    const matchMonth = e.date?.startsWith(month);
    const matchSearch =
      e.description?.toLowerCase().includes(query.toLowerCase()) ||
      e.category?.name?.toLowerCase().includes(query.toLowerCase());

    return matchMonth && matchSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    await api.post("/expenses", { amount, category, description, date });
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
    fetchData();
  };

  const startEdit = (exp) => {
    setEditingId(exp._id);
    setEditAmount(exp.amount);
    setEditCategory(exp.category?._id);
    setEditDescription(exp.description || "");
    setEditDate(exp.date?.slice(0, 10) || "");
  };

  const updateExpense = async (id) => {
    await api.put(`/expenses/${id}`, {
      amount: editAmount,
      category: editCategory,
      description: editDescription,
      date: editDate,
    });
    setEditingId(null);
    fetchData();
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;
    await api.delete(`/expenses/${id}`);
    fetchData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Expenses</h2>
            <span className="subtitle">Track and manage your spending</span>
          </div>
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Month:</label>
            <input 
              type="month" 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      <div className="expense-form-card">
        <div className="form-header">
          <h3>Add New Expense</h3>
          <p>Record your spending</p>
        </div>
        {error && <p className="form-error">{error}</p>}
        <form className="modern-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-select"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <input
                placeholder="What did you spend on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add Expense
          </button>
        </form>
      </div>

      <div className="expenses-list-card">
        <div className="list-header">
          <h3>Expense History</h3>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search expenses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses found</p>
            <small>Add some expenses to see them here</small>
          </div>
        ) : (
          <ul className="expense-list">
            {filteredExpenses.map((exp) => {
              return (
                <li key={exp._id} className="expense-item">
                  {editingId === exp._id ? (
                    <div className="edit-form">
                      <div className="form-row">
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="form-input"
                          placeholder="Amount"
                        />
                        <select 
                          value={editCategory} 
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="form-select"
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-row">
                        <input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="form-input"
                          placeholder="Description"
                        />
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="expense-actions">
                        <button 
                          className="action-btn save-btn" 
                          onClick={() => updateExpense(exp._id)}
                        >
                          Save
                        </button>
                        <button 
                          className="action-btn cancel-btn" 
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="expense-info">
                        <div className="expense-dot"></div>
                        <div className="expense-details">
                          <div className="expense-amount">₹ {Number(exp.amount).toLocaleString()}</div>
                          <div className="expense-meta">
                            <span className="expense-category">{exp.category?.name}</span>
                            {exp.description && (
                              <>
                                <span className="separator">•</span>
                                <span className="expense-description">{exp.description}</span>
                              </>
                            )}
                          </div>
                          <div className="expense-date">
                            {new Date(exp.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="expense-actions">
                        <button 
                          className="action-btn edit-btn" 
                          onClick={() => startEdit(exp)}
                          title="Edit expense"
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          onClick={() => deleteExpense(exp._id)}
                          title="Delete expense"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Expenses;
