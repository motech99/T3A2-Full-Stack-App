import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login-Signup.css';
import FormRow from './components/FormRow';

export const Login = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // State for handling errors

  const nav = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors before submission

    try {
      const res = await fetch('https://t3a2-full-stack-app-api.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        // Save the token to localStorage
        localStorage.setItem('authToken', data.token);
        // Redirect to bookings page
        nav('/bookings');
      } else {
        // Set error message based on response
        const errorData = await res.json();
        setError(errorData.error || 'Login failed, please try again.');
      }
    } catch (error) {
      setError('Network error, please try again later.'); // Handle network errors
      console.error('Error logging in:', error);
    }
  };

  return (
    <>
      <section className='background-login'>
        <div className='columns is-mobile is-centered is-vcentered'>
          <div className='column is-full-mobile is-half-tablet is-one-third-desktop'>
            <div className='box'>
              <h1 className='title has-text-centered login-heading login-border'>
                LOGIN
              </h1>
              {error && (
                <div className='notification is-danger'>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <FormRow
                  type='email'
                  name='email'
                  labelText='Email'
                  placeholder='Enter your email'
                  value={formData.email}
                  handleChange={handleInputChange}
                />
                <FormRow
                  type='password'
                  name='password'
                  labelText='Password'
                  placeholder='Enter your password'
                  value={formData.password}
                  handleChange={handleInputChange}
                />
                <div className='field'>
                  <div className='control'>
                    <button type='submit' className='button is-warning is-fullwidth'>
                      Login
                    </button>
                    <p className='padding-login has-text-centered login-heading'>
                      Don't have an account?
                      <Link className='login-heading login-link' to='/signup'> Signup
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

