import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest'; 
import { render, screen, waitFor } from '@testing-library/react';
import { Booking } from '../pages/Booking';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock hire options
const mockHireOptions = [
    { _id: 'hireOption1', option: '1 hour' },
    { _id: 'hireOption2', option: '2 hours' },
    { _id: 'hireOption3', option: '1/2 day' },
    { _id: 'hireOption4', option: 'Full day' },
  ];
  
  // Mock equipment
  const mockEquipment = [
    {
      _id: 'equipment1',
      item: 'Scooter',
      rates: [
        { hireOption: mockHireOptions[0]._id, price: 10 },
        { hireOption: mockHireOptions[1]._id, price: 15 },
        { hireOption: mockHireOptions[2]._id, price: 25 },
        { hireOption: mockHireOptions[3]._id, price: 40 },
      ],
      quantity: 5,
      image: 'scooter-image-url',
    },
    {
      _id: 'equipment2',
      item: 'Bike',
      rates: [
        { hireOption: mockHireOptions[0]._id, price: 8 },
        { hireOption: mockHireOptions[1]._id, price: 12 },
        { hireOption: mockHireOptions[2]._id, price: 20 },
        { hireOption: mockHireOptions[3]._id, price: 35 },
      ],
      quantity: 10,
      image: 'bike-image-url',
    },
  ];
  // Mock bookings using the mock equipment and hire options
const mockBookings = [
    {
      _id: 'booking1',
      equipment: mockEquipment[0], // Scooter
      startTime: '2024-09-01T10:00',
      endTime: '2024-09-01T11:00',
      hireOption: mockHireOptions[0], // 1 hour
      quantity: 1,
      totalPrice: 10,
    },
    {
      _id: 'booking2',
      equipment: mockEquipment[1], // Bike
      startTime: '2024-09-02T12:00',
      endTime: '2024-09-02T14:00',
      hireOption: mockHireOptions[1], // 2 hours
      quantity: 2,
      totalPrice: 24,
    },
];
  


const queryClient = new QueryClient();

describe('Booking Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBookings),
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <Booking />
        </Router>
      </QueryClientProvider>
    );
  });

  it('renders bookings after fetching data', async () => {
    await waitFor(() =>
      expect(screen.getByText('MANAGE BOOKINGS')).toBeInTheDocument()
    );

    // Check the mock bookings are rendered correctly
    expect(screen.getByText('SCOOTER')).toBeInTheDocument();
    expect(screen.getByText('1 hour')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();

    expect(screen.getByText('BIKE')).toBeInTheDocument();
    expect(screen.getByText('2 hours')).toBeInTheDocument();
    expect(screen.getByText('$24.00')).toBeInTheDocument();
  });

})