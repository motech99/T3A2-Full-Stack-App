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

        // Populate ratesMap with existing hire options and prices
        equipment.rates.forEach(rate => {
          ratesMap[rate.hireOption._id] = rate.price;
        });

        return {
          _id: equipment._id,
          item: equipment.item,
          quantity: equipment.quantity,
          rates: ratesMap,
          hireOptions: equipment.rates.map(rate => ({
            id: rate.hireOption._id,
            option: rate.hireOption.option
          }))
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
    // Convert rates object to array with hireOption IDs
    const updatedEquipment = {
      ...equipmentToUpdate,
      rates: Object.keys(equipmentToUpdate.rates).map(hireOptionId => ({
        hireOption: hireOptionId,
        price: Number(equipmentToUpdate.rates[hireOptionId])
      }))
    };
    mutation.mutate(updatedEquipment);
  };

  if (isLoading) return <h1 className='title headings'>Loading...</h1>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract hire options for column headers
  const allHireOptions = equipmentData.reduce((acc, equipment) => {
    equipment.hireOptions.forEach(option => {
      if (!acc.some(o => o.id === option.id)) {
        acc.push(option);
      }
    });
    return acc;
  }, []);

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
                {allHireOptions.map(option => (
                  <th key={option.id}>{option.option}</th>
                ))}
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
                      onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)}
                    />
                  </td>
                  {allHireOptions.map(option => (
                    <td key={option.id} data-label={option.option}>
                      <input
                        type='number'
                        value={equipment.rates[option.id] || ''}
                        onChange={(e) => handleFieldChange(index, option.id, e.target.value)}
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


