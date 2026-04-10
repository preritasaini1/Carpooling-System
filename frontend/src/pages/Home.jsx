import { MapPin, Car, ShieldCheck, Users, Clock, Leaf, Sofa } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Verified Drivers',
    desc: 'All drivers are verified for your safety',
  },
  {
    icon: <Users size={22} />,
    title: 'Share & Save',
    desc: 'Split costs and travel together',
  },
  {
    icon: <MapPin size={22} />,
    title: 'Door to Door',
    desc: 'Convenient pickup and drop points',
  },
  {
    icon: <Clock size={22} />,
    title: 'Flexible Times',
    desc: 'Find rides that match your schedule',
  },
  {
    icon: <Leaf size={22} />,
    title: 'Eco Friendly',
    desc: 'Reduce carbon footprint by sharing rides',
  },
  {
    icon: <Sofa size={22} />,
    title: 'Comfortable',
    desc: 'Travel in comfort with amenities you choose',
  },
];

export default function Home() {
  return (
    <main>
      {/* ── HERO ── */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(160deg, #f9ffe0 0%, #ffffff 60%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,245,60,0.18) 0%, transparent 70%)',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '700px' }}>
          <div style={{
            display: 'inline-block',
            background: '#0a0a0a',
            color: '#D4F53C',
            borderRadius: '999px',
            padding: '6px 18px',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            🌍 Eco-Friendly Ride Sharing
          </div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            color: '#0a0a0a',
          }}>
            Share your ride,{' '}
            <span style={{ color: '#D4F53C', WebkitTextStroke: '2px #0a0a0a' }}>
              save the planet
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#555',
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            Find affordable rides or offer seats in your car. Join thousands of travellers carpooling every day.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rides" style={{
              background: '#D4F53C',
              color: '#0a0a0a',
              border: '2px solid #0a0a0a',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '4px 4px 0px #0a0a0a',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(-2px,-2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0px #0a0a0a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translate(0,0)';
                e.currentTarget.style.boxShadow = '4px 4px 0px #0a0a0a';
              }}
            >
              <MapPin size={18} /> Book a Ride
            </Link>

            <Link to="/offer" style={{
              background: 'transparent',
              color: '#0a0a0a',
              border: '2px solid #0a0a0a',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Car size={18} /> Offer a Ride
            </Link>
          </div>

          <div style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            fontSize: '0.85rem',
            color: '#888',
          }}>
            <Link to="/login" style={{ color: '#555', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
            <Link to="/signup" style={{ color: '#555', textDecoration: 'none', fontWeight: 500 }}>Sign Up</Link>
          </div>
        </div>
      </section>

      {/* ── WHY CARPOOLER ── */}
      <section style={{
        padding: '6rem 2rem',
        background: '#f8f8f5',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#0a0a0a',
              marginBottom: '0.75rem',
            }}>
              Why CarPooler?
            </h2>
            <p style={{ color: '#777', fontSize: '1rem' }}>
              Everything you need for smarter, safer travel
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#ffffff',
                border: '1.5px solid #e8e8e8',
                borderRadius: '16px',
                padding: '2rem',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#D4F53C';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#D4F53C',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: '#0a0a0a',
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                  color: '#0a0a0a',
                }}>
                  {f.title}
                </h3>
                <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{
        padding: '6rem 2rem',
        background: '#0a0a0a',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#ffffff',
            marginBottom: '1rem',
          }}>
            Ready to get started?
          </h2>
          <p style={{
            color: '#888',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            Whether you're looking for a ride or have empty seats, CarPooler connects you with fellow travellers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              background: '#D4F53C',
              color: '#0a0a0a',
              border: '2px solid #D4F53C',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#c2e032'}
              onMouseLeave={e => e.currentTarget.style.background = '#D4F53C'}
            >
              Create an Account
            </Link>
            <Link to="/rides" style={{
              background: 'transparent',
              color: '#ffffff',
              border: '2px solid #444',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#888'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#444'}
            >
              Browse Rides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}