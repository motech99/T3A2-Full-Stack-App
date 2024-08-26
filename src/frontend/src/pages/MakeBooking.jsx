import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EQUIPMENT_URL } from './Equipment.jsx';
import FormRow from './components/FormRow';
import './styles/MakeBooking.css'


const MAKEBOOKING_URL = 'https://t3a2-full-stack-app-api.onrender.com/bookings';

// Function to fetch equipment options from the server
const fetchEquipmentOptions = async () => {
  const response = await fetch(EQUIPMENT_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch equipment options');
  }
  return response.json();
};

// Function to post booking data to the server
const postBooking = async (bookingData) => {
  const response = await fetch(MAKEBOOKING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Booking failed');
  }

  return await response.json();
};

export const MakeBooking = () => {
  // Function to get the current date and time in the format required for the datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // State variables for form data, total price, max quantity, and error message
  const [formData, setFormData] = useState({
    equipment: '',
    startTime: '',
    hireOption: '',
    quantity: 1,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  // Fetch equipment options using react-query
  const {
    data: equipmentOptions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['equipmentOptions'],
    queryFn: fetchEquipmentOptions,
  });

  // Function to get hire options for a specific equipment
  const getHireOptions = (equipmentId) => {
    const equipment = equipmentOptions?.find((eq) => eq._id === equipmentId);
    return equipment ? equipment.rates : [];
  };

  // Function to update the total price based on selected hire option and quantity
  const updateTotalPrice = () => {
    const hireOptions = getHireOptions(formData.equipment);
    const selectedOption = hireOptions.find(
      (option) => option.hireOption._id === formData.hireOption
    );
    setTotalPrice(
      selectedOption ? selectedOption.price * formData.quantity : 0
    );
  };

  // Effect to update max quantity and recalculate total price when dependencies change
  useEffect(() => {
    const selectedEquipment = equipmentOptions?.find(
      (eq) => eq._id === formData.equipment
    );
    if (selectedEquipment) {
      setMaxQuantity(selectedEquipment.quantity);
      setFormData((prevData) => ({
        ...prevData,
        quantity: Math.min(prevData.quantity, selectedEquipment.quantity),
      }));
    }
    updateTotalPrice();
  }, [
    formData.equipment,
    formData.hireOption,
    formData.quantity,
    equipmentOptions,
  ]);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to validate the booking time
  const validateTime = (time) => {
    const [date, timePart] = time.split('T');
    const [hour, minute] = timePart.split(':').map(Number);

    const now = new Date(date);
    now.setHours(hour, minute, 0, 0);

    const open = new Date(date);
    open.setHours(7, 5, 0, 0); // 7:05 AM

    const close = new Date(date);
    close.setHours(19, 0, 0, 0); // 7:00 PM

    return now >= open && now <= close;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.equipment ||
      !formData.startTime ||
      !formData.hireOption ||
      formData.quantity < 1
    ) {
      setErrorMessage('Please fill in all fields correctly.');
      return;
    }

    if (!validateTime(formData.startTime)) {
      setErrorMessage('The booking time must be between 7:05 AM and 7:00 PM.');
      return;
    }

    // Check if selected equipment has a valid quantity
    const selectedEquipment = equipmentOptions?.find(
      (eq) => eq._id === formData.equipment
    );
    if (selectedEquipment && formData.quantity > selectedEquipment.quantity) {
      setErrorMessage(
        'Sorry, there is currently no available quantity for the selected equipment.'
      );
      return;
    }

    try {
      await postBooking(formData);
      navigate('/bookings');
    } catch (error) {
      console.error('Error booking:', error.message);
      if (
        error.message.includes('Requested quantity exceeds available quantity')
      ) {
        setErrorMessage(
          'Sorry, there is currently no available quantity for the selected equipment.'
        );
      } else if (error.message.includes('Not enough equipment available')) {
        setErrorMessage(
          'The equipment is no longer available for the selected time slot.'
        );
      } else if (error.message.includes('Booking failed')) {
        setErrorMessage('Failed to complete the booking. Please try again.');
      } else {
        setErrorMessage(
          'An unexpected error occurred. Please try again later.'
        );
      }
    }
  };

  // Display loading or error message while fetching data
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error loading data.</h1>;

  return (
    <section className='background-equipment'>
      <div className='columns is-mobile is-centered is-vcentered'>
        <div className='column is-full-mobile is-half-tablet is-one-third-desktop'>
          <div className='box'>
            <h1 className='title has-text-centered login-heading login-border'>
              BOOKING
            </h1>
            {errorMessage && (
              <div className='notification is-danger'>{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit}>
              <FormRow
                type='select'
                name='equipment'
                labelText='Equipment'
                value={formData.equipment}
                handleChange={handleInputChange}
                options={
                  <>
                    <option value='' disabled>
                      Select equipment
                    </option>
                    {equipmentOptions.map((equipment) => (
                      <option key={equipment._id} value={equipment._id}>
                        {equipment.item}
                      </option>
                    ))}
                  </>
                }
              />
              <FormRow
                type='datetime-local'
                name='startTime'
                labelText='Start Time'
                value={formData.startTime}
                handleChange={handleInputChange}
                min={getCurrentDateTime()} // Prevent selecting a past date and time
              />
              <FormRow
                type='select'
                name='hireOption'
                labelText='Hire Option'
                value={formData.hireOption}
                handleChange={handleInputChange}
                options={
                  <>
                    <option value='' disabled>
                      Select hire option
                    </option>
                    {getHireOptions(formData.equipment).map((option) => (
                      <option
                        key={option.hireOption._id}
                        value={option.hireOption._id}>
                        {option.hireOption.option}
                      </option>
                    ))}
                  </>
                }
              />
              <FormRow
                type='number'
                name='quantity'
                labelText='Quantity'
                value={formData.quantity}
                handleChange={handleInputChange}
                min={1}
                max={maxQuantity} // Set max quantity based on available stock
              />
              <div className='field'>
                <label className='label'>Total Price</label>
                <div className='control'>
                  <p className='input'>{totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className='field'>
                <div className='control'>
                  <button
                    type='submit'
                    className='button is-warning is-fullwidth'>
                    Book Now
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};