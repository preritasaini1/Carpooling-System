import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, Car, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

export default function LoginModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [tab, setTab] = useState('login'); // login | signup
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleSubmit = async () => {
    console.log("BUTTON CLICKED 🔥");
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Invalid email address.');
      return;
    }

    if (tab === 'signup' && !form.name.trim()) {
      setError('Name is required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const url =
        tab === "signup"
          ? "http://localhost:5000/api/auth/register"
          : "http://localhost:5000/api/auth/login";

      const payload =
        tab === "signup"
          ? {
              fullName: form.name,
              email: form.email,
              password: form.password,
            }
          : {
              email: form.email,
              password: form.password,
            };

      const res = await axios.post(url, payload);

      const userData = res.data.user;

      login(userData);

      if (onSuccess) onSuccess(userData);
      else onClose();

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    border: `2px solid ${focused === name ? '#D4F53C' : '#e8e8e8'}`,
    borderRadius: '12px', padding: '12px 14px', background: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === name ? '0 0 0 4px rgba(212,245,60,0.15)' : 'none',
  });

  const sharedInput = {
    border: 'none', outline: 'none', flex: 1, fontSize: '0.92rem',
    color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif',
  };

  return (
    <>
      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .modal-btn:hover   { transform:translate(-1px,-1px) !important; box-shadow:5px 5px 0px #0a0a0a !important; }
      `}</style>

      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem', backdropFilter: 'blur(6px)' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', maxWidth: '420px', width: '100%', border: '2px solid #e8e8e8', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'modalIn 0.25s ease', position: 'relative' }}>

          <button onClick={onClose}
            style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '8px', border: '2px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
            <X size={14} />
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '34px', height: '34px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #0a0a0a' }}>
              <Car size={16} />
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>CarPooler</span>
          </div>

          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.25rem' }}>
            {tab === 'login' ? 'Sign in to book' : 'Create your account'}
          </h3>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ border: 'none', background: 'none', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: '#D4F53C', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', padding: 0 }}>
              {tab === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff1f0', border: '2px solid #fecaca', borderRadius: '10px', padding: '9px 12px', marginBottom: '1rem' }}>
              <AlertCircle size={14} color="#dc2626" />
              <span style={{ fontSize: '0.82rem', color: '#dc2626' }}>{error}</span>
            </div>
          )}

          {tab === 'signup' && (
            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Full Name</label>
              <div style={inputStyle('name')}>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="Your full name" style={sharedInput} />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Email</label>
            <div style={inputStyle('email')}>
              <Mail size={15} color={focused === 'email' ? '#0a0a0a' : '#aaa'} />
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                placeholder="you@example.com" style={sharedInput} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Password</label>
            <div style={inputStyle('password')}>
              <Lock size={15} color={focused === 'password' ? '#0a0a0a' : '#aaa'} />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                placeholder="••••••••" style={sharedInput} />
              <button onClick={() => setShowPass(p => !p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', padding: 0 }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button className="modal-btn" onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '4px 4px 0px #0a0a0a', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading
              ? <span style={{ width: '18px', height: '18px', border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              : tab === 'login' ? 'Sign In & Continue →' : 'Create Account →'}
          </button>
        </div>
      </div>
    </>
  );
}