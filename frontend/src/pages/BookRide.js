import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Calendar, Clock, ChevronDown } from 'lucide-react';

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Mathura', 'Agra',
  'Varanasi', 'Noida', 'Gurgaon', 'Chandigarh', 'Indore', 'Bhopal',
  'Nagpur', 'Surat', 'Vadodara', 'Patna', 'Dehradun', 'Haridwar',
];

function LocationInput({ label, value, onChange, placeholder, icon: Icon, iconColor }) {
  const [open, setOpen] = useState(false);
  const filtered = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0a0a0a', letterSpacing: '0.03em' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        border: open ? '2px solid #D4F53C' : '2px solid #e8e8e8',
        borderRadius: '12px', padding: '14px 16px', background: '#fff',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: open ? '0 0 0 4px rgba(212,245,60,0.15)' : 'none',
      }}>
        <Icon size={18} color={iconColor} />
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }}
        />
        {value && <button onClick={() => onChange('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1.1rem', padding: 0 }}>×</button>}
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#fff', border: '2px solid #e8e8e8', borderRadius: '12px',
          zIndex: 999, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          animation: 'dropIn 0.15s ease',
        }}>
          {filtered.slice(0, 6).map(city => (
            <div
              key={city}
              onMouseDown={() => { onChange(city); setOpen(false); }}
              style={{
                padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '0.95rem', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9ffe0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <MapPin size={14} color="#D4F53C" style={{ flexShrink: 0 }} />
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookRide() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!from || !to) return;
    setLoading(true);
    setTimeout(() => {
      navigate('/rides/results', { state: { from, to, date, time, seats } });
    }, 800);
  };

  return (
    <>
      <style>{`
        @keyframes dropIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
        .search-btn:hover { transform:translateY(-2px); box-shadow: 0 8px 24px rgba(212,245,60,0.4) !important; }
        .search-btn:active { transform:scale(0.98); }
        .seat-btn:hover { background:#D4F53C !important; color:#0a0a0a !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f9ffe0 0%,#fff 50%)', padding: '3rem 1rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'fadeUp 0.5s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#0a0a0a', color: '#D4F53C',
            borderRadius: '999px', padding: '6px 18px',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <Search size={12} /> Find Your Ride
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#0a0a0a', lineHeight: 1.1 }}>
            Where are you <span style={{ color: '#D4F53C', WebkitTextStroke: '1.5px #0a0a0a' }}>headed?</span>
          </h1>
          <p style={{ color: '#777', marginTop: '0.75rem', fontSize: '1rem' }}>
            Enter your trip details to find the perfect carpool
          </p>
        </div>

        {/* Card */}
        <div style={{
          maxWidth: '640px', margin: '0 auto',
          background: '#fff', borderRadius: '24px',
          border: '2px solid #e8e8e8',
          padding: '2.5rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.08)',
          animation: 'fadeUp 0.6s ease 0.1s both',
        }}>

          <LocationInput label="FROM" value={from} onChange={setFrom} placeholder="Pickup city" icon={MapPin} iconColor="#D4F53C" />

          {/* Swap button */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0 1rem' }}>
            <button
              onClick={() => { const t = from; setFrom(to); setTo(t); }}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#0a0a0a', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#D4F53C', fontSize: '1.1rem', transition: 'transform 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(180deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}
              title="Swap locations"
            >⇅</button>
          </div>

          <LocationInput label="TO" value={to} onChange={setTo} placeholder="Destination city" icon={MapPin} iconColor="#ff6b6b" />

          {/* Date & Time row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0a0a0a', letterSpacing: '0.03em' }}>DATE</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #e8e8e8', borderRadius: '12px', padding: '12px 14px', background: '#fff', transition: 'border-color 0.2s' }}
                onFocus={() => { }} >
                <Calendar size={16} color="#888" />
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0a0a0a', letterSpacing: '0.03em' }}>TIME</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #e8e8e8', borderRadius: '12px', padding: '12px 14px', background: '#fff' }}>
                <Clock size={16} color="#888" />
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: '#0a0a0a', background: 'transparent', fontFamily: 'Space Grotesk, sans-serif' }} />
              </div>
            </div>
          </div>

          {/* Seats */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem', color: '#0a0a0a', letterSpacing: '0.03em' }}>SEATS NEEDED</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4].map(n => (
                <button key={n} className="seat-btn"
                  onClick={() => setSeats(n)}
                  style={{
                    width: '48px', height: '48px', borderRadius: '12px', border: '2px solid',
                    borderColor: seats === n ? '#D4F53C' : '#e8e8e8',
                    background: seats === n ? '#D4F53C' : '#fff',
                    color: '#0a0a0a', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Search button */}
          <button className="search-btn"
            onClick={handleSearch}
            disabled={!from || !to || loading}
            style={{
              width: '100%', padding: '16px',
              background: from && to ? '#D4F53C' : '#f0f0f0',
              color: from && to ? '#0a0a0a' : '#aaa',
              border: '2px solid', borderColor: from && to ? '#0a0a0a' : '#e8e8e8',
              borderRadius: '14px', fontWeight: 800, fontSize: '1.05rem',
              cursor: from && to ? 'pointer' : 'not-allowed',
              fontFamily: 'Syne, sans-serif', letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s',
              boxShadow: from && to ? '4px 4px 0px #0a0a0a' : 'none',
            }}>
            {loading
              ? <><span style={{ animation: 'pulse 0.6s infinite' }}>●</span> Searching...</>
              : <><Search size={18} /> Search Rides</>
            }
          </button>
        </div>

        {/* Stats strip */}
        <div style={{
          maxWidth: '640px', margin: '2rem auto 0',
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: '1rem', animation: 'fadeUp 0.7s ease 0.2s both',
        }}>
          {[['10K+', 'Daily Rides'], ['50K+', 'Happy Riders'], ['120+', 'Cities Covered']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center', padding: '1.25rem', background: '#fff', borderRadius: '16px', border: '2px solid #e8e8e8' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#0a0a0a' }}>{num}</div>
              <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}