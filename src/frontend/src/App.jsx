import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { Booking } from './pages/Booking';
import { Equipment } from './pages/Equipment';
import { Prices } from './pages/Prices';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Footer } from './Footer';
import { Home } from './Home';
import { Error } from './pages/Error';
import { MakeBooking } from './pages/MakeBooking';
import { ManageEquipment } from './pages/AdminEquipment';
import { AddEquipment } from './pages/AddEquipment';


function App() {
  const location = useLocation();

  const footerPaths = ['/', '/signup', '/login'];

  return (
    <div className='is-flex is-flex-direction-column min-vh-100'>
      <NavBar />
      <div className='is-flex-grow-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/equipment' element={<Equipment />}/>
          <Route path='/manage-equipment' element={<ManageEquipment />} />
          <Route path='/equipment/add' element={<AddEquipment />} />
          <Route path='/bookings' element={<Booking />} />
          <Route path='/make-booking' element={<MakeBooking />} />
          <Route path='/prices' element={<Prices />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </div>
      {/* Conditionally render the footer only on the main page */}
      {footerPaths.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
