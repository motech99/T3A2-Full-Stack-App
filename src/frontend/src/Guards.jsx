import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Authentication guard
export const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  React.useEffect(() => {
    if (!token) {
      toast.error('You must be logged in to access this page.');
      navigate('/login');
    }
  }, [token, navigate]);

  return token ? children : null;
};

// Admin guard
export const AdminGuard = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  React.useEffect(() => {
    if (!isAdmin) {
      toast.error('You do not have permission to access this page.', {
        position: 'top-center',
      });
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return isAdmin ? children : null;
};
