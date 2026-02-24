import { useEffect, useState } from "react";
import api from "../api/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/categories", { name, description });
    setName("");
    setDescription("");
    fetchCategories();
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
  };

  const updateCategory = async (id) => {
    await api.put(`/categories/${id}`, {
      name: editName,
      description: editDescription,
    });
    setEditingId(null);
    fetchCategories();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Categories</h2>
            <span className="subtitle">Organize your expenses</span>
          </div>
        </div>
      </div>

      <div className="category-form-card">
        <div className="form-header">
          <h3>Create Category</h3>
          <p>Add a new expense category</p>
        </div>
        <form className="modern-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Category Name
              </label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Food, Transport, Entertainment" 
                className="form-input"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <input 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Optional description" 
                className="form-input"
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Create Category
          </button>
        </form>
      </div>

      <div className="categories-list-card">
        <div className="list-header">
          <h3>Your Categories</h3>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No categories found</p>
            <small>Create some categories to organize your expenses</small>
          </div>
        ) : (
          <ul className="category-list">
            {filtered.map((cat) => {
              return (
                <li key={cat._id} className="category-item">
                  {editingId === cat._id ? (
                    <div className="edit-form">
                      <div className="edit-inputs">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="edit-input"
                          placeholder="Category name"
                        />
                        <input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="edit-input"
                          placeholder="Description"
                        />
                      </div>
                      <div className="edit-actions">
                        <button 
                          className="save-btn" 
                          onClick={() => updateCategory(cat._id)}
                        >
                          Save
                        </button>
                        <button 
                          className="cancel-btn" 
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="category-info">
                        <div className="category-dot"></div>
                        <div className="category-details">
                          <div className="category-name">{cat.name}</div>
                          {cat.description && (
                            <div className="category-description">{cat.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="category-actions">
                        <button 
                          className="edit-btn" 
                          onClick={() => startEdit(cat)}
                          title="Edit category"
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => deleteCategory(cat._id)}
                          title="Delete category"
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

export default Categories;
