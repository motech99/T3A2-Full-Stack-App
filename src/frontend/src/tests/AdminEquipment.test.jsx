import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { ManageEquipment } from '../pages/AdminEquipment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';

// Create a QueryClient instance
const queryClient = new QueryClient();

// Mock equipment and hire options
const mockAllHireOptions = [
    { id: 'hireOption1', option: '1 hour' },
    { id: 'hireOption2', option: '2 hours' },
  ];

const mockEquipment = [
  {
    _id: 'equipment1',
    item: 'Scooter',
    quantity: 5,
    rates: [
      { hireOption: mockAllHireOptions[0], price: 20 },
      { hireOption: mockAllHireOptions[1], price: 30 },
    ],
  },
  {
    _id: 'equipment2',
    item: 'Bike',
    quantity: 10,
    rates: [
        { hireOption: mockAllHireOptions[0], price: 25 },
        { hireOption: mockAllHireOptions[1], price: 40 }
    ],
  },
];



describe('ManageEquipment Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock fetch responses
    vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEquipment),
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ManageEquipment />
        </Router>
      </QueryClientProvider>
    );
  });

  it('renders loading state initially', () => {
    // Check if the loading text is displayed initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders equipment data correctly', async () => {
    await waitFor(() => {
      expect(screen.getByText('MANAGE EQUIPMENT')).toBeInTheDocument();
    });

    // Check if equipment data is rendered
    expect(screen.getByText('SCOOTER')).toBeInTheDocument();
    expect(screen.getByText('BIKE')).toBeInTheDocument();
  });
    
  
});
