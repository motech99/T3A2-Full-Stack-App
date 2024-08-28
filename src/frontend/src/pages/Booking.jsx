import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Booking.css';

const ConfirmationDialog = ({ isVisible, onConfirm, onCancel }) => {
  return (
    <div className={`confirmation-dialog ${isVisible ? 'is-active' : ''}`}>
      <div className='confirmation-content'>
        <h1 className='title is-5 font-admin'>
          Are you sure you want to delete this equipment?
        </h1>
        <div className='buttons buttons-admin'>
          <button className='button is-danger button-admin' onClick={onConfirm}>
            Delete
          </button>
          <button className='button is-dark button-admin' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

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

  return response.text(); // Returning the plain text response
};

export const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const toastShown = useRef(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await fetchUserBookings();
      setBookings(data);
      setIsLoading(false);
      setIsError(false);
      toastShown.current = false;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (!toastShown.current) {
        toast.warn(
          'Warning: Error fetching bookings. Try making a new booking?'
        );
        toastShown.current = true;
      }
      setIsLoading(false);
      setIsError(true);
      setError(error);
    }
  };

  const handleDeleteClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBookingId) {
      try {
        setDeleteLoading(true);

        // Show success toast first
        toast.success('Booking deleted successfully!', {
          position: 'top-center',
        });

        // Delay state update to allow the toast to be visible
        setTimeout(async () => {
          try {
            await deleteBooking(selectedBookingId);

            // Update bookings state
            const newBookings = bookings.filter(
              (booking) => booking._id !== selectedBookingId
            );

            setBookings(newBookings);

            // Check if there are no bookings left and show a message
            if (newBookings.length === 0) {
              toast.warn('No current bookings available.', {
                position: 'top-center',
              });
            }
          } catch (error) {
            toast.error(`Failed to delete booking: ${error.message}`, {
              position: 'top-center',
            });
          } finally {
            setDeleteLoading(false);
            setDialogVisible(false);
            setSelectedBookingId(null);
          }
        }, 300); // Adjust delay if needed
      } catch (error) {
        toast.error(`Failed to delete booking: ${error.message}`, {
          position: 'top-center',
        });
        setDeleteLoading(false);
        setDialogVisible(false);
        setSelectedBookingId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDialogVisible(false);
    setSelectedBookingId(null);
  };

  if (isLoading) return <h1 className='title headings'>LOADING...</h1>;

  if (bookings.length === 0) {
    toast.warn('No current bookings available');
    return <h1 className='title headings'>NO CURRENT BOOKINGS</h1>;
  }

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.startTime) - new Date(a.startTime)
  );

  return (
    <section className='background-booking'>
      <ToastContainer />
      <ConfirmationDialog
        isVisible={dialogVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
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
                          onClick={() => handleDeleteClick(booking._id)}
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
