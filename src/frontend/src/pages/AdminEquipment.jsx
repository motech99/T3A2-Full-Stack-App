import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EQUIPMENT_URL } from './Equipment.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AdminEquipment.css';

export const ManageEquipment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => fetch(EQUIPMENT_URL).then((res) => res.json()),
  });

  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    if (data) {
      const initializedData = data.map((equipment) => {
        const ratesMap = {};

        equipment.rates.forEach((rate) => {
          ratesMap[rate.hireOption._id] = rate.price;
        });

        return {
          _id: equipment._id,
          item: equipment.item,
          quantity: equipment.quantity,
          rates: ratesMap,
          hireOptions: equipment.rates.map((rate) => ({
            id: rate.hireOption._id,
            option: rate.hireOption.option,
          })),
        };
      });
      setEquipmentData(initializedData);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (updatedEquipment) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `https://t3a2-full-stack-app-api.onrender.com/equipment/${updatedEquipment._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedEquipment),
        }
      );

      if (!response.ok) {
        throw new Error('Error updating equipment');
      }

      return response.json();
    },
    onMutate: async (updatedEquipment) => {
      await queryClient.cancelQueries(['equipment']);
      const previousData = queryClient.getQueryData(['equipment']);

      queryClient.setQueryData(['equipment'], (oldData) =>
        oldData.map((equipment) =>
          equipment._id === updatedEquipment._id ? updatedEquipment : equipment
        )
      );

      return { previousData };
    },
    onError: (err, updatedEquipment, context) => {
      queryClient.setQueryData(['equipment'], context.previousData);
      alert(`Error updating equipment: ${err.message}`);
    },
    onSuccess: () => {
      alert('Equipment updated successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['equipment']);
    },
  });

const deleteMutation = useMutation({
  mutationFn: async (equipmentId) => {
    const token = localStorage.getItem('authToken');

    console.log('Deleting equipment with ID:', equipmentId); // Debugging log

    const response = await fetch(
      `https://t3a2-full-stack-app-api.onrender.com/equipment/${equipmentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error response from server:', errorResponse); // Log error response from server
      throw new Error(errorResponse.error || 'Error deleting equipment');
    }

    return response.json();
  },
  onMutate: async (equipmentId) => {
    await queryClient.cancelQueries(['equipment']);
    const previousData = queryClient.getQueryData(['equipment']);

    queryClient.setQueryData(['equipment'], (oldData) =>
      oldData.filter((equipment) => equipment._id !== equipmentId)
    );

    return { previousData };
  },
  onError: (err, equipmentId, context) => {
    queryClient.setQueryData(['equipment'], context.previousData);
    alert(`Error deleting equipment: ${err.message}`);
  },
  onSuccess: () => {
    alert('Equipment deleted successfully!');
  },
  onSettled: () => {
    queryClient.invalidateQueries(['equipment']);
  },
});

  const handleFieldChange = (index, hireOptionId, value) => {
    const updatedData = [...equipmentData];
    if (hireOptionId === 'quantity') {
      updatedData[index].quantity = value; // Special handling for quantity
    } else {
      updatedData[index].rates[hireOptionId] = value; // Update rates object
    }
    setEquipmentData(updatedData);
  };

  const handleUpdate = (index) => {
    const equipmentToUpdate = equipmentData[index];
    const updatedEquipment = {
      ...equipmentToUpdate,
      rates: Object.keys(equipmentToUpdate.rates).map((hireOptionId) => ({
        hireOption: hireOptionId,
        price: Number(equipmentToUpdate.rates[hireOptionId]),
      })),
    };
    updateMutation.mutate(updatedEquipment);
  };

  const handleDelete = (equipmentId) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      console.log('Attempting to delete equipment with ID:', equipmentId); // Debugging log
      deleteMutation.mutate(equipmentId);
    }
  };

  if (isLoading) return <h1 className='title headings'>Loading...</h1>;
  if (error) return <p>Error: {error.message}</p>;

  const allHireOptions = equipmentData.reduce((acc, equipment) => {
    equipment.hireOptions.forEach((option) => {
      if (!acc.some((o) => o.id === option.id)) {
        acc.push(option);
      }
    });
    return acc;
  }, []);

  return (
    <div className='background-booking'>
      <div className='equipment-container'>
        <h1 className='title headings has-text-centered has-text-white mb-6'>
          MANAGE EQUIPMENT
        </h1>
        <div className='columns is-multiline is-centered'>
          {equipmentData.map((equipment, index) => (
            <div
              key={equipment._id}
              className='column is-5-desktop is-8-tablet is-12-mobile equipment-sizing'>
              <div className='card equipment-card'>
                <div className='card-content m-2'>
                  <div className='media'>
                    <div className='media-content'>
                      <h2 className='title is-4 has-text-centered login-heading login-border'>
                        {equipment.item.toUpperCase()}
                      </h2>

                      <div className='field'>
                        <label className='label'>Quantity</label>
                        <div className='control'>
                          <input
                            type='number'
                            className='input'
                            value={equipment.quantity}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                'quantity',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {allHireOptions.map((option) => (
                        <div className='field' key={option.id}>
                          <label className='label'>{option.option}</label>
                          <div className='control'>
                            <input
                              type='number'
                              className='input'
                              value={equipment.rates[option.id] || ''}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  option.id,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}

                      <div className='field is-grouped'>
                        <div className='control'>
                          <button
                            type='button'
                            className='button is-success'
                            onClick={() => handleUpdate(index)}>
                            Update
                          </button>
                        </div>
                        <div className='control'>
                          <button
                            type='button'
                            className='button is-danger'
                            onClick={() => handleDelete(equipment._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
