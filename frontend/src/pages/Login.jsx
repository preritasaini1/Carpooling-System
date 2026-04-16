import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Car, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter') handleSubmit(); };

  const inputStyle = (name) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    border: `2px solid ${focused === name ? '#D4F53C' : error && !form[name] ? '#fecaca' : '#e8e8e8'}`,
    borderRadius: '12px', padding: '13px 16px', background: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === name ? '0 0 0 4px rgba(212,245,60,0.15)' : 'none',
  });

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .login-btn:hover  { transform:translate(-2px,-2px) !important; box-shadow:6px 6px 0px #0a0a0a !important; }
        .login-btn:active { transform:scale(0.98) !important; }
        .social-btn:hover { border-color:#0a0a0a !important; background:#f9ffe0 !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f9ffe0 0%,#fff 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeUp 0.5s ease' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <div style={{ width: '42px', height: '42px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '3px 3px 0px #0a0a0a' }}>
                <Car size={20} />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#0a0a0a' }}>CarPooler</span>
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Welcome back! Sign in to continue.</p>
          </div>

          {/* Card */}
          <div style={{ background: '#fff', border: '2px solid #e8e8e8', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}>

            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Sign In</h2>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #D4F53C' }}>Sign up free</Link>
            </p>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff1f0', border: '2px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginBottom: '1.25rem', animation: 'shake 0.4s ease' }}>
                <AlertCircle size={15} color="#dc2626" />
                <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Email</label>
              <div style={inputStyle('email')}>
                <Mail size={16} color={focused === 'email' ? '#0a0a0a' : '#aaa'} />
                <input
                  name="email" type="email" value={form.email}
                  onChange={handleChange} onKeyDown={handleKeyDown}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="you@example.com"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Password</label>
              <div style={inputStyle('password')}>
                <Lock size={16} color={focused === 'password' ? '#0a0a0a' : '#aaa'} />
                <input
                  name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} onKeyDown={handleKeyDown}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }}
                />
                <button onClick={() => setShowPass(p => !p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center', padding: 0, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
                  onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: '#888', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid #e8e8e8', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button className="login-btn" onClick={handleSubmit} disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: '#D4F53C', border: '2px solid #0a0a0a',
                borderRadius: '14px', fontFamily: 'Syne, sans-serif',
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '4px 4px 0px #0a0a0a', transition: 'all 0.15s',
                marginBottom: '1.25rem',
              }}>
              {loading ? (
                <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : 'Sign In →'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
              <span style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 500 }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Google', icon: '🇬' },
                { label: 'GitHub', icon: '🐙' },
              ].map(({ label, icon }) => (
                <button key={label} className="social-btn"
                  style={{ padding: '11px', border: '2px solid #e8e8e8', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s' }}>
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}