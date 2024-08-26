import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddEquipment = () => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rates, setRates] = useState([{ hireOption: '', price: '' }]);
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleAddRate = () => {
    setRates([...rates, { hireOption: '', price: '' }]);
  };

  const handleRateChange = (index, field, value) => {
    const updatedRates = rates.map((rate, i) =>
      i === index ? { ...rate, [field]: value } : rate
    );
    setRates(updatedRates);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/equipment', { // Adjust URL based on your API setup
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item, quantity, rates, image }),
      });
      if (response.ok) {
        navigate('/equipment/admin'); // Redirect to EquipmentAdmin page
      } else {
        throw new Error('Failed to add equipment');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='add-equipment-container'>
      <h1 className='title has-text-centered'>Add New Equipment</h1>
      <form onSubmit={handleSubmit}>
        <div className='field'>
          <label className='label'>Item</label>
          <input
            className='input'
            type='text'
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
        </div>
        <div className='field'>
          <label className='label'>Quantity</label>
          <input
            className='input'
            type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        {rates.map((rate, index) => (
          <div key={index} className='field'>
            <label className='label'>Rate {index + 1}</label>
            <div className='field'>
              <label className='label'>Hire Option</label>
              <input
                className='input'
                type='text'
                value={rate.hireOption}
                onChange={(e) => handleRateChange(index, 'hireOption', e.target.value)}
                required
              />
            </div>
            <div className='field'>
              <label className='label'>Price</label>
              <input
                className='input'
                type='number'
                value={rate.price}
                onChange={(e) => handleRateChange(index, 'price', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button
          type='button'
          className='button is-primary'
          onClick={handleAddRate}
        >
          Add Another Rate
        </button>
        <div className='field'>
          <label className='label'>Image URL</label>
          <input
            className='input'
            type='text'
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button type='submit' className='button is-success'>
          Add Equipment
        </button>
      </form>
    </div>
  );
};
