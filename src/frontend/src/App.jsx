import { Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import { Booking } from './pages/Booking';
import { Equipment } from './pages/Equipment';
import { Prices } from './pages/Prices';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Footer } from './Footer';

function App() {
  return (
    <div className='is-flex is-flex-direction-column min-vh-100'>
      <NavBar />
      <div className='is-flex-grow-1'>
        <Routes>
          <Route path='/equipment' element={<Equipment />} />
          <Route path='/bookings' element={<Booking />} />
          <Route path='/prices' element={<Prices />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
