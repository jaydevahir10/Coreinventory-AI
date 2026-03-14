import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Products   from './pages/Products';
import Receipts   from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers  from './pages/Transfers';
import Inventory  from './pages/Inventory';

// ── Toast context (global) ──────────────────────────
export const ToastContext = React.createContext(null);
export function useToast() { return React.useContext(ToastContext); }

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const add = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.type === 'success' ? '✓' : '✕'}</span>{t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Auth guard ──────────────────────────────────────
function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
}

// ── Sidebar ─────────────────────────────────────────
function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'U';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9-3h2v2h-2V4zm-2 0h1v2H9V4zm6 0h1v2h-1V4z"/></svg>
        </div>
        <div>
          <div className="logo-name">CoreInventory</div>
          <div className="logo-sub">AI Platform</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">Main</div>
        <NavLink to="/dashboard"  className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-dot"/>Dashboard</NavLink>
        <NavLink to="/inventory"  className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-dot"/>Inventory</NavLink>
        <NavLink to="/products"   className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-dot"/>Products</NavLink>
        <div className="nav-section">Operations</div>
        <NavLink to="/receipts"   className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-dot"/>Receipts</NavLink>
        <NavLink to="/deliveries" className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-dot"/>Deliveries</NavLink>
        <NavLink to="/transfers"  className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-dot"/>Transfers</NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="user-block" onClick={logout} title="Click to logout">
          <div className="avatar">{initials}</div>
          <div>
            <div className="user-name">{user.name || 'User'}</div>
            <div className="user-role">{user.role || 'staff'} · logout</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Layout wrapper ───────────────────────────────────
function Layout({ title, subtitle, actions, children }) {
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-sub">{subtitle || `Last updated at ${now}`}</div>}
          </div>
          {actions && <div className="topbar-right">{actions}</div>}
        </div>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}

export { Layout };

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/products"   element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/inventory"  element={<PrivateRoute><Inventory /></PrivateRoute>} />
          <Route path="/receipts"   element={<PrivateRoute><Receipts /></PrivateRoute>} />
          <Route path="/deliveries" element={<PrivateRoute><Deliveries /></PrivateRoute>} />
          <Route path="/transfers"  element={<PrivateRoute><Transfers /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
