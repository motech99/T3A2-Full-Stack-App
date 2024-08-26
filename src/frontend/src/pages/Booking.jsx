import { useQuery } from '@tanstack/react-query';

const fetchUserBookings = async () => {
  const response = await fetch(
    'https://t3a2-full-stack-app-api.onrender.com/bookings',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch bookings');
  }
  return response.json();
};

export const Booking = () => {
  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userBookings'],
    queryFn: fetchUserBookings,
  });

  if (isLoading) return <h1 className='title headings'>Loading...</h1>;

  if (isError) {
    console.error('Error fetching bookings:', error.message);

    if (error.message === 'No bookings found') {
      return <h1 className='title headings'>No current bookings</h1>;
    }
    return <h1 className='title headings'>Error loading bookings.</h1>;
  }

  if (bookings.length === 0) {
    return <h1 className='title headings'>No current bookings</h1>;
  }

  return (
    <div>
      <h1 className='title headings'>Bookings</h1>
      {bookings.map((booking) => (
        <div key={booking._id} className='booking-item'>
          <h2>{booking.equipment.item}</h2>
          <p>Start Time: {new Date(booking.startTime).toLocaleString()}</p>
          <p>End Time: {new Date(booking.endTime).toLocaleString()}</p>
          <p>Hire Option: {booking.hireOption?.option || 'N/A'}</p>{' '}
          <p>Quantity: {booking.quantity}</p>
          <p>Total Price: ${booking.totalPrice.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};
