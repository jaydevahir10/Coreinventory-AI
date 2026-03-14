import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode]   = useState('login'); // 'login' | 'register'
  const [form, setForm]   = useState({ name: '', email: '', password: '', role: 'staff' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload  = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, role: form.role };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="logo-icon" style={{width:38,height:38,borderRadius:10,background:'#4f7ef8',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg viewBox="0 0 24 24" style={{fill:'white',width:20,height:20}}>
              <path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-9-3h2v2h-2V4zm-2 0h1v2H9V4zm6 0h1v2h-1V4z"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:18,fontWeight:600}}>CoreInventory AI</div>
            <div style={{fontSize:11,color:'var(--txt3)'}}>Inventory Management System</div>
          </div>
        </div>

        <div className="login-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
        <div className="login-sub">{mode === 'login' ? 'Sign in to your account' : 'Register a new account'}</div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" placeholder="admin@test.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px'}} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-divider">or</div>
        <div style={{textAlign:'center',fontSize:13,color:'var(--txt2)'}}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <a href="#!" className="login-link" onClick={e=>{e.preventDefault();setMode(mode==='login'?'register':'login');setError('');}}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </a>
        </div>

        {mode === 'login' && (
          <div style={{marginTop:16,background:'rgba(79,126,248,.08)',border:'1px solid rgba(79,126,248,.15)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'var(--txt2)'}}>
            <strong style={{color:'var(--accent2)'}}>Demo credentials</strong><br/>
            Email: admin@test.com &nbsp;·&nbsp; Password: password123
          </div>
        )}
      </div>
    </div>
  );
}
