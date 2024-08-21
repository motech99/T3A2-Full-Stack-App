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
    <nav className='navbar' role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <a className='navbar-item' href='/'>
          <h1 className='title'>GC Activity Rentals</h1>
        </a>

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
          <Link to='/equipment' className='navbar-item' onClick={closeMenu}>
            Equipment
          </Link>
          <Link to='/prices' className='navbar-item' onClick={closeMenu}>
            Prices
          </Link>
          <Link to='/bookings' className='navbar-item' onClick={closeMenu}>
            Manage Booking
          </Link>
        </div>

        <div className='navbar-end'>
          <div className='navbar-item'>
            <div className='buttons'>
              <a className='button is-info' onClick={closeMenu}>
                <strong>Sign up</strong>
              </a>
              <a className='button is-light' onClick={closeMenu}>
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
