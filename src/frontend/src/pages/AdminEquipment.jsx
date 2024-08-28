import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EQUIPMENT_URL } from './Equipment.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/AdminEquipment.css';


export const ManageEquipment = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

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
      toast.error(`Error updating equipment: ${err.message}`, {
        position: 'top-center',
      });
    },
    onSuccess: () => {
      toast.success('Equipment updated successfully!', {
        position: 'top-center',
      });
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
                <div className='card-content'>
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
                          handleFieldChange(index, 'quantity', e.target.value)
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
                            handleFieldChange(index, option.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <div className='buttons-container'>
                    <button
                      type='button'
                      className='button is-success is-fullwidth'
                      onClick={() => handleUpdate(index)}>
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
