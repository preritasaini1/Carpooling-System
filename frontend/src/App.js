import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookRide from './pages/BookRide';
import RideResults from './pages/RideResults';
import OfferRide from './pages/OfferRide';
import MyRides from './pages/MyRides';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookingFlow from './pages/BookingFlow';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rides" element={<BookRide />} />
          <Route path="/rides/results" element={<RideResults />} />
          <Route path="/offer" element={<OfferRide />} />
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book" element={<BookingFlow />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;