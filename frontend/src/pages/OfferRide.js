import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ChevronRight, ChevronLeft, Calendar, Clock,
  Users, Wind, Music, Zap, PawPrint, Plus, X, IndianRupee,
  CheckCircle, Car
} from 'lucide-react';

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Mathura', 'Agra',
  'Varanasi', 'Noida', 'Gurgaon', 'Chandigarh', 'Indore', 'Bhopal',
  'Nagpur', 'Surat', 'Vadodara', 'Patna', 'Dehradun', 'Haridwar',
  'Kanpur', 'Meerut', 'Allahabad', 'Faridabad', 'Ghaziabad', 'Ranchi',
];

const STEPS = [
  'Route',
  'Stopovers',
  'Schedule',
  'Seats',
  'Amenities',
  'Pricing',
];

const AMENITIES = [
  { key: 'ac', label: 'AC', icon: <Wind size={18} /> },
  { key: 'music', label: 'Music', icon: <Music size={18} /> },
  { key: 'charging', label: 'Charging Port', icon: <Zap size={18} /> },
  { key: 'pets', label: 'Pets Allowed', icon: <PawPrint size={18} /> },
];

// ── Reusable location input with dropdown ──────────────────────────────────
function LocationInput({ label, value, onChange, placeholder, iconColor = '#D4F53C' }) {
  const [open, setOpen] = useState(false);
  const filtered = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  return (
    <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
      {label && (
        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          {label}
        </label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        border: `2px solid ${open ? '#D4F53C' : '#e8e8e8'}`,
        borderRadius: '12px', padding: '13px 16px', background: '#fff',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: open ? '0 0 0 4px rgba(212,245,60,0.15)' : 'none',
      }}>
        <MapPin size={16} color={iconColor} />
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }}
        />
        {value && (
          <button onClick={() => onChange('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#bbb', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 999,
          background: '#fff', border: '2px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)', animation: 'dropIn 0.15s ease',
        }}>
          {filtered.slice(0, 6).map(city => (
            <div key={city} onMouseDown={() => { onChange(city); setOpen(false); }}
              style={{ padding: '11px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', transition: 'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9ffe0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <MapPin size={13} color="#D4F53C" />
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Step components ────────────────────────────────────────────────────────

function Step1({ data, setData }) {
  return (
    <div style={{ animation: 'stepIn 0.3s ease' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.3rem' }}>Where are you going?</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Set your starting point and destination</p>
      <LocationInput label="From" value={data.from} onChange={v => setData(p => ({ ...p, from: v }))} placeholder="Starting location" iconColor="#D4F53C" />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.25rem 0 1rem' }}>
        <button
          onClick={() => setData(p => ({ ...p, from: p.to, to: p.from }))}
          title="Swap"
          style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0a0a0a', border: 'none', cursor: 'pointer', color: '#D4F53C', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'rotate(180deg)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}
        >⇅</button>
      </div>
      <LocationInput label="To" value={data.to} onChange={v => setData(p => ({ ...p, to: v }))} placeholder="Destination" iconColor="#ff6b6b" />
    </div>
  );
}

function Step2({ data, setData }) {
  const [stopInput, setStopInput] = useState('');
  const [stopOpen, setStopOpen] = useState(false);
  const filtered = INDIAN_CITIES.filter(c => c.toLowerCase().includes(stopInput.toLowerCase()) && stopInput.length > 0);

  const addStop = (city) => {
    if (city && !data.stopovers.includes(city)) {
      setData(p => ({ ...p, stopovers: [...p.stopovers, city] }));
    }
    setStopInput('');
    setStopOpen(false);
  };

  const removeStop = (city) => setData(p => ({ ...p, stopovers: p.stopovers.filter(s => s !== city) }));

  return (
    <div style={{ animation: 'stepIn 0.3s ease' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.3rem' }}>Route & Stopovers</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Add stops along your route (optional)</p>

      {/* Route visual */}
      <div style={{ background: '#f8f8f5', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem', border: '2px solid #e8e8e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D4F53C', border: '2px solid #0a0a0a' }} />
            <div style={{ width: '2px', height: data.stopovers.length > 0 ? `${data.stopovers.length * 32 + 16}px` : '24px', background: 'repeating-linear-gradient(to bottom,#0a0a0a 0,#0a0a0a 4px,transparent 4px,transparent 8px)' }} />
            {data.stopovers.map((s, i) => (
              <div key={i} style={{ display: 'contents' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#888', border: '1.5px solid #0a0a0a' }} />
                <div style={{ width: '2px', height: '24px', background: 'repeating-linear-gradient(to bottom,#0a0a0a 0,#0a0a0a 4px,transparent 4px,transparent 8px)' }} />
              </div>
            ))}
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ff6b6b', border: '2px solid #0a0a0a' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ padding: '6px 0', fontWeight: 700, color: data.from ? '#0a0a0a' : '#bbb', fontSize: '0.95rem' }}>{data.from || 'Starting location'}</div>
            {data.stopovers.map((s, i) => (
              <div key={i} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', color: '#555' }}>{s}</span>
                <button onClick={() => removeStop(s)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
              </div>
            ))}
            <div style={{ padding: '6px 0', fontWeight: 700, color: data.to ? '#0a0a0a' : '#bbb', fontSize: '0.95rem' }}>{data.to || 'Destination'}</div>
          </div>
        </div>
      </div>

      {/* Add stopover */}
      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Add Stopover</label>
      <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', border: `2px solid ${stopOpen ? '#D4F53C' : '#e8e8e8'}`, borderRadius: '12px', padding: '11px 14px', background: '#fff', transition: 'border-color 0.2s', boxShadow: stopOpen ? '0 0 0 4px rgba(212,245,60,0.15)' : 'none' }}>
          <MapPin size={15} color="#888" />
          <input value={stopInput} onChange={e => { setStopInput(e.target.value); setStopOpen(true); }}
            onFocus={() => setStopOpen(true)} onBlur={() => setTimeout(() => setStopOpen(false), 150)}
            placeholder="Search a city to add..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.9rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }} />
        </div>
        <button onClick={() => addStop(stopInput)}
          style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#D4F53C', border: '2px solid #0a0a0a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Plus size={18} />
        </button>
        {stopOpen && filtered.length > 0 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: '54px', zIndex: 999, background: '#fff', border: '2px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', animation: 'dropIn 0.15s ease' }}>
            {filtered.slice(0, 5).map(city => (
              <div key={city} onMouseDown={() => addStop(city)}
                style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9ffe0'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <MapPin size={12} color="#D4F53C" />{city}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Step3({ data, setData }) {
  return (
    <div style={{ animation: 'stepIn 0.3s ease' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.3rem' }}>When are you leaving?</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Set your departure date and time</p>

      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Date</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #e8e8e8', borderRadius: '12px', padding: '13px 16px', background: '#fff', marginBottom: '1.25rem', transition: 'border-color 0.2s' }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#D4F53C'}
        onBlurCapture={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
        <Calendar size={16} color="#888" />
        <input type="date" value={data.date} onChange={e => setData(p => ({ ...p, date: e.target.value }))}
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }} />
      </div>

      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Time</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #e8e8e8', borderRadius: '12px', padding: '13px 16px', background: '#fff', transition: 'border-color 0.2s' }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#D4F53C'}
        onBlurCapture={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
        <Clock size={16} color="#888" />
        <input type="time" value={data.time} onChange={e => setData(p => ({ ...p, time: e.target.value }))}
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }} />
      </div>

      {data.date && data.time && (
        <div style={{ marginTop: '1.25rem', background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'dropIn 0.2s ease' }}>
          <CheckCircle size={16} color="#16a34a" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#15803d' }}>
            Departing {new Date(`${data.date}T${data.time}`).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
}

function Step4({ data, setData }) {
  return (
    <div style={{ animation: 'stepIn 0.3s ease' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.3rem' }}>How many seats?</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Choose how many passengers you can take</p>

      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#888', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Available Seats</label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <button key={n} onClick={() => setData(p => ({ ...p, seats: n }))}
            style={{
              padding: '1.25rem 0', borderRadius: '14px', border: '2px solid',
              borderColor: data.seats === n ? '#0a0a0a' : '#e8e8e8',
              background: data.seats === n ? '#D4F53C' : '#fff',
              cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '1.4rem', color: '#0a0a0a',
              transition: 'all 0.15s',
              boxShadow: data.seats === n ? '3px 3px 0px #0a0a0a' : 'none',
              transform: data.seats === n ? 'translate(-1px,-1px)' : 'none',
            }}>
            {n}
          </button>
        ))}
      </div>

      <div style={{ background: '#f8f8f5', borderRadius: '14px', padding: '1rem 1.25rem', border: '2px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: data.seats }).map((_, i) => (
            <div key={i} style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#D4F53C', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={13} />
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - data.seats) }).map((_, i) => (
            <div key={i} style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f0f0f0', border: '2px solid #e8e8e8' }} />
          ))}
        </div>
        <span style={{ fontSize: '0.88rem', color: '#555', fontWeight: 600 }}>{data.seats} seat{data.seats !== 1 ? 's' : ''} available</span>
      </div>
    </div>
  );
}

function Step5({ data, setData }) {
  const toggle = (key) => {
    setData(p => ({
      ...p,
      amenities: p.amenities.includes(key) ? p.amenities.filter(a => a !== key) : [...p.amenities, key],
    }));
  };

  return (
    <div style={{ animation: 'stepIn 0.3s ease' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.3rem' }}>What do you offer?</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Let riders know what amenities you provide</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {AMENITIES.map(({ key, label, icon }) => {
          const active = data.amenities.includes(key);
          return (
            <button key={key} onClick={() => toggle(key)}
              style={{
                padding: '1.25rem', borderRadius: '16px', border: '2px solid',
                borderColor: active ? '#0a0a0a' : '#e8e8e8',
                background: active ? '#D4F53C' : '#fff',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow: active ? '3px 3px 0px #0a0a0a' : 'none',
                transform: active ? 'translate(-1px,-1px)' : 'none',
                fontFamily: 'Space Grotesk, sans-serif',
              }}>
              <div style={{ marginBottom: '0.5rem', color: active ? '#0a0a0a' : '#888' }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a0a0a' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: active ? '#333' : '#bbb', marginTop: '2px' }}>
                {active ? '✓ Included' : 'Tap to add'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step6({ data, setData }) {
  const suggested = data.from && data.to ? 350 : 0;

  return (
    <div style={{ animation: 'stepIn 0.3s ease' }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.3rem' }}>Set your price</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Price per seat — be fair and competitive</p>

      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Price per seat (₹)</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #e8e8e8', borderRadius: '12px', padding: '13px 16px', background: '#fff', marginBottom: '0.75rem', transition: 'border-color 0.2s' }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#D4F53C'}
        onBlurCapture={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
        <IndianRupee size={16} color="#888" />
        <input type="number" min="0" value={data.price} onChange={e => setData(p => ({ ...p, price: e.target.value }))}
          placeholder="e.g. 400"
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1.1rem', fontWeight: 700, color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }} />
      </div>

      {suggested > 0 && (
        <button onClick={() => setData(p => ({ ...p, price: suggested }))}
          style={{ fontSize: '0.8rem', color: '#555', border: '1.5px dashed #D4F53C', background: '#f9ffe0', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', marginBottom: '1.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>
          💡 Suggested price: ₹{suggested}
        </button>
      )}

      {/* Summary card */}
      <div style={{ background: '#f8f8f5', border: '2px solid #e8e8e8', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase' }}>Ride Summary</div>
        {[
          ['From', data.from || '—'],
          ['To', data.to || '—'],
          ['Stopovers', data.stopovers.length > 0 ? data.stopovers.join(', ') : 'None'],
          ['Date', data.date && data.time ? `${data.date} at ${data.time}` : '—'],
          ['Seats', `${data.seats} available`],
          ['Amenities', data.amenities.length > 0 ? data.amenities.map(a => AMENITIES.find(x => x.key === a)?.label).join(', ') : 'None'],
          ['Price', data.price ? `₹${data.price}/seat` : '—'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8e8e8', fontSize: '0.9rem' }}>
            <span style={{ color: '#888', fontWeight: 500 }}>{k}</span>
            <span style={{ fontWeight: 700, color: '#0a0a0a', maxWidth: '60%', textAlign: 'right' }}>{v}</span>
          </div>
        ))}
        {data.price && (
          <div style={{ marginTop: '1rem', background: '#D4F53C', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid #0a0a0a' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Total earnings ({data.seats} seats)</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>₹{data.price * data.seats}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────
function SuccessScreen({ data, onReset }) {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', animation: 'fadeUp 0.5s ease' }}>
      <div style={{ width: '80px', height: '80px', background: '#D4F53C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid #0a0a0a', fontSize: '2rem', animation: 'successPop 0.4s ease' }}>🎉</div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', marginBottom: '0.5rem' }}>Ride Listed!</h2>
      <p style={{ color: '#777', marginBottom: '0.5rem', lineHeight: 1.6 }}>
        Your ride from <strong>{data.from}</strong> to <strong>{data.to}</strong> is now live.
      </p>
      <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '2rem' }}>Riders can now find and request your ride.</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/my-rides')}
          style={{ background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '12px', padding: '12px 28px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Syne, sans-serif', boxShadow: '3px 3px 0px #0a0a0a', transition: 'transform 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translate(-1px,-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translate(0,0)'}>
          View My Rides →
        </button>
        <button onClick={onReset}
          style={{ background: '#fff', border: '2px solid #e8e8e8', borderRadius: '12px', padding: '12px 28px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'border-color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
          Offer Another Ride
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
const INIT = { from: '', to: '', stopovers: [], date: '', time: '', seats: 2, amenities: [], price: '' };

export default function OfferRide() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INIT);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canProceed = () => {
    if (step === 0) return data.from && data.to;
    if (step === 2) return data.date && data.time;
    if (step === 5) return data.price > 0;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else {
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
    }
  };

  const handleBack = () => { if (step > 0) setStep(s => s - 1); };
  const handleReset = () => { setStep(0); setData(INIT); setSubmitted(false); };

  const stepComponents = [
    <Step1 data={data} setData={setData} />,
    <Step2 data={data} setData={setData} />,
    <Step3 data={data} setData={setData} />,
    <Step4 data={data} setData={setData} />,
    <Step5 data={data} setData={setData} />,
    <Step6 data={data} setData={setData} />,
  ];

  return (
    <>
      <style>{`
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes stepIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes successPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f9ffe0 0%,#fff 40%)', padding: '3rem 1rem 6rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {!submitted ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.25rem' }}>
                  <div style={{ width: '34px', height: '34px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Car size={16} />
                  </div>
                  <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#0a0a0a' }}>Offer a Ride</h1>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem', marginLeft: '44px' }}>
                  Step {step + 1} of {STEPS.length} — <span style={{ color: '#0a0a0a', fontWeight: 600 }}>{STEPS[step]}</span>
                </p>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '2.5rem' }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ flex: 1, height: '4px', borderRadius: '999px', background: i <= step ? '#D4F53C' : '#e8e8e8', transition: 'background 0.3s', cursor: i < step ? 'pointer' : 'default', border: i === step ? '1px solid #0a0a0a' : 'none' }}
                    onClick={() => { if (i < step) setStep(i); }} />
                ))}
              </div>

              {/* Step card */}
              <div style={{
                background: '#fff', border: '2px solid #e8e8e8', borderRadius: '24px',
                padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                marginBottom: '1.5rem', minHeight: '320px',
              }}>
                {stepComponents[step]}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={handleBack} disabled={step === 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '12px 22px', borderRadius: '12px',
                    border: '2px solid', borderColor: step === 0 ? '#f0f0f0' : '#e8e8e8',
                    background: '#fff', color: step === 0 ? '#ccc' : '#555',
                    cursor: step === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Space Grotesk, sans-serif',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (step > 0) e.currentTarget.style.borderColor = '#0a0a0a'; }}
                  onMouseLeave={e => e.currentTarget.style.borderColor = step === 0 ? '#f0f0f0' : '#e8e8e8'}>
                  <ChevronLeft size={16} /> Back
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Step dots */}
                  {STEPS.map((_, i) => (
                    <div key={i} style={{ width: i === step ? '20px' : '6px', height: '6px', borderRadius: '999px', background: i === step ? '#0a0a0a' : i < step ? '#D4F53C' : '#e8e8e8', transition: 'all 0.3s', border: i < step ? '1px solid #0a0a0a' : 'none' }} />
                  ))}
                </div>

                <button onClick={handleNext} disabled={!canProceed() || submitting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px 26px', borderRadius: '12px',
                    background: canProceed() ? '#D4F53C' : '#f0f0f0',
                    border: '2px solid', borderColor: canProceed() ? '#0a0a0a' : '#e8e8e8',
                    color: canProceed() ? '#0a0a0a' : '#bbb',
                    cursor: canProceed() ? 'pointer' : 'not-allowed',
                    fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Syne, sans-serif',
                    boxShadow: canProceed() ? '3px 3px 0px #0a0a0a' : 'none',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (canProceed()) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '5px 5px 0px #0a0a0a'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = canProceed() ? '3px 3px 0px #0a0a0a' : 'none'; }}>
                  {submitting
                    ? <><span style={{ display: 'inline-block', animation: 'spin 0.7s linear infinite' }}>◌</span> Posting...</>
                    : step === STEPS.length - 1
                      ? <>Post Ride 🚀</>
                      : <>Next <ChevronRight size={16} /></>
                  }
                </button>
              </div>
            </>
          ) : (
            <SuccessScreen data={data} onReset={handleReset} />
          )}
        </div>
      </div>
    </>
  );
}