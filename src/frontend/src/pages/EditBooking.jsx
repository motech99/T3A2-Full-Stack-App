import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Or your preferred notification library

// Example updateBooking function
const updateBooking = async (bookingId, updatedData) => {
  const response = await fetch(`https://t3a2-full-stack-app-api.onrender.com/bookings/${bookingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update booking');
  }
  return response.json();
};

export const EditBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    startTime: '',
    hireOption: '',
    quantity: '',
  });

  // Initialize updateMutation
  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateBooking(bookingId, updatedData),
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries(['bookingDetails', bookingId]);
      const previousData = queryClient.getQueryData(['bookingDetails', bookingId]);
      queryClient.setQueryData(['bookingDetails', bookingId], updatedData);
      return { previousData };
    },
    onError: (err, updatedData, context) => {
      queryClient.setQueryData(['bookingDetails', bookingId], context.previousData);
      toast.error(`Error updating booking: ${err.response?.data?.error || err.message}`, {
        position: 'top-center',
      });
    },
    onSuccess: () => {
      toast.success('Booking updated successfully!', {
        position: 'top-center',
      });
      navigate('/bookings');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['bookingDetails', bookingId]);
    },
  });

  // Fetch booking details (you should implement this)
  useEffect(() => {
    // Implement fetching logic here
  }, [bookingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start Time:
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </label>
      <label>
        Hire Option:
        <input
          type="text"
          name="hireOption"
          value={formData.hireOption}
          onChange={handleChange}
        />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Update Booking</button>
    </form>
  );
};
