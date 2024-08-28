import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest'; 
import { Login } from '../pages/Login';

// Mock global fetch
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ token: 'dummyToken', firstName: 'John' }),
  })
);

// Mock useNavigate
const mockNavigate = vi.fn();

const renderWithRouter = (component) => {
    return render(<Router>{component}</Router>);
  };

describe('Login Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithRouter(<Login />);

    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getAllByText(/login/i).length).toBeGreaterThan(1);
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });


  it('handles successful login', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'dummyToken', firstName: 'John' }),
      })
    );

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://t3a2-full-stack-app-api.onrender.com/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
      expect(localStorage.getItem('authToken')).toBe('dummyToken');
    });
  });

  it('handles failed login', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      })
    );


})

})