import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormRow from './components/FormRow'

export const Signup = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // Error state for handling errors

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
      const res = await fetch('https://t3a2-full-stack-app-api.onrender.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('User created:', data);
        nav('/login'); // Redirect to login page after successful signup
      } else if (res.status === 409) {
        // If the status code is 409, the email is already registered
        setError('This email is already registered. Please log in or use a different email.');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Something went wrong, please try again.');
      }
    } catch (error) {
      setError('Network error, please try again later.'); // Set network error
      console.error('Error signing up:', error);
    }
  };

  return (
    <section className='background-login'>
      <div className='columns is-mobile is-centered is-vcentered'>
        <div className='column is-full-mobile is-half-tablet is-one-third-desktop'>
          <div className='box'>
            <h1 className='title has-text-centered login-heading login-border'>
              SIGN UP
            </h1>
            {error && (
              <div className='notification is-danger'>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className='columns'>
                <div className='column is-half'>
                  <FormRow
                    type='text'
                    name='firstName'
                    labelText='First Name'
                    placeholder='Enter your first name'
                    value={formData.firstName}
                    handleChange={handleInputChange}
                  />
                </div>
                <div className='column is-half'>
                  <FormRow
                    type='text'
                    name='lastName'
                    labelText='Last Name'
                    placeholder='Enter your last name'
                    value={formData.lastName}
                    handleChange={handleInputChange}
                  />
                </div>
              </div>
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
                  <button className='button is-warning is-fullwidth'>
                    Sign Up
                  </button>
                  <p className='padding-login has-text-centered login-heading'>
                    Already have an account?
                    <Link className='login-heading login-link' to='/login'>
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};