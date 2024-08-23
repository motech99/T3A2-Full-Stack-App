import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import FormRow from './components/FormRow';

export const Login = () => {
  return (
    <>
      <section className='background-login'>
        <div className='columns is-mobile is-centered is-vcentered'>
          <div className='column is-full-mobile is-half-tablet is-one-third-desktop'>
            <div className='box'>
              <h1 className='title has-text-centered login-heading login-border'>
                LOGIN
              </h1>
              <form>
                <FormRow
                  type='email'
                  name='email'
                  labelText='Email'
                  placeholder='Enter your email'
                />
                <FormRow
                  type='password'
                  name='password'
                  labelText='Password'
                  placeholder='Enter your password'
                />
                <div className='field'>
                  <div className='control'>
                    <button className='button is-warning is-fullwidth'>
                      Login
                    </button>
                    <p className='padding-login has-text-centered login-heading'>
                      don't have an account?
                      <Link className='login-heading login-link' to='/signup'>  Signup
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
