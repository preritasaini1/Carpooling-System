import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Account', 'Personal', 'Done'];

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
    { label: 'Symbol', pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['#e8e8e8', '#fecaca', '#fde68a', '#D4F53C', '#D4F53C'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div style={{ marginTop: '8px', animation: 'dropIn 0.2s ease' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '999px', background: i <= score ? colors[score] : '#e8e8e8', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {checks.map(({ label, pass }) => (
            <span key={label} style={{ fontSize: '0.7rem', color: pass ? '#16a34a' : '#aaa', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
              {pass ? '✓' : '○'} {label}
            </span>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: colors[score] !== '#e8e8e8' ? '#0a0a0a' : '#aaa' }}>{labels[score]}</span>
      </div>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'both' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [agreed, setAgreed] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validateStep0 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone) e.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit Indian mobile number';
    return e;
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters required';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must agree to the terms';
    return e;
  };

  const handleNext = async () => {
    if (step === 0) {
      const e = validateStep0();
      if (Object.keys(e).length) { setErrors(e); return; }
      setStep(1);
    } else if (step === 1) {
      const e = validateStep1();
      if (Object.keys(e).length) { setErrors(e); return; }
      setLoading(true);
      try {
        const result = await register({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        });
        console.log('Registration successful:', result);
        setStep(2);
      } catch (error) {
        console.error('Registration error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
        console.log('Error message:', errorMsg);
        setErrors({ submit: errorMsg });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter') handleNext(); };

  const inputBox = (name) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    border: `2px solid ${errors[name] ? '#fecaca' : focused === name ? '#D4F53C' : '#e8e8e8'}`,
    borderRadius: '12px', padding: '13px 16px', background: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === name ? '0 0 0 4px rgba(212,245,60,0.15)' : 'none',
  });

  const sharedInput = { border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' };

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes successPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes stepIn  { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        .signup-btn:hover  { transform:translate(-2px,-2px) !important; box-shadow:6px 6px 0px #0a0a0a !important; }
        .role-btn:hover    { border-color:#0a0a0a !important; }
        .social-btn:hover  { border-color:#0a0a0a !important; background:#f9ffe0 !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f9ffe0 0%,#fff 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '460px', animation: 'fadeUp 0.5s ease' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <div style={{ width: '42px', height: '42px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '3px 3px 0px #0a0a0a' }}>
                <Car size={20} />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#0a0a0a' }}>CarPooler</span>
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Join thousands of smart travellers</p>
          </div>

          {/* Card */}
          <div style={{ background: '#fff', border: '2px solid #e8e8e8', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}>

            {step < 2 && (
              <>
                {/* Step indicator */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1.75rem' }}>
                  {STEPS.slice(0, 2).map((s, i) => (
                    <div key={s} style={{ flex: 1 }}>
                      <div style={{ height: '3px', borderRadius: '999px', background: i <= step ? '#D4F53C' : '#e8e8e8', transition: 'background 0.3s', border: i === step ? '1px solid #0a0a0a' : 'none' }} />
                      <span style={{ fontSize: '0.7rem', color: i === step ? '#0a0a0a' : '#aaa', fontWeight: i === step ? 700 : 400, display: 'block', marginTop: '4px' }}>{s}</span>
                    </div>
                  ))}
                </div>

                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {step === 0 ? 'Create Account' : 'Set Password'}
                </h2>
                <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
                  {step === 0 ? (
                    <>Already have an account?{' '}
                      <Link to="/login" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #D4F53C' }}>Sign in</Link>
                    </>
                  ) : 'Almost there — set a strong password'}
                </p>
              </>
            )}

            {/* ── STEP 0: Account info ── */}
            {step === 0 && (
              <div style={{ animation: 'stepIn 0.3s ease' }}>
                {/* Name */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Full Name</label>
                  <div style={inputBox('name')}>
                    <User size={16} color={focused === 'name' ? '#0a0a0a' : '#aaa'} />
                    <input name="name" value={form.name} onChange={e => set('name', e.target.value)} onKeyDown={handleKeyDown}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                      placeholder="Rahul Sharma" style={sharedInput} />
                  </div>
                  {errors.name && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{errors.name}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Email</label>
                  <div style={inputBox('email')}>
                    <Mail size={16} color={focused === 'email' ? '#0a0a0a' : '#aaa'} />
                    <input name="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} onKeyDown={handleKeyDown}
                      onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                      placeholder="rahul@example.com" style={sharedInput} />
                  </div>
                  {errors.email && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{errors.email}</p>}
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Phone Number</label>
                  <div style={inputBox('phone')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px', borderRight: '1.5px solid #e8e8e8' }}>
                      <span style={{ fontSize: '0.85rem' }}>🇮🇳</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>+91</span>
                    </div>
                    <Phone size={15} color={focused === 'phone' ? '#0a0a0a' : '#aaa'} />
                    <input name="phone" type="tel" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} onKeyDown={handleKeyDown}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                      placeholder="9876543210" style={sharedInput} />
                  </div>
                  {errors.phone && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{errors.phone}</p>}
                </div>

                {/* Role */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.75rem', textTransform: 'uppercase' }}>I want to</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                    {[
                      { key: 'rider', label: 'Find Rides', icon: '🎒' },
                      { key: 'driver', label: 'Offer Rides', icon: '🚗' },
                      { key: 'both', label: 'Both', icon: '⚡' },
                    ].map(({ key, label, icon }) => (
                      <button key={key} className="role-btn" onClick={() => set('role', key)}
                        style={{
                          padding: '12px 8px', borderRadius: '12px', border: '2px solid',
                          borderColor: form.role === key ? '#0a0a0a' : '#e8e8e8',
                          background: form.role === key ? '#D4F53C' : '#fff',
                          cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 700, fontSize: '0.8rem',
                          boxShadow: form.role === key ? '2px 2px 0px #0a0a0a' : 'none',
                          transform: form.role === key ? 'translate(-1px,-1px)' : 'none',
                          transition: 'all 0.15s',
                        }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{icon}</div>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="signup-btn" onClick={handleNext}
                  style={{ width: '100%', padding: '15px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '4px 4px 0px #0a0a0a', transition: 'all 0.15s', marginBottom: '1.25rem' }}>
                  Continue →
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                  <span style={{ fontSize: '0.78rem', color: '#aaa' }}>or sign up with</span>
                  <div style={{ flex: 1, height: '1px', background: '#e8e8e8' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[{ label: 'Google', icon: '🇬' }, { label: 'GitHub', icon: '🐙' }].map(({ label, icon }) => (
                    <button key={label} className="social-btn"
                      style={{ padding: '11px', border: '2px solid #e8e8e8', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s' }}>
                      <span>{icon}</span> {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 1: Password ── */}
            {step === 1 && (
              <div style={{ animation: 'stepIn 0.3s ease' }}>

                {/* Error Alert */}
                {errors.submit && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff1f0', border: '2px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginBottom: '1.25rem', animation: 'shake 0.4s ease' }}>
                    <AlertCircle size={15} color="#dc2626" />
                    <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 500 }}>{errors.submit}</span>
                  </div>
                )}

                {/* Password */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Password</label>
                  <div style={inputBox('password')}>
                    <Lock size={16} color={focused === 'password' ? '#0a0a0a' : '#aaa'} />
                    <input type={showPass ? 'text' : 'password'} value={form.password}
                      onChange={e => set('password', e.target.value)} onKeyDown={handleKeyDown}
                      onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                      placeholder="Min. 8 characters" style={sharedInput} />
                    <button onClick={() => setShowPass(p => !p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', padding: 0, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#0a0a0a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                  {errors.password && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{errors.password}</p>}
                </div>

                {/* Confirm */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Confirm Password</label>
                  <div style={inputBox('confirm')}>
                    <Lock size={16} color={focused === 'confirm' ? '#0a0a0a' : '#aaa'} />
                    <input type={showConfirm ? 'text' : 'password'} value={form.confirm}
                      onChange={e => set('confirm', e.target.value)} onKeyDown={handleKeyDown}
                      onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                      placeholder="Repeat password" style={sharedInput} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {form.confirm && (
                        form.password === form.confirm
                          ? <CheckCircle size={15} color="#16a34a" />
                          : <AlertCircle size={15} color="#dc2626" />
                      )}
                      <button onClick={() => setShowConfirm(p => !p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', padding: 0 }}>
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {errors.confirm && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{errors.confirm}</p>}
                </div>

                {/* Terms */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <div onClick={() => setAgreed(p => !p)}
                      style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${errors.agreed ? '#fecaca' : agreed ? '#0a0a0a' : '#e8e8e8'}`, background: agreed ? '#D4F53C' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px', transition: 'all 0.15s', cursor: 'pointer' }}>
                      {agreed && <span style={{ fontSize: '11px', fontWeight: 800 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.5 }}>
                      I agree to the{' '}
                      <Link to="/terms" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid #D4F53C' }}>Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid #D4F53C' }}>Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.agreed && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} />{errors.agreed}</p>}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep(0)}
                    style={{ padding: '14px 20px', border: '2px solid #e8e8e8', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                    ← Back
                  </button>
                  <button className="signup-btn" onClick={handleNext} disabled={loading}
                    style={{ flex: 1, padding: '14px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '4px 4px 0px #0a0a0a', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {loading
                      ? <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      : 'Create Account 🚀'}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Success ── */}
            {step === 2 && (
              <div style={{ textAlign: 'center', padding: '1rem 0', animation: 'fadeUp 0.5s ease' }}>
                <div style={{ width: '72px', height: '72px', background: '#D4F53C', borderRadius: '50%', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem', boxShadow: '4px 4px 0px #0a0a0a', animation: 'successPop 0.4s ease' }}>🎉</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>You're in!</h2>
                <p style={{ color: '#777', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                  Welcome, <strong>{form.name.split(' ')[0]}</strong>!<br />Your account has been created.
                </p>
                <p style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: '2rem' }}>A confirmation has been sent to <strong>{form.email}</strong></p>

                {/* What's next */}
                <div style={{ background: '#f8f8f5', border: '2px solid #e8e8e8', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What's next</p>
                  {[
                    { icon: '🚗', text: 'Browse available rides near you' },
                    { icon: '✅', text: 'Complete your profile for more trust' },
                    { icon: '💬', text: 'Connect with your first co-traveller' },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '0.88rem', color: '#555' }}>
                      <span>{icon}</span> {text}
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate('/')}
                  style={{ width: '100%', padding: '15px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '4px 4px 0px #0a0a0a', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px #0a0a0a'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #0a0a0a'; }}>
                  Start Exploring →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}