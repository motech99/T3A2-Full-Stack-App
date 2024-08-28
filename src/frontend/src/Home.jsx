import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {
  const nav = useNavigate();

  const handleManageBookingClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login page if not logged in
      nav('/login');
    } else {
      // Navigate to bookings page if logged in
      nav('/bookings');
    }
  };

  return (
    <>
      <section className='hero'>
        <div className='hero-content'>
          <h1 className='hero-title headings'>Discover the Coast</h1>
          <h2 className='hero-subtitle'>
            Hassle-free equipment rentals on the Gold Coast. Book online and
            secure your adventure today!
          </h2>
          <div className='button-sizing-home'>
            <button className='button is-warning is-outlined'>
              <Link className='font' to='/equipment'>
                Our Equipment &raquo;
              </Link>
            </button>
          </div>
          <div className='button-sizing-home'>
            <button className='button is-warning is-outlined'>
              <Link className='font' to='/prices'>
                Our Prices &raquo;
              </Link>
            </button>
          </div>
          <div className='button-sizing-home'>
            <button
              className='button is-warning is-outlined'
              onClick={handleManageBookingClick}>
              Manage Booking &raquo;
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
