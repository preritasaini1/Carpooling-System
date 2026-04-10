import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function AuthGuard({ children }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return (
      <>
        <div
          onClick={() => setShowModal(true)}
          style={{ cursor: 'pointer' }}
        >
          {children}
        </div>
        {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return children;
}