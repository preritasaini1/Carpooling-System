import { useState, useRef, useEffect } from 'react';
import { Phone, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OTPVerification({ onVerified, onClose }) {
  const { user, updateUser } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [step, setStep] = useState(user?.phoneVerified ? 'verified' : 'phone'); // phone | otp | verified
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [sentOtp, setSentOtp] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === 'verified') {
      const t = setTimeout(() => onVerified(), 1200);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(p => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const sendOTP = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    setLoading(true);
    setError('');
    // Simulate OTP send — in production call your backend
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(mockOtp);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setResendTimer(30);
      console.log(`[DEV] OTP for ${phone}: ${mockOtp}`); // Remove in production
    }, 1000);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[i] = val;
    setOtp(updated);
    setError('');
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === 'Enter') verifyOTP();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const verifyOTP = () => {
    const entered = otp.join('');
    if (entered.length < 6) { setError('Enter the complete 6-digit OTP.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (entered === sentOtp) {
        updateUser({ phone: `+91${phone}`, phoneVerified: true });
        setStep('verified');
      } else {
        setError('Incorrect OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      setLoading(false);
    }, 800);
  };

  const resend = () => {
    if (resendTimer > 0) return;
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(mockOtp);
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    setError('');
    console.log(`[DEV] Resent OTP: ${mockOtp}`);
  };

  return (
    <>
      <style>{`
        @keyframes modalIn    { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes successPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes shake      { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        .otp-input:focus { border-color:#D4F53C !important; box-shadow:0 0 0 4px rgba(212,245,60,0.2) !important; }
      `}</style>

      <div onClick={e => e.target === e.currentTarget && onClose?.()}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem', backdropFilter: 'blur(6px)' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', maxWidth: '420px', width: '100%', border: '2px solid #e8e8e8', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', animation: 'modalIn 0.25s ease' }}>

          {/* ── Phone step ── */}
          {step === 'phone' && (
            <>
              <div style={{ width: '52px', height: '52px', background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Phone size={22} color="#0a0a0a" />
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.25rem' }}>Verify your number</h3>
              <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                We need to verify your mobile number before you can book a ride.
              </p>

              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.06em', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Mobile Number</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: `2px solid ${error ? '#fecaca' : '#e8e8e8'}`, borderRadius: '12px', padding: '12px 14px', background: '#fff', marginBottom: '0.5rem', transition: 'border-color 0.2s' }}
                onFocusCapture={e => e.currentTarget.style.borderColor = '#D4F53C'}
                onBlurCapture={e => e.currentTarget.style.borderColor = error ? '#fecaca' : '#e8e8e8'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '10px', borderRight: '1.5px solid #e8e8e8', flexShrink: 0 }}>
                  <span>🇮🇳</span>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#555' }}>+91</span>
                </div>
                <input
                  type="tel" maxLength={10} value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                  placeholder="9876543210"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.05em' }}
                />
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontSize: '0.8rem', marginBottom: '1rem', animation: 'shake 0.4s ease' }}>
                  <AlertCircle size={13} /> {error}
                </div>
              )}

              <button onClick={sendOTP} disabled={loading || phone.length !== 10}
                style={{ width: '100%', marginTop: '0.75rem', padding: '14px', background: phone.length === 10 ? '#D4F53C' : '#f0f0f0', border: `2px solid ${phone.length === 10 ? '#0a0a0a' : '#e8e8e8'}`, borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', cursor: phone.length === 10 ? 'pointer' : 'not-allowed', color: phone.length === 10 ? '#0a0a0a' : '#bbb', boxShadow: phone.length === 10 ? '3px 3px 0px #0a0a0a' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading
                  ? <span style={{ width: '18px', height: '18px', border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  : 'Send OTP →'}
              </button>
            </>
          )}

          {/* ── OTP step ── */}
          {step === 'otp' && (
            <>
              <div style={{ width: '52px', height: '52px', background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Phone size={22} color="#0a0a0a" />
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.25rem' }}>Enter OTP</h3>
              <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                Sent to <strong style={{ color: '#0a0a0a' }}>+91 {phone}</strong>
              </p>
              <button onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}
                style={{ border: 'none', background: 'none', color: '#888', fontSize: '0.8rem', cursor: 'pointer', padding: '0 0 1.5rem', textDecoration: 'underline', fontFamily: 'Space Grotesk, sans-serif' }}>
                Change number
              </button>

              {/* OTP boxes */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1rem' }} onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    className="otp-input"
                    ref={el => inputRefs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      width: '48px', height: '56px', textAlign: 'center',
                      fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Syne, sans-serif',
                      border: `2px solid ${error ? '#fecaca' : digit ? '#D4F53C' : '#e8e8e8'}`,
                      borderRadius: '12px', outline: 'none', background: digit ? '#f9ffe0' : '#fff',
                      color: '#0a0a0a', transition: 'all 0.15s',
                      animation: error ? 'shake 0.4s ease' : 'none',
                    }}
                  />
                ))}
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#dc2626', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  <AlertCircle size={13} /> {error}
                </div>
              )}

              {/* Dev hint */}
              <div style={{ background: '#f9ffe0', border: '1.5px dashed #D4F53C', borderRadius: '8px', padding: '8px 12px', marginBottom: '1.25rem', fontSize: '0.75rem', color: '#555', textAlign: 'center' }}>
                💡 <strong>Dev mode:</strong> Check browser console for OTP
              </div>

              <button onClick={verifyOTP} disabled={loading || otp.join('').length < 6}
                style={{ width: '100%', padding: '14px', background: otp.join('').length === 6 ? '#D4F53C' : '#f0f0f0', border: `2px solid ${otp.join('').length === 6 ? '#0a0a0a' : '#e8e8e8'}`, borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed', color: otp.join('').length === 6 ? '#0a0a0a' : '#bbb', boxShadow: otp.join('').length === 6 ? '3px 3px 0px #0a0a0a' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
                {loading
                  ? <span style={{ width: '18px', height: '18px', border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  : 'Verify OTP ✓'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button onClick={resend} disabled={resendTimer > 0}
                  style={{ border: 'none', background: 'none', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', color: resendTimer > 0 ? '#ccc' : '#555', fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <RefreshCw size={12} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}

          {/* ── Verified step ── */}
          {step === 'verified' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '64px', height: '64px', background: '#D4F53C', borderRadius: '50%', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '4px 4px 0px #0a0a0a', animation: 'successPop 0.4s ease' }}>
                <CheckCircle size={28} color="#0a0a0a" />
              </div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.5rem' }}>Number Verified!</h3>
              <p style={{ color: '#777', fontSize: '0.88rem' }}>Taking you to booking...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}