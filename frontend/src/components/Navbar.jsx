import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { logout, token, user } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!token || location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-title">ExpenseLogger</span>
      </div>

      <div className="navbar-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/categories" 
          className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
        >
          Categories
        </Link>
        <Link 
          to="/expenses" 
          className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
        >
          Expenses
        </Link>
      </div>

      <div className="account-section" ref={dropdownRef}>
        <div 
          className="account-circle" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="account-initial">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        
        {showDropdown && (
          <div className="account-dropdown">
            <div className="dropdown-header">
              <div className="user-info">
                <div className="user-name">{user?.name || 'User'}</div>
                <div className="user-email">{user?.email || ''}</div>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={logout}>
              <span className="dropdown-icon">🚪</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
