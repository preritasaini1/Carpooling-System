import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';

const navStyles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e8e8e8',
    padding: '0 2rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#0a0a0a',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: '#D4F53C',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    listStyle: 'none',
  },
  link: {
    color: '#555',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  ctaBtn: {
    background: '#D4F53C',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 20px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'Space Grotesk, sans-serif',
    transition: 'background 0.2s, transform 0.1s',
  },
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={navStyles.nav}>
      <Link to="/" style={navStyles.logo}>
        <div style={navStyles.logoIcon}>
          <Car size={18} color="#0a0a0a" />
        </div>
        CarPooler
      </Link>

      <ul style={navStyles.links}>
        <li><Link to="/rides" style={navStyles.link}>Book Ride</Link></li>
        <li><Link to="/offer" style={navStyles.link}>Offer Ride</Link></li>
        <li><Link to="/my-rides" style={navStyles.link}>My Rides</Link></li>
        <li>
          <button
            style={navStyles.ctaBtn}
            onMouseEnter={e => e.target.style.background = '#c2e032'}
            onMouseLeave={e => e.target.style.background = '#D4F53C'}
          >
            Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
}