import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EQUIPMENT_URL } from './Equipment.jsx';
import './styles/AdminEquipment.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const initializedData = data.map(equipment => {
        const ratesMap = {};

        if (Array.isArray(equipment.rates)) {
          equipment.rates.forEach(rate => {
            if (rate.hireOption && rate.hireOption.option) {
              ratesMap[rate.hireOption.option] = rate.price;
            }
          });
        }

        return {
          _id: equipment._id,
          item: equipment.item,
          quantity: equipment.quantity,
          rates: equipment.rates.map(rate => ({
            _id: rate._id, // Assuming the rate has an _id
            hireOption: rate.hireOption.option,
            price: rate.price
          })),
        };
      });
      setEquipmentData(initializedData);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (updatedEquipment) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://t3a2-full-stack-app-api.onrender.com/equipment/${updatedEquipment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedEquipment),
      });

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

  const handleFieldChange = (index, field, value) => {
    const updatedData = [...equipmentData];
    if (field === 'quantity') {
      updatedData[index][field] = value;
    } else {
      const updatedRates = updatedData[index].rates.map(rate => {
        if (rate.hireOption === field) {
          return { ...rate, price: value };
        }
        return rate;
      });
      updatedData[index].rates = updatedRates;
    }
    setEquipmentData(updatedData);
  };

  const handleUpdate = (index) => {
    const equipmentToUpdate = equipmentData[index];
    console.log('Updating Equipment:', equipmentToUpdate); // Debugging
    mutation.mutate(equipmentToUpdate);
  };

  if (isLoading) return <h1 className='title headings'>Loading...</h1>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='equipment-container'>
      <h1 className='title headings has-text-centered mb-6'>Manage Equipment</h1>
      <button
        className='button is-primary mb-4'
        onClick={() => navigate('/equipment/add')}
      >
        Add Equipment
      </button>
      <div className='card equipment-card'>
        <div className='card-content'>
          <table className='table is-fullwidth mt-4 is-striped table-color is-hoverable'>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>1 Hour</th>
                <th>2 Hours</th>
                <th>1/2 Day</th>
                <th>Full Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentData.map((equipment, index) => (
                <tr key={equipment._id}>
                  <td data-label="Item">{equipment.item}</td>
                  <td data-label="Quantity">
                    <input
                      type='number'
                      value={equipment.quantity}
                      onChange={(e) => handleFieldChange(index, "quantity", e.target.value)}
                    />
                  </td>
                  {['1 hour', '2 hours', '1/2 day', 'Full day'].map(option => (
                    <td key={option} data-label={option}>
                      <input
                        type='number'
                        value={equipment.rates.find(rate => rate.hireOption === option)?.price || ''}
                        onChange={(e) => handleFieldChange(index, option, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      type='button'
                      className='button is-success'
                      onClick={() => handleUpdate(index)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



