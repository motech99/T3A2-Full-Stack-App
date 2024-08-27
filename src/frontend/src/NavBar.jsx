import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('firstName');
    setIsLoggedIn(!!token);
    setFirstName(name || '');
  }, []);

  const handleBurgerClick = () => {
    setIsActive(!isActive);
  };

  const closeMenu = () => {
    setIsActive(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('firstName');
    setIsLoggedIn(false);
    closeMenu();
    nav('/login');
  };

  return (
    <nav className='navbar' role='navigation' aria-label='main navigation'>
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
          <Link
            to='/make-booking'
            className='navbar-item custom-font'
            onClick={closeMenu}>
            Make Booking
          </Link>

          {/* Admin Dropdown */}
          <div className='navbar-item has-dropdown is-hoverable'>
            <a className='navbar-link'>Admin</a>

            <div className='navbar-dropdown'>
              <Link
                to='/manage-equipment'
                className='navbar-item custom-font'
                onClick={closeMenu}>
                Manage Equipment
              </Link>
              <Link
                to='/equipment/add'
                className='navbar-item custom-font'
                onClick={closeMenu}>
                Add Equipment
              </Link>
            </div>
          </div>
        </div>

        <div className='navbar-end'>
          <div className='navbar-item'>
            <div className='buttons'>
              {isLoggedIn ? (
                <>
                  <span className='navbar-item'>Welcome, {firstName}!</span>
                  <button className='button is-dark' onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to='/signup'
                    className='button is-warning'
                    onClick={closeMenu}>
                    <strong>Sign up</strong>
                  </Link>
                  <Link
                    to='/login'
                    className='button is-dark'
                    onClick={closeMenu}>
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
