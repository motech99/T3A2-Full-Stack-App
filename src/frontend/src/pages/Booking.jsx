import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';
import './styles/Booking.css';

// Fetch user bookings function
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

// Function to delete a booking
const deleteBooking = async (bookingId) => {
  const response = await fetch(
    `https://t3a2-full-stack-app-api.onrender.com/bookings/${bookingId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete booking');
  }
  return response.json();
};

export const Booking = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user bookings
  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userBookings'],
    queryFn: fetchUserBookings,
  });

  // Mutation to delete a booking
const deleteMutation = useMutation(deleteBooking);


  const handleDelete = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteMutation.mutate(bookingId);
    }
  };

  const handleEdit = (bookingId) => {
    navigate(`/edit-booking/${bookingId}`); // Navigate to the edit booking page
  };

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

  // Sort bookings by startTime in descending order
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );

  return (
    <section className='background-booking'>
      <div className='equipment-container'>
        <h1 className='title headings has-text-centered has-text-white mb-6'>
          MANAGE BOOKINGS
        </h1>
        <div className='columns is-multiline is-centered'>
          {sortedBookings.map((booking) => (
            <div
              key={booking._id}
              className='column is-5-desktop is-8-tablet is-12-mobile equipment-sizing'>
              <div className='card equipment-card'>
                <div className='card-content'>
                  <div className='media'>
                    <div className='media-content'>
                      <h2 className='title is-4 has-text-centered login-heading login-border'>
                        {booking.equipment.item.toUpperCase()}
                      </h2>
                      <table className='table is-fullwidth mt-4 is-striped table-color is-hoverable'>
                        <tbody>
                          <tr>
                            <th>Start Time</th>
                            <td>
                              {new Date(booking.startTime).toLocaleString()}
                            </td>
                          </tr>
                          <tr>
                            <th>End Time</th>
                            <td>
                              {new Date(booking.endTime).toLocaleString()}
                            </td>
                          </tr>
                          <tr>
                            <th>Hire Option</th>
                            <td>{booking.hireOption?.option || 'N/A'}</td>
                          </tr>
                          <tr>
                            <th>Quantity</th>
                            <td>{booking.quantity}</td>
                          </tr>
                          <tr>
                            <th>Total Price</th>
                            <td>${booking.totalPrice.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className='buttons are-small mt-4'>
                        <button
                          className='button is-info'
                          onClick={() => handleEdit(booking._id)}>
                          Edit Booking
                        </button>
                        <button
                          className='button is-danger'
                          onClick={() => handleDelete(booking._id)}>
                          Delete Booking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
