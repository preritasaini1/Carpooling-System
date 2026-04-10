import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, Star, ChevronRight,
  Car, Users, Wind, Music, Zap, PawPrint,
  Bookmark, BookmarkCheck, Phone, MessageCircle,
  XCircle, CheckCircle, AlertCircle, TrendingUp, IndianRupee
} from 'lucide-react';

const AMENITY_ICONS = {
  ac: <Wind size={12} />, music: <Music size={12} />,
  charging: <Zap size={12} />, pets: <PawPrint size={12} />
};

const MOCK_DATA = {
  user: { name: 'John Doe', email: 'john.doe@example.com', rating: 4.8, totalRides: 12, initials: 'JD' },

  upcoming: [
    { id: 1, from: 'Mumbai', to: 'Pune', date: 'Apr 10, 2026', time: '06:30 AM', status: 'confirmed', price: 450, driver: 'Rahul S.', driverRating: 4.9, car: 'Swift Dzire • White', amenities: ['ac', 'music'], seats: 1 },
    { id: 2, from: 'Delhi', to: 'Jaipur', date: 'Apr 12, 2026', time: '07:00 AM', status: 'pending', price: 600, driver: 'Priya M.', driverRating: 4.7, car: 'Honda City • Silver', amenities: ['ac'], seats: 2 },
    { id: 3, from: 'Agra', to: 'Lucknow', date: 'Apr 18, 2026', time: '09:15 AM', status: 'confirmed', price: 520, driver: 'Arun K.', driverRating: 4.6, car: 'Maruti Ertiga • Grey', amenities: ['ac', 'charging'], seats: 1 },
  ],

  history: [
    { id: 4, from: 'Mathura', to: 'Delhi', date: 'Mar 28, 2026', time: '08:00 AM', status: 'completed', price: 350, driver: 'Sneha P.', driverRating: 4.8, car: 'Toyota Innova • Black', amenities: ['ac', 'music', 'charging'], myRating: 5 },
    { id: 5, from: 'Delhi', to: 'Chandigarh', date: 'Mar 15, 2026', time: '06:00 AM', status: 'completed', price: 800, driver: 'Vikram T.', driverRating: 4.5, car: 'Honda Amaze • Red', amenities: ['ac'], myRating: 4 },
    { id: 6, from: 'Jaipur', to: 'Ahmedabad', date: 'Feb 20, 2026', time: '05:30 AM', status: 'cancelled', price: 950, driver: 'Meena R.', driverRating: 4.3, car: 'Tata Nexon • Blue', amenities: ['ac', 'music'], myRating: null },
  ],

  offered: [
    { id: 7, from: 'Mathura', to: 'Delhi', date: 'Apr 11, 2026', time: '07:30 AM', status: 'active', price: 380, seatsTotal: 3, seatsFilled: 2, amenities: ['ac', 'music', 'charging'], passengers: ['Riya K.', 'Amit S.'] },
    { id: 8, from: 'Delhi', to: 'Dehradun', date: 'Apr 15, 2026', time: '05:00 AM', status: 'active', price: 700, seatsTotal: 4, seatsFilled: 1, amenities: ['ac'], passengers: ['Pooja M.'] },
    { id: 9, from: 'Agra', to: 'Mathura', date: 'Mar 30, 2026', time: '10:00 AM', status: 'completed', price: 150, seatsTotal: 3, seatsFilled: 3, amenities: ['ac', 'music'], passengers: ['Rahul D.', 'Neha S.', 'Karan P.'] },
  ],

  saved: [
    { id: 10, from: 'Mumbai', to: 'Goa', date: 'May 1, 2026', time: '06:00 AM', price: 1200, driver: 'Raj K.', driverRating: 4.9, car: 'Toyota Innova • White', seats: 3, amenities: ['ac', 'music', 'pets'] },
    { id: 11, from: 'Delhi', to: 'Manali', date: 'May 10, 2026', time: '05:00 AM', price: 1500, driver: 'Arjun S.', driverRating: 4.7, car: 'Mahindra XUV500 • Black', seats: 2, amenities: ['ac', 'charging'] },
  ],
};

const STATUS_CONFIG = {
  confirmed: { bg: '#D4F53C', color: '#0a0a0a', border: '#0a0a0a', label: 'Confirmed' },
  pending:   { bg: '#fff', color: '#555', border: '#ccc', label: 'Pending' },
  completed: { bg: '#e8fff0', color: '#15803d', border: '#bbf7d0', label: 'Completed' },
  cancelled: { bg: '#fff1f0', color: '#dc2626', border: '#fecaca', label: 'Cancelled' },
  active:    { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Active' },
};

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1.5px solid ${c.border}`,
      borderRadius: '999px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>{c.label}</span>
  );
}

function StarRow({ rating, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} color="#f59e0b" fill={i <= rating ? '#f59e0b' : 'none'} />
      ))}
    </span>
  );
}

// ── TAB: Upcoming ──────────────────────────────────────────────────────────
function UpcomingTab() {
  const [expanded, setExpanded] = useState(null);
  const [cancelled, setCancelled] = useState([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {MOCK_DATA.upcoming.map((ride, i) => {
        const isExp = expanded === ride.id;
        const isCancelled = cancelled.includes(ride.id);
        return (
          <div key={ride.id} style={{
            background: '#fff', border: `2px solid ${isExp ? '#D4F53C' : '#e8e8e8'}`,
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: isExp ? '0 8px 32px rgba(212,245,60,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.25s', animation: `slideIn 0.35s ease ${i * 0.07}s both`,
          }}>
            {/* Main row */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flexWrap: 'wrap' }}
              onClick={() => setExpanded(isExp ? null : ride.id)}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f9ffe0', border: '2px solid #D4F53C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={18} color="#0a0a0a" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#0a0a0a' }}>
                  {ride.from} <span style={{ color: '#D4F53C' }}>→</span> {ride.to}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}>
                    <Calendar size={12} /> {ride.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}>
                    <Clock size={12} /> {ride.time}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {isCancelled ? <StatusBadge status="cancelled" /> : <StatusBadge status={ride.status} />}
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#D4F53C', WebkitTextStroke: '1px #0a0a0a' }}>₹{ride.price}</span>
                <ChevronRight size={16} color="#bbb" style={{ transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>

            {/* Expanded details */}
            {isExp && (
              <div style={{ borderTop: '2px solid #f0f0f0', padding: '1.25rem 1.5rem', animation: 'dropIn 0.2s ease', background: '#fafafa' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '12px', padding: '1rem' }}>
                    <p style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Driver</p>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ride.driver}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <StarRow rating={Math.round(ride.driverRating)} size={11} />
                      <span style={{ fontSize: '0.78rem', color: '#888' }}>{ride.driverRating}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '4px' }}>{ride.car}</p>
                  </div>
                  <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '12px', padding: '1rem' }}>
                    <p style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Booking</p>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ride.seats} seat{ride.seats > 1 ? 's' : ''}</p>
                    <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '4px' }}>Total: ₹{ride.price * ride.seats}</p>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {ride.amenities.map(a => (
                        <span key={a} style={{ background: '#f5f5f5', borderRadius: '999px', padding: '2px 8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px', color: '#555' }}>
                          {AMENITY_ICONS[a]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {!isCancelled && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: '2px solid #e8e8e8', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                      <Phone size={14} /> Contact Driver
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: '2px solid #e8e8e8', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                      <MessageCircle size={14} /> Message
                    </button>
                    <button onClick={() => setCancelled(p => [...p, ride.id])}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: '2px solid #fecaca', background: '#fff1f0', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', color: '#dc2626', transition: 'all 0.15s', marginLeft: 'auto' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff1f0'}>
                      <XCircle size={14} /> Cancel Ride
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── TAB: History ───────────────────────────────────────────────────────────
function HistoryTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {MOCK_DATA.history.map((ride, i) => (
        <div key={ride.id} style={{
          background: '#fff', border: '2px solid #e8e8e8', borderRadius: '20px',
          padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          animation: `slideIn 0.35s ease ${i * 0.07}s both`,
          opacity: ride.status === 'cancelled' ? 0.65 : 1,
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: ride.status === 'completed' ? '#e8fff0' : '#fff1f0', border: `2px solid ${ride.status === 'completed' ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {ride.status === 'completed' ? <CheckCircle size={18} color="#16a34a" /> : <XCircle size={18} color="#dc2626" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#0a0a0a' }}>
              {ride.from} <span style={{ color: '#D4F53C' }}>→</span> {ride.to}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}><Calendar size={12} />{ride.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}><Clock size={12} />{ride.time}</span>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>with {ride.driver}</span>
            </div>
            {ride.myRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#aaa' }}>Your rating:</span>
                <StarRow rating={ride.myRating} size={11} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            <StatusBadge status={ride.status} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: ride.status === 'cancelled' ? '#aaa' : '#0a0a0a' }}>₹{ride.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── TAB: Offered ───────────────────────────────────────────────────────────
function OfferedTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {MOCK_DATA.offered.map((ride, i) => {
        const isExp = expanded === ride.id;
        const fillPct = Math.round((ride.seatsFilled / ride.seatsTotal) * 100);
        return (
          <div key={ride.id} style={{
            background: '#fff', border: `2px solid ${isExp ? '#D4F53C' : '#e8e8e8'}`,
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: isExp ? '0 8px 32px rgba(212,245,60,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.25s', animation: `slideIn 0.35s ease ${i * 0.07}s both`,
          }}>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flexWrap: 'wrap' }}
              onClick={() => setExpanded(isExp ? null : ride.id)}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Car size={18} color="#1d4ed8" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
                  {ride.from} <span style={{ color: '#D4F53C' }}>→</span> {ride.to}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}><Calendar size={12} />{ride.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}><Clock size={12} />{ride.time}</span>
                </div>
                {/* Seat fill bar */}
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '5px', background: '#f0f0f0', borderRadius: '999px', overflow: 'hidden', maxWidth: '140px' }}>
                    <div style={{ height: '100%', width: `${fillPct}%`, background: fillPct === 100 ? '#16a34a' : '#D4F53C', borderRadius: '999px', transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap' }}>{ride.seatsFilled}/{ride.seatsTotal} seats filled</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <StatusBadge status={ride.status} />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#D4F53C', WebkitTextStroke: '1px #0a0a0a' }}>₹{ride.price}</div>
                  <div style={{ fontSize: '0.68rem', color: '#aaa' }}>/seat</div>
                </div>
                <ChevronRight size={16} color="#bbb" style={{ transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>

            {isExp && (
              <div style={{ borderTop: '2px solid #f0f0f0', padding: '1.25rem 1.5rem', background: '#fafafa', animation: 'dropIn 0.2s ease' }}>
                <p style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Passengers</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                  {ride.passengers.map((p, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '10px', padding: '10px 14px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#D4F53C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', border: '1.5px solid #0a0a0a', flexShrink: 0 }}>
                        {p.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p}</span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                        <button style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                          <Phone size={13} />
                        </button>
                        <button style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                          <MessageCircle size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: ride.seatsTotal - ride.seatsFilled }).map((_, j) => (
                    <div key={`empty-${j}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f8f8', border: '1.5px dashed #e8e8e8', borderRadius: '10px', padding: '10px 14px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f0f0f0', border: '1.5px dashed #ccc', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Empty seat</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '12px', padding: '10px 16px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Earnings so far</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>₹{ride.price * ride.seatsFilled}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── TAB: Saved ─────────────────────────────────────────────────────────────
function SavedTab() {
  const [saved, setSaved] = useState(MOCK_DATA.saved.map(r => r.id));
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {MOCK_DATA.saved.map((ride, i) => {
        const isSaved = saved.includes(ride.id);
        return (
          <div key={ride.id} style={{
            background: '#fff', border: '2px solid #e8e8e8', borderRadius: '20px',
            padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            animation: `slideIn 0.35s ease ${i * 0.07}s both`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem' }}>
                {ride.from} <span style={{ color: '#D4F53C' }}>→</span> {ride.to}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}><Calendar size={12} />{ride.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#888' }}><Clock size={12} />{ride.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#555' }}>{ride.driver}</span>
                <span style={{ fontSize: '0.72rem', color: '#aaa' }}>•</span>
                <StarRow rating={Math.round(ride.driverRating)} size={11} />
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{ride.driverRating}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
                {ride.amenities.map(a => (
                  <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f5f5', borderRadius: '999px', padding: '3px 9px', fontSize: '0.72rem', color: '#555' }}>
                    {AMENITY_ICONS[a]}
                  </span>
                ))}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f5f5', borderRadius: '999px', padding: '3px 9px', fontSize: '0.72rem', color: '#555' }}>
                  <Users size={11} /> {ride.seats} seats
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#D4F53C', WebkitTextStroke: '1px #0a0a0a' }}>₹{ride.price}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setSaved(p => isSaved ? p.filter(x => x !== ride.id) : [...p, ride.id])}
                  style={{ width: '34px', height: '34px', borderRadius: '10px', border: `2px solid ${isSaved ? '#D4F53C' : '#e8e8e8'}`, background: isSaved ? '#f9ffe0' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                  {isSaved ? <BookmarkCheck size={15} color="#0a0a0a" /> : <Bookmark size={15} color="#888" />}
                </button>
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: '#D4F53C', border: '2px solid #0a0a0a', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.15s', boxShadow: '2px 2px 0px #0a0a0a' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a'; }}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Stats bar ──────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { label: 'Total Rides', value: '12', icon: <Car size={16} /> },
    { label: 'Rides Offered', value: '3', icon: <TrendingUp size={16} /> },
    { label: 'Total Spent', value: '₹4,850', icon: <IndianRupee size={16} /> },
    { label: 'CO₂ Saved', value: '18kg', icon: '🌱' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '2rem' }}>
      {stats.map(({ label, value, icon }) => (
        <div key={label} style={{ background: '#fff', border: '2px solid #e8e8e8', borderRadius: '14px', padding: '1rem', textAlign: 'center', transition: 'border-color 0.2s, transform 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4F53C'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.transform = 'none'; }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', color: '#888', fontSize: '1rem' }}>{icon}</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#0a0a0a' }}>{value}</div>
          <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '2px' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

const TABS = ['Upcoming', 'History', 'Offered', 'Saved'];

export default function MyRides() {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = MOCK_DATA;

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '4rem' }}>

        {/* Profile header */}
        <div style={{ background: 'linear-gradient(135deg,#f9ffe0 0%,#fff 60%)', borderBottom: '2px solid #e8e8e8', padding: '2.5rem 2rem 2rem', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#D4F53C', border: '3px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', boxShadow: '4px 4px 0px #0a0a0a' }}>
                  {user.initials}
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '18px', height: '18px', borderRadius: '50%', background: '#16a34a', border: '2px solid #fff' }} />
              </div>
              {/* Info */}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#0a0a0a', marginBottom: '2px' }}>{user.name}</h1>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '6px' }}>{user.email}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={15} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.rating} rating</span>
                  <span style={{ color: '#ccc' }}>•</span>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>{user.totalRides} rides</span>
                </div>
              </div>
              <button style={{ padding: '10px 20px', borderRadius: '12px', border: '2px solid #e8e8e8', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a0a0a'; e.currentTarget.style.background = '#f9ffe0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.background = '#fff'; }}>
                Edit Profile
              </button>
            </div>
            <StatsBar />
          </div>
        </div>

        {/* Tabs + content */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem 0' }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', background: '#fff', border: '2px solid #e8e8e8', borderRadius: '14px', padding: '4px', marginBottom: '1.5rem', gap: '4px' }}>
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                  background: activeTab === i ? '#D4F53C' : 'transparent',
                  fontWeight: activeTab === i ? 800 : 600, fontSize: '0.88rem',
                  color: activeTab === i ? '#0a0a0a' : '#888',
                  cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'all 0.2s',
                  boxShadow: activeTab === i ? '2px 2px 0px #0a0a0a' : 'none',
                  border: activeTab === i ? '1.5px solid #0a0a0a' : '1.5px solid transparent',
                }}>
                {tab}
                {tab === 'Upcoming' && (
                  <span style={{ marginLeft: '6px', background: activeTab === i ? '#0a0a0a' : '#e8e8e8', color: activeTab === i ? '#D4F53C' : '#888', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
                    {MOCK_DATA.upcoming.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div key={activeTab} style={{ animation: 'fadeUp 0.25s ease' }}>
            {activeTab === 0 && <UpcomingTab />}
            {activeTab === 1 && <HistoryTab />}
            {activeTab === 2 && <OfferedTab />}
            {activeTab === 3 && <SavedTab />}
          </div>
        </div>
      </div>
    </>
  );
}