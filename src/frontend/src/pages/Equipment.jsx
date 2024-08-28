import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import './styles/Equipment.css';

export const EQUIPMENT_URL =
  'https://t3a2-full-stack-app-api.onrender.com/equipment';

export const Equipment = () => {
  const nav = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => fetch(EQUIPMENT_URL).then((res) => res.json()),
  });

  if (isLoading) return <h1 className='title headings'>Loading...</h1>;
  if (error) return <p>Error: {error.message}</p>;

  const handleBookNowClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login page if not logged in
      nav('/login');
    } else {
      // Navigate to make booking page if logged in
      nav('/make-booking');
    }
  };

  return (
    <div className='equipment-container'>
      <h1 className='title headings mb-6'>EQUIPMENT</h1>
      <div className='columns is-multiline is-centered'>
        {data?.map((equipment) => (
          <div
            key={equipment._id}
            className='column is-5-desktop is-6-tablet is-12-mobile equipment-sizing'>
            <div className='card equipment-card'>
              <div className='card-image'>
                <figure className='image is-1by1'>
                  <img src={equipment.image} alt={equipment.item} />
                </figure>
              </div>
              <div className='card-content'>
                <div className='media'>
                  <div className='media-content'>
                    <button
                      className='button is-warning is-fullwidth'
                      onClick={handleBookNowClick}>
                      {equipment.item}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
