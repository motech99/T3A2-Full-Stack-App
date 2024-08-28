import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './styles/Booking.css';

// Fetch user bookings function
const fetchUserBookings = async () => {
  console.log('Fetching user bookings');
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
    throw new Error('Failed to delete booking');
  }

  // No need to parse the response since it might be plain text like "OK"
  return response.text(); // Returning the plain text response
};

export const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await fetchUserBookings();
      console.log('Updated bookings:', data);
      setBookings(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
      setIsLoading(false);
      setIsError(true);
      setError(error);
      toast.error(`Error fetching bookings: ${error.message}`);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        setDeleteLoading(true);
        await deleteBooking(bookingId);

        // Immediately remove the deleted booking from the state
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );

        toast.success('Booking deleted successfully!');
      } catch (error) {
        console.error('Error deleting booking:', error.message);
        setError('Failed to delete booking');
        toast.error(`Failed to delete booking: ${error.message}`);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (isLoading) return <h1 className='title headings'>Loading...</h1>;

  if (isError) {
    return (
      <h1 className='title headings'>
        Error loading bookings: {error.message}
      </h1>
    );
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
                            <td>${Number(booking.totalPrice).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className='buttons mt-4'>
                        <button
                          className='button is-danger is-fullwidth'
                          onClick={() => handleDelete(booking._id)}
                          disabled={deleteLoading}>
                          {deleteLoading ? 'Deleting...' : 'Delete Booking'}
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
