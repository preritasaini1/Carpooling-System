import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Users, Wind, Music, Zap, PawPrint, ChevronDown, SlidersHorizontal, ArrowLeft } from 'lucide-react';

const MOCK_RIDES = [
  { id: 1, driver: 'Rahul S.', rating: 4.9, reviews: 128, from: 'Mathura', to: 'Delhi', departure: '07:30 AM', arrival: '10:00 AM', seats: 3, price: 350, car: 'Swift Dzire • White', amenities: ['ac', 'music', 'charging'], verified: true, match: 97 },
  { id: 2, driver: 'Priya M.', rating: 4.7, reviews: 89, from: 'Mathura', to: 'Delhi', departure: '09:00 AM', arrival: '11:45 AM', seats: 2, price: 300, car: 'Honda City • Silver', amenities: ['ac', 'music'], verified: true, match: 91 },
  { id: 3, driver: 'Arun K.', rating: 4.5, reviews: 54, from: 'Mathura', to: 'Delhi', departure: '11:30 AM', arrival: '02:30 PM', seats: 4, price: 280, car: 'Maruti Ertiga • Grey', amenities: ['ac', 'pets'], verified: false, match: 85 },
  { id: 4, driver: 'Sneha P.', rating: 4.8, reviews: 201, from: 'Mathura', to: 'Delhi', departure: '06:00 AM', arrival: '08:30 AM', seats: 1, price: 400, car: 'Toyota Innova • Black', amenities: ['ac', 'music', 'charging', 'pets'], verified: true, match: 99 },
];

const AMENITY_ICONS = { ac: <Wind size={14} />, music: <Music size={14} />, charging: <Zap size={14} />, pets: <PawPrint size={14} /> };
const AMENITY_LABELS = { ac: 'AC', music: 'Music', charging: 'Charging', pets: 'Pets OK' };

export default function RideResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const from = state?.from || 'Mathura';
  const to = state?.to || 'Delhi';

  const [sortBy, setSortBy] = useState('match');
  const [filterAmenities, setFilterAmenities] = useState([]);
  const [minSeats, setMinSeats] = useState(1);
  const [selectedRide, setSelectedRide] = useState(null);
  const [booked, setBooked] = useState(false);

  const toggleAmenity = a => setFilterAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const filtered = MOCK_RIDES
    .filter(r => r.seats >= minSeats)
    .filter(r => filterAmenities.every(a => r.amenities.includes(a)))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return a.departure.localeCompare(b.departure);
      return b.match - a.match;
    });

  const handleBook = (ride) => {
  navigate('/book', { state: { ride } });
};
  const confirmBook = () => setBooked(true);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes successPop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
        .ride-card:hover .book-btn { background:#D4F53C !important; border-color:#0a0a0a !important; }
        .ride-card { transition: transform 0.2s, box-shadow 0.2s; }
        .ride-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.1) !important; }
        .filter-check:hover { border-color:#D4F53C !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '2px solid #e8e8e8', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/rides')} style={{ border: '2px solid #e8e8e8', background: '#fff', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Space Grotesk, sans-serif', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#D4F53C'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#0a0a0a' }}>Available Rides</h2>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} color="#D4F53C" /> {from} <span style={{ color: '#D4F53C' }}>→</span> {to} · {filtered.length} rides found
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, gap: 0 }}>

          {/* Sidebar */}
          <aside style={{ width: '280px', flexShrink: 0, background: '#fff', borderRight: '2px solid #e8e8e8', padding: '1.5rem', overflowY: 'auto' }}>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#aaa', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Sort By</p>
              <div style={{ position: 'relative' }}>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ width: '100%', padding: '10px 36px 10px 12px', border: '2px solid #e8e8e8', borderRadius: '10px', fontSize: '0.9rem', color: '#0a0a0a', background: '#fff', appearance: 'none', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', outline: 'none' }}>
                  <option value="match">Best Match</option>
                  <option value="price">Lowest Price</option>
                  <option value="rating">Top Rated</option>
                  <option value="time">Earliest Departure</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }} />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#aaa', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Amenities</p>
              {['ac', 'music', 'charging', 'pets'].map(a => (
                <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#333' }}>
                  <div className="filter-check"
                    onClick={() => toggleAmenity(a)}
                    style={{
                      width: '20px', height: '20px', borderRadius: '6px', border: '2px solid',
                      borderColor: filterAmenities.includes(a) ? '#D4F53C' : '#ddd',
                      background: filterAmenities.includes(a) ? '#D4F53C' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s', cursor: 'pointer',
                    }}>
                    {filterAmenities.includes(a) && <span style={{ fontSize: '11px', fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ color: '#888' }}>{AMENITY_ICONS[a]}</span>
                  <span style={{ fontWeight: 500 }}>{AMENITY_LABELS[a]}</span>
                </label>
              ))}
            </div>

            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', color: '#aaa', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Min Seats Available</p>
              <input type="range" min="1" max="4" value={minSeats} onChange={e => setMinSeats(+e.target.value)}
                style={{ width: '100%', accentColor: '#D4F53C' }} />
              <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '6px', fontWeight: 600 }}>{minSeats}+ seat{minSeats > 1 ? 's' : ''}</p>
            </div>
          </aside>

          {/* Results */}
          <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0a0a0a', marginBottom: '0.5rem' }}>No rides found</h3>
                <p style={{ color: '#888' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filtered.map((ride, i) => (
                  <div key={ride.id} className="ride-card"
                    style={{
                      background: '#fff', borderRadius: '20px', border: '2px solid #e8e8e8',
                      padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      animation: `slideIn 0.4s ease ${i * 0.08}s both`,
                    }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      {/* Left: driver info */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#D4F53C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#0a0a0a', flexShrink: 0 }}>
                          {ride.driver[0]}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{ride.driver}</span>
                            {ride.verified && (
                              <span style={{ background: '#e8fff0', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>✓ Verified</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <Star size={12} color="#f59e0b" fill="#f59e0b" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ride.rating}</span>
                            <span style={{ fontSize: '0.8rem', color: '#aaa' }}>({ride.reviews})</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '2px' }}>{ride.car}</p>
                        </div>
                      </div>

                      {/* Right: price */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#0a0a0a' }}>₹{ride.price}</div>
                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>per seat</div>
                        <div style={{ marginTop: '6px', background: '#f0fdf4', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>{ride.match}% match</div>
                      </div>
                    </div>

                    {/* Route */}
                    <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{ride.departure}</div>
                        <div style={{ fontSize: '0.78rem', color: '#888' }}>{ride.from}</div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg,#D4F53C,#0a0a0a)' }} />
                        <div style={{ background: '#D4F53C', borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700, border: '1.5px solid #0a0a0a' }}>🚗 DIRECT</div>
                        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg,#0a0a0a,#D4F53C)' }} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{ride.arrival}</div>
                        <div style={{ fontSize: '0.78rem', color: '#888' }}>{ride.to}</div>
                      </div>
                    </div>

                    {/* Amenities + seats + button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {ride.amenities.map(a => (
                          <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f5f5', borderRadius: '999px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 500, color: '#555' }}>
                            {AMENITY_ICONS[a]} {AMENITY_LABELS[a]}
                          </span>
                        ))}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f5f5', borderRadius: '999px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 500, color: '#555' }}>
                          <Users size={12} /> {ride.seats} seats left
                        </span>
                      </div>
                      <button className="book-btn"
                        onClick={() => handleBook(ride)}
                        style={{
                          background: '#0a0a0a', color: '#fff', border: '2px solid #0a0a0a',
                          borderRadius: '12px', padding: '10px 24px', fontWeight: 700,
                          fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                          transition: 'all 0.2s', color: '#D4F53C',
                        }}>
                        Book Seat →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedRide(null); }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', maxWidth: '480px', width: '100%', animation: 'modalIn 0.25s ease', border: '2px solid #e8e8e8' }}>

            {!booked ? (
              <>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Confirm Booking</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Review your ride details before confirming</p>

                <div style={{ background: '#f9ffe0', border: '2px solid #D4F53C', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Driver</span>
                    <span style={{ fontWeight: 700 }}>{selectedRide.driver}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Route</span>
                    <span style={{ fontWeight: 700 }}>{selectedRide.from} → {selectedRide.to}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Departure</span>
                    <span style={{ fontWeight: 700 }}>{selectedRide.departure}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #D4F53C', paddingTop: '0.75rem' }}>
                    <span style={{ color: '#0a0a0a', fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem' }}>₹{selectedRide.price}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => setSelectedRide(null)}
                    style={{ flex: 1, padding: '13px', border: '2px solid #e8e8e8', borderRadius: '12px', background: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', color: '#555', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#ccc'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                    Cancel
                  </button>
                  <button onClick={confirmBook}
                    style={{ flex: 2, padding: '13px', background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontSize: '0.95rem', boxShadow: '3px 3px 0px #0a0a0a', transition: 'transform 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translate(-1px,-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translate(0,0)'}>
                    Confirm & Book ✓
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '72px', height: '72px', background: '#D4F53C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem', border: '2px solid #0a0a0a', animation: 'successPop 0.4s ease' }}>✓</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ride Booked!</h3>
                <p style={{ color: '#777', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Your seat with <strong>{selectedRide.driver}</strong> has been confirmed.<br />Check My Rides for details.
                </p>
                <button onClick={() => { setSelectedRide(null); navigate('/my-rides'); }}
                  style={{ background: '#D4F53C', border: '2px solid #0a0a0a', borderRadius: '12px', padding: '12px 32px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Syne, sans-serif', boxShadow: '3px 3px 0px #0a0a0a' }}>
                  View My Rides →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}