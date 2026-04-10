import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookRide from './pages/BookRide';
import RideResults from './pages/RideResults';
import OfferRide from './pages/OfferRide';
import MyRides from './pages/MyRides';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rides" element={<BookRide />} />
        <Route path="/rides/results" element={<RideResults />} />
        <Route path="/offer" element={<OfferRide />} />
        <Route path="/my-rides" element={<MyRides />} />
      </Routes>
    </Router>
  );
}

export default App;