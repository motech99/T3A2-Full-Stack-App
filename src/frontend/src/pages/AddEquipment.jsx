import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddEquipment = () => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rates, setRates] = useState([]); // Initialize as empty
  const [hireOptions, setHireOptions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHireOptions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://t3a2-full-stack-app-api.onrender.com/hireOptions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch hire options');
        }

        const data = await response.json();
        setHireOptions(data);
        // Initialize rates with hire options
        setRates(data.map(option => ({ hireOption: option._id, price: '' })));
      } catch (error) {
        console.error(error);
      }
    };

    fetchHireOptions();
  }, []);

  const handleRateChange = (index, value) => {
    const updatedRates = rates.map((rate, i) =>
      i === index ? { ...rate, price: value } : rate
    );
    setRates(updatedRates);
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('item', item);
      formData.append('quantity', quantity);
      formData.append('rates', JSON.stringify(rates));
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      const response = await fetch('https://t3a2-full-stack-app-api.onrender.com/equipment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate('/equipment/admin');
      } else {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to add equipment: ${errorText}`);
      }
    } catch (error) {
      console.error('Error submitting equipment:', error);
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
        <div className='field'>
          <label className='label'>Rates</label>
          <table className='table is-fullwidth mt-4 is-striped table-color is-hoverable'>
            <thead>
              <tr>
                <th>Hire Option</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate, index) => (
                <tr key={index}>
                  <td>
                    {hireOptions.find(option => option._id === rate.hireOption)?.option || 'Unknown'}
                  </td>
                  <td>
                    <input
                      className='input'
                      type='number'
                      value={rate.price}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='field'>
          <label className='label'>Image</label>
          <input
            className='input'
            type='file'
            accept='image/jpeg, image/png'
            onChange={handleImageFileChange}
          />
          <div className='field'>
            <label className='label'>Or Provide Image URL</label>
            <input
              className='input'
              type='text'
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
          </div>
        </div>
        <button type='submit' className='button is-success'>
          Add Equipment
        </button>
      </form>
    </div>
  );
};





