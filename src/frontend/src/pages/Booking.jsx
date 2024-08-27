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
    <section className='background-booking'>
      <div className='equipment-container'>
        <h1 className='title headings has-text-centered mb-6'>
          MANAGE BOOKINGS
        </h1>
        <div className='columns is-multiline is-centered'>
          {bookings.map((booking) => (
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
