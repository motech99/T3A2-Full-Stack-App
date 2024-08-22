import { Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import { useLocation } from 'react-router-dom';
import { Booking } from './pages/Booking';
import { Equipment } from './pages/Equipment';
import { Prices } from './pages/Prices';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Footer } from './Footer';
import { Home } from './Home';


function App() {
  const location = useLocation();

  const footerPaths = ['/', '/signup', '/login'];

  return (
    <div className='is-flex is-flex-direction-column min-vh-100'>
      <NavBar />
      <Home />
      <div className='is-flex-grow-1'>
        <Routes>
          <Route path='/equipment' element={<Equipment />} />
          <Route path='/bookings' element={<Booking />} />
          <Route path='/prices' element={<Prices />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
      {/* Conditionally render the footer only on the main page */}
      {footerPaths.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
