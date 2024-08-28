import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi } from 'vitest'; 

import { Equipment } from '../pages/Equipment';

// Create a QueryClient instance
const queryClient = new QueryClient();

// Create a custom render function to wrap components with QueryClientProvider
const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

// Mock hire options data
const mockHireOptions = {
  '1': '1 hour',
  '2': '2 hours',
};

// Mock Equipment data
const mockEquipmentData = [
  {
    _id: '1',
    item: 'Kayak',
    quantity: 10,
    rates: [
      { hireOption: mockHireOptions[0], price: 15 },
      { hireOption: mockHireOptions[1], price: 25 },
    ],
    image: '/images/Kayak.png',
  },
  {
    _id: '2',
    item: 'Bike',
    quantity: 5,
    rates: [
      { hireOption: mockHireOptions[0], price: 10 },
      { hireOption: mockHireOptions[1], price: 18 },
    ],
    image: '/images/bike.png',
  },
];

// Mock global fetch before each test
beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockEquipmentData),
    })
  );
});

describe('Equipment Component', () => {
  it('displays loading message while fetching equipment data', () => {
    renderWithProviders(<Equipment />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders equipment items correctly', async () => {
    renderWithProviders(<Equipment />);

    await waitFor(() => {
      expect(screen.getByText(/Kayak/i)).toBeInTheDocument();
      expect(screen.getByText(/Bike/i)).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/images/Kayak.png');
    expect(images[1]).toHaveAttribute('src', '/images/bike.png');
  })


});
