import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, Star, Users, Wind, Music,
  Zap, PawPrint, ChevronRight, CreditCard, Smartphone,
  Banknote, CheckCircle, AlertCircle, Shield, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import OTPVerification from '../components/OTPVerification';

const AMENITY_ICONS = {
  ac: <Wind size={13} />, music: <Music size={13} />,
  charging: <Zap size={13} />, pets: <PawPrint size={13} />
};
const AMENITY_LABELS = { ac: 'AC', music: 'Music', charging: 'Charging', pets: 'Pets OK' };

const STEPS = ['Login', 'Verify', 'Review', 'Payment', 'Confirmed'];

export default function BookingFlow() {
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const ride = state?.ride;

  // Determine initial step
  const getInitialStep = () => {
    if (!user) return 0;
    if (!user.phoneVerified) return 1;
    return 2;
  };

  const [step, setStep] = useState(getInitialStep);
  const [payMethod, setPayMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingId] = useState(`CP${Date.now().toString().slice(-8)}`);

  if (!ride) {
    navigate('/rides');
    return null;
  }

  // ── STEP 0: Login ──
  if (step === 0) {
    return (
      <LoginModal
        onClose={() => navigate(-1)}
        onSuccess={() => setStep(1)}
      />
    );
  }

  // ── STEP 1: OTP ──
  if (step === 1) {
    return (
      <OTPVerification
        onVerified={() => setStep(2)}
        onClose={() => navigate(-1)}
      />
    );
  }

  // ── Razorpay handler ──
  const handleRazorpay = () => {
    const options = {
      key: 'rzp_test_SbkBJbW4qAoYJu', // ← Replace with your Razorpay key
      amount: ride.price * 100, // paise
      currency: 'INR',
      name: 'CarPooler',
      description: `${ride.from} → ${ride.to}`,
      image: '', // optional logo URL
      handler: function (response) {
        // Payment success
        console.log('Razorpay success:', response);
        setStep(4);
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      notes: {
        ride_id: ride.id,
        booking_id: bookingId,
        from: ride.from,
        to: ride.to,
      },
      theme: { color: '#D4F53C' },
      modal: {
        ondismiss: () => {
          setProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
      setProcessing(false);
    });
    rzp.open();
  };

  const handlePayment = () => {
    if (!payMethod) return;
    setProcessing(true);
    if (payMethod === 'online') {
      handleRazorpay();
    } else {
      // Cash — simulate confirmation
      setTimeout(() => { setProcessing(false); setStep(4); }, 1000);
    }
  };

  const s = (n) => ({
    wrapper: {
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(160deg,#f9ffe0 0%,#fff 50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '2.5rem 1rem 4rem',
    },
    card: {
      background: '#fff', border: '2px solid #e8e8e8',
      borderRadius: '24px', padding: '2.5rem',
      width: '100%', maxWidth: '540px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
    },
  });

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes stepIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes successPop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes confetti { 0%{transform:translateY(0) rotate(0)} 100%{transform:translateY(-60px) rotate(360deg);opacity:0} }
        .pay-btn:hover      { transform:translate(-2px,-2px) !important; box-shadow:6px 6px 0px #0a0a0a !important; }
      `}</style>

      <div style={s().wrapper}>

        {/* Progress stepper */}
        <div style={{ width: '100%', maxWidth: '540px', marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {['Review', 'Payment', 'Done'].map((label, i) => {
              const idx = i + 2;
              const active = step === idx;
              const done = step > idx;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'initial' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: done ? '#D4F53C' : active ? '#0a0a0a' : '#f0f0f0',
                      border: `2px solid ${done || active ? '#0a0a0a' : '#e8e8e8'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.85rem',
                      color: done ? '#0a0a0a' : active ? '#D4F53C' : '#aaa',
                      transition: 'all 0.3s',
                      boxShadow: active ? '2px 2px 0px #0a0a0a' : 'none',
                    }}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: active ? '#0a0a0a' : '#aaa' }}>{label}</span>
                  </div>
                  {i < 2 && (
                    <div style={{ flex: 1, height: '2px', background: done ? '#D4F53C' : '#e8e8e8', margin: '0 8px', marginBottom: '20px', transition: 'background 0.3s' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STEP 2: Review ── */}
        {step === 2 && (
          <div style={{ ...s().card, animation: 'stepIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Review Your Ride</h2>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem' }}>Confirm details before payment</p>

            {/* Driver card */}
            <div style={{ background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#D4F53C', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                  {ride.driver[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700 }}>{ride.driver}</span>
                    {ride.verified && <span style={{ background: '#e8fff0', color: '#16a34a', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>✓ Verified</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Star size={11} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ride.driverRating}</span>
                    <span style={{ fontSize: '0.75rem', color: '#aaa' }}>• {ride.car}</span>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1.5px solid #e8e8e8' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{ride.departure}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{ride.from}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg,#D4F53C,#0a0a0a)' }} />
                  <span style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600 }}>DIRECT</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{ride.arrival}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{ride.to}</div>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  ['Date', new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                  ['Seat', '1 passenger'],
                  ['Match', `${ride.match}%`],
                  ['Amenities', ride.amenities.map(a => AMENITY_LABELS[a]).join(', ')],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: '#fff', borderRadius: '10px', padding: '8px 12px', border: '1.5px solid #e8e8e8' }}>
                    <div style={{ fontSize: '0.68rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>{k}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a0a0a' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fare breakdown */}
            <div style={{ border: '2px solid #e8e8e8', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Fare Breakdown</p>
              {[
                ['Base fare', `₹${ride.price}`],
                ['Service fee', '₹20'],
                ['GST (5%)', `₹${Math.round(ride.price * 0.05)}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#555', marginBottom: '6px' }}>
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '2px solid #e8e8e8', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#D4F53C', WebkitTextStroke: '1px #0a0a0a' }}>
                  ₹{ride.price + 20 + Math.round(ride.price * 0.05)}
                </span>
              </div>
            </div>

            {/* Passenger info */}
            <div style={{ background: '#f8f8f5', border: '2px solid #e8e8e8', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.75rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Passenger</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#D4F53C', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.85rem' }}>
                  {user?.initials}
                </div>
                <div>
                  <p style={{ fontWeight: 700 }}>{user?.name}</p>
                  <p style={{ fontSize: '0.78rem', color: '#888' }}>{user?.email}</p>
                  <p style={{ fontSize: '0.78rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <CheckCircle size={12} /> {user?.phone} verified
                  </p>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(3)}
              style={{ width: '100%', padding: '15px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '14px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '4px 4px 0px #0a0a0a', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px #0a0a0a'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #0a0a0a'; }}>
              Proceed to Payment <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 3: Payment ── */}
        {step === 3 && (
          <div style={{ ...s().card, animation: 'stepIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Choose Payment</h2>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.75rem' }}>Select how you'd like to pay</p>

            {/* Amount pill */}
            <div style={{ background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '12px', padding: '12px 16px', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>Amount to pay</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem' }}>
                ₹{ride.price + 20 + Math.round(ride.price * 0.05)}
              </span>
            </div>

            {/* Payment options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
              {[
                {
                  key: 'online', icon: <CreditCard size={22} />,
                  label: 'Pay Online', sub: 'UPI, Cards, Net Banking via Razorpay',
                  badge: 'RECOMMENDED', badgeBg: '#D4F53C',
                },
                {
                  key: 'upi', icon: <Smartphone size={22} />,
                  label: 'UPI / QR', sub: 'GPay, PhonePe, Paytm, BHIM',
                  badge: null,
                },
                {
                  key: 'cash', icon: <Banknote size={22} />,
                  label: 'Pay in Cash', sub: 'Pay driver directly at pickup',
                  badge: null,
                },
              ].map(({ key, icon, label, sub, badge, badgeBg }) => (
                <button key={key} onClick={() => setPayMethod(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '1.1rem 1.25rem', borderRadius: '16px',
                    border: `2px solid ${payMethod === key ? '#0a0a0a' : '#e8e8e8'}`,
                    background: payMethod === key ? '#f9ffe0' : '#fff',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.15s',
                    boxShadow: payMethod === key ? '3px 3px 0px #0a0a0a' : 'none',
                    transform: payMethod === key ? 'translate(-1px,-1px)' : 'none',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: payMethod === key ? '#D4F53C' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s', border: payMethod === key ? '1.5px solid #0a0a0a' : 'none' }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a0a0a' }}>{label}</span>
                      {badge && <span style={{ background: badgeBg, color: '#0a0a0a', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', border: '1.5px solid #0a0a0a' }}>{badge}</span>}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>{sub}</p>
                  </div>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${payMethod === key ? '#0a0a0a' : '#e8e8e8'}`, background: payMethod === key ? '#D4F53C' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                    {payMethod === key && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0a0a0a' }} />}
                  </div>
                </button>
              ))}
            </div>

            {/* Razorpay note */}
            {payMethod === 'online' && (
              <div style={{ background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: '12px', padding: '12px 14px', marginBottom: '1.25rem', display: 'flex', gap: '10px', animation: 'fadeUp 0.2s ease' }}>
                <Shield size={16} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1d4ed8' }}>Secured by Razorpay</p>
                  <p style={{ fontSize: '0.76rem', color: '#3b82f6', marginTop: '2px' }}>256-bit SSL encryption • PCI DSS compliant</p>
                </div>
              </div>
            )}

            {payMethod === 'upi' && (
              <div style={{ background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '12px', padding: '12px 14px', marginBottom: '1.25rem', animation: 'fadeUp 0.2s ease' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0a0a0a' }}>UPI via Razorpay</p>
                <p style={{ fontSize: '0.76rem', color: '#555', marginTop: '2px' }}>You'll be redirected to choose your UPI app</p>
              </div>
            )}

            {payMethod === 'cash' && (
              <div style={{ background: '#f8f8f5', border: '2px solid #e8e8e8', borderRadius: '12px', padding: '12px 14px', marginBottom: '1.25rem', animation: 'fadeUp 0.2s ease' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#555' }}>⚠️ Cash payment</p>
                <p style={{ fontSize: '0.76rem', color: '#888', marginTop: '2px' }}>Please carry exact change. Ride is confirmed only after cash is paid.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(2)}
                style={{ padding: '14px 20px', border: '2px solid #e8e8e8', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', transition: 'border-color 0.15s', fontSize: '0.9rem' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                ← Back
              </button>
              <button className="pay-btn" onClick={handlePayment} disabled={!payMethod || processing}
                style={{
                  flex: 1, padding: '14px', background: payMethod ? '#D4F53C' : '#f0f0f0',
                  border: `2px solid ${payMethod ? '#0a0a0a' : '#e8e8e8'}`,
                  borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 800,
                  fontSize: '0.95rem', cursor: payMethod ? 'pointer' : 'not-allowed',
                  color: payMethod ? '#0a0a0a' : '#bbb',
                  boxShadow: payMethod ? '4px 4px 0px #0a0a0a' : 'none',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                {processing
                  ? <span style={{ width: '18px', height: '18px', border: '2px solid #0a0a0a', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  : payMethod === 'online' || payMethod === 'upi'
                    ? <><CreditCard size={16} /> Pay ₹{ride.price + 20 + Math.round(ride.price * 0.05)}</>
                    : payMethod === 'cash'
                      ? '✓ Confirm Booking'
                      : 'Select Payment'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Confirmed ── */}
        {step === 4 && (
          <div style={{ ...s().card, textAlign: 'center', animation: 'fadeUp 0.5s ease' }}>
            {/* Confetti dots */}
            <div style={{ position: 'relative', height: '80px', marginBottom: '0.5rem' }}>
              {['#D4F53C','#0a0a0a','#ff6b6b','#D4F53C','#888'].map((color, i) => (
                <div key={i} style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: color, left: `${15 + i * 17}%`, top: '20px', animation: `confetti 0.8s ease ${i * 0.1}s both` }} />
              ))}
              <div style={{ width: '72px', height: '72px', background: '#D4F53C', borderRadius: '50%', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto', boxShadow: '4px 4px 0px #0a0a0a', animation: 'successPop 0.4s ease 0.2s both' }}>🎉</div>
            </div>

            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Ride Confirmed!</h2>
            <p style={{ color: '#777', marginBottom: '0.25rem' }}>Your seat has been booked successfully.</p>
            <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '1.75rem' }}>Booking ID: <strong style={{ color: '#0a0a0a' }}>{bookingId}</strong></p>

            {/* Summary pill */}
            <div style={{ background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>{ride.from} → {ride.to}</span>
                <span style={{ background: '#D4F53C', border: '1.5px solid #0a0a0a', borderRadius: '999px', padding: '2px 12px', fontSize: '0.72rem', fontWeight: 800 }}>CONFIRMED</span>
              </div>
              {[
                ['Driver', ride.driver],
                ['Departure', `${ride.date || 'Today'} at ${ride.departure}`],
                ['Payment', payMethod === 'cash' ? 'Cash on pickup' : `Paid ₹${ride.price + 20 + Math.round(ride.price * 0.05)}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>
                  <span style={{ color: '#888' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => navigate('/my-rides')}
                style={{ padding: '14px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '3px 3px 0px #0a0a0a', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '5px 5px 0px #0a0a0a'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }}>
                View My Rides →
              </button>
              <button onClick={() => navigate('/')}
                style={{ padding: '13px', background: '#fff', border: '2px solid #e8e8e8', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}