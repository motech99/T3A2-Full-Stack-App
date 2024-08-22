import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  const handleBurgerClick = () => {
    setIsActive(!isActive);
  };

  const closeMenu = () => {
    setIsActive(false);
  };

  return (
    <nav
      className='navbar'
      role='navigation'
      aria-label='main navigation'>
      <div className='navbar-brand'>
        <Link className='navbar-item' to='/'>
          <h1 className='heading-font'>GC Activity Rentals</h1>
        </Link>
        <a
          role='button'
          className={`navbar-burger ${isActive ? 'is-active' : ''}`}
          aria-label='menu'
          aria-expanded={isActive}
          data-target='navbarBasicExample'
          onClick={handleBurgerClick}>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </a>
      </div>
      <div
        id='navbarBasicExample'
        className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className='navbar-start'>
          <Link
            to='/equipment'
            className='navbar-item custom-font'
            onClick={closeMenu}>
            Equipment
          </Link>
          <Link
            to='/prices'
            className='navbar-item custom-font'
            onClick={closeMenu}>
            Prices
          </Link>
          <Link
            to='/bookings'
            className='navbar-item custom-font'
            onClick={closeMenu}>
            Manage Booking
          </Link>
        </div>

        <div className='navbar-end'>
          <div className='navbar-item'>
            <div className='buttons'>
              <Link to='/signup' className='button is-warning' onClick={closeMenu}>
                <strong>Sign up</strong>
              </Link>
              <Link to='/login' className='button is-dark' onClick={closeMenu}>
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
