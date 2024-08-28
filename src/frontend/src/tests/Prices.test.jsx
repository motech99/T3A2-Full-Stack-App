import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest'; 
import { Prices } from '../pages/Prices';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

const queryClient = new QueryClient();

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

// Mock data
// Mock hire options data
const mockHireOptions = [
    { _id: '1', option: '1 hour' },
    { _id: '2', option: '2 hours' },
    { _id: '3', option: '1/2 day' },
    { _id: '4', option: 'Full day' }
  ];
    
// Mock Equipment data
const mockEquipmentData = [
    {
      _id: '1',
      item: 'Kayak',
      quantity: 10,
      image: '/images/Kayak.png',
      rates: [
        {
          _id: '1',
          hireOption: mockHireOptions[0], // 1 hour
          price: 20
        },
        {
          _id: '2',
          hireOption: mockHireOptions[1], // 2 hours
          price: 35
        },
        {
          _id: '3',
          hireOption: mockHireOptions[2], // 1/2 day
          price: 50
        },
        {
          _id: '4',
          hireOption: mockHireOptions[3], // Full day
          price: 80
        }
      ]
    },
    {
      _id: '2',
      item: 'Bike',
      quantity: 5,
      image: '/images/bike.png',
      rates: [
        {
          _id: '1',
          hireOption: mockHireOptions[0], // 1 hour
          price: 15
        },
        {
          _id: '2',
          hireOption: mockHireOptions[1], // 2 hours
          price: 25
        },
        {
          _id: '3',
          hireOption: mockHireOptions[2], // 1/2 day
          price: 40
        },
        {
          _id: '4',
          hireOption: mockHireOptions[3], // Full day
          price: 70
        }
      ]
    }
  ];

// Mock global fetch before each test
beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockEquipmentData),
      })
    );
    renderWithProviders(<Prices />);
  });

describe('Prices Component', () => {
  it('displays loading message while fetching equipment data', () => {
    renderWithProviders(<Prices />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders equipment items correctly', async () => {

    // Check if the images are rendered correctly
    await waitFor(() => {
      expect(screen.getByAltText('Kayak')).toBeInTheDocument();
      expect(screen.getByAltText('Bike')).toBeInTheDocument();
    });

    // Check if the equipment names are rendered correctly
    expect(screen.getByText(/kayak/i)).toBeInTheDocument();
    expect(screen.getByText(/bike/i)).toBeInTheDocument();

  });
  it('renders the prices correctly', () => {
    expect(screen.getAllByText(/1 hour/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$20/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/2 hours/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$35/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/1\/2 day/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$50/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Full day/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$80/i).length).toBeGreaterThan(0);
    });
});


