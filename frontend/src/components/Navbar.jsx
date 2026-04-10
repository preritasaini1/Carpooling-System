import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('carpooler_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = () => {
    localStorage.removeItem('carpooler_user');
    setUser(null);
    setDropOpen(false);
    navigate('/');
  };

  return (
    <>
      <style>{`
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .nav-link:hover { color:#0a0a0a !important; }
        .drop-item:hover { background:#f9ffe0 !important; }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '2px solid #e8e8e8', padding: '0 2rem',
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', background: '#D4F53C', borderRadius: '8px', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #0a0a0a' }}>
            <Car size={16} color="#0a0a0a" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#0a0a0a' }}>CarPooler</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/rides" className="nav-link" style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.15s' }}>Book Ride</Link>
          <Link to="/offer" className="nav-link" style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.15s' }}>Offer Ride</Link>
          <Link to="/my-rides" className="nav-link" style={{ color: '#555', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.15s' }}>My Rides</Link>

          {user ? (
            /* ── Logged-in avatar + dropdown ── */
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(p => !p)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: dropOpen ? '#f9ffe0' : '#fff', border: `2px solid ${dropOpen ? '#D4F53C' : '#e8e8e8'}`, borderRadius: '10px', padding: '6px 10px 6px 6px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Space Grotesk, sans-serif' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#D4F53C', border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.7rem' }}>
                  {user.initials}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0a0a0a' }}>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} color="#888" style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {dropOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '2px solid #e8e8e8', borderRadius: '16px', minWidth: '200px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', overflow: 'hidden', animation: 'dropIn 0.15s ease', zIndex: 200 }}>
                  {/* User info */}
                  <div style={{ padding: '14px 16px', borderBottom: '2px solid #f0f0f0', background: '#f9ffe0' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a0a0a' }}>{user.name}</p>
                    <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>{user.email}</p>
                    {user.rating && (
                      <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px', fontWeight: 600 }}>⭐ {user.rating} · {user.totalRides} rides</p>
                    )}
                  </div>

                  {[
                    { icon: <User size={14} />, label: 'My Rides', to: '/my-rides' },
                    { icon: <Settings size={14} />, label: 'Settings', to: '/settings' },
                  ].map(({ icon, label, to }) => (
                    <Link key={label} to={to} onClick={() => setDropOpen(false)} className="drop-item"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '0.88rem', fontWeight: 500, transition: 'background 0.12s' }}>
                      <span style={{ color: '#888' }}>{icon}</span> {label}
                    </Link>
                  ))}

                  <div style={{ borderTop: '2px solid #f0f0f0' }}>
                    <button onClick={logout} className="drop-item"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', border: 'none', background: '#fff', cursor: 'pointer', color: '#dc2626', fontSize: '0.88rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', transition: 'background 0.12s', textAlign: 'left' }}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest buttons ── */
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login"
                style={{ padding: '8px 16px', borderRadius: '8px', border: '2px solid #e8e8e8', background: '#fff', color: '#555', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}>
                Login
              </Link>
              <Link to="/signup"
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#D4F53C', border: '2px solid #0a0a0a', color: '#0a0a0a', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', boxShadow: '2px 2px 0px #0a0a0a', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #0a0a0a'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px #0a0a0a'; }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}