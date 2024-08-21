import { Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import { Booking } from './pages/Booking';
import { Equipment } from './pages/Equipment';
import { Prices } from './pages/Prices';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/equipment' element={<Equipment />} />
        <Route path='/bookings' element={<Booking />} />
        <Route path='/prices' element={<Prices />} />
      </Routes>
    </>
  );
}

export default App;
