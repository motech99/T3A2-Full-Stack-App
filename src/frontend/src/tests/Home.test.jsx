import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../Home';

describe('Home Component', () => {
  it('renders the correct headings', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Discover the Coast/i)).toBeInTheDocument();
    expect(screen.getByText(/Hassle-free equipment rentals/i)).toBeInTheDocument();
  });

  it('renders the buttons with correct text', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Our Equipment »')).toBeInTheDocument();
    expect(screen.getByText('Our Prices »')).toBeInTheDocument();
    expect(screen.getByText('Manage Booking »')).toBeInTheDocument();
  });

  it('renders the equipment button with correct link to equipment page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const equipmentLink = screen.getByRole('link', { name: /Our Equipment »/i });
    expect(equipmentLink).toBeInTheDocument();
    expect(equipmentLink).toHaveAttribute('href', '/equipment');

    });

    it('navigates to the "Our Prices" page when the button is clicked', () => {
        render(
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        );
        const pricesLink = screen.getByRole('link', { name: /Our Prices »/i });
        expect(pricesLink).toHaveAttribute('href', '/prices');
      });
})