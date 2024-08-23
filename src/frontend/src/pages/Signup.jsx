import { Link } from 'react-router-dom';
import FormRow from './components/FormRow';

export const Signup = () => {
  return (
    <>
      <section className='background-login'>
        <div className='columns is-mobile is-centered is-vcentered'>
          <div className='column is-full-mobile is-half-tablet is-one-third-desktop'>
            <div className='box'>
              <h1 className='title has-text-centered login-heading login-border'>
                SIGN UP
              </h1>
              <form>
                <div className='columns'>
                  <div className='column is-half'>
                    <FormRow
                      type='text'
                      name='firstName'
                      labelText='First Name'
                      placeholder='Enter your first name'
                    />
                  </div>
                  <div className='column is-half'>
                    <FormRow
                      type='text'
                      name='lastName'
                      labelText='Last Name'
                      placeholder='Enter your last name'
                    />
                  </div>
                </div>
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
                      Sign Up
                    </button>
                    <p className='padding-login has-text-centered login-heading'>
                      already have an account?
                      <Link className='login-heading login-link' to='/login'> Login
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
