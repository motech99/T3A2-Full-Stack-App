import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { EQUIPMENT_URL } from './Equipment.jsx';
import './styles/Prices.css';

export const Prices = () => {
  const nav = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['prices'],
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
      <h1 className='title headings has-text-centered mb-6'>PRICES</h1>
      <div className='columns is-multiline is-centered'>
        {data?.map((equipment) => (
          <div
            key={equipment._id}
            className='column is-5-desktop is-8-tablet is-12-mobile equipment-sizing'>
            <div className='card equipment-card'>
              <div className='card-image'>
                <figure className='image is-328x328'>
                  <img src={equipment.image} alt={equipment.item} />
                </figure>
              </div>
              <div className='card-content'>
                <div className='media'>
                  <div className='media-content'>
                    <h1 className='price-headings has-text-centered'>
                      {equipment.item.toUpperCase()}
                    </h1>
                    <table className='table is-fullwidth mt-4 is-striped table-color is-hoverable'>
                      <tbody>
                        {equipment.rates.length > 0 && (
                          <>
                            <tr>
                              <th
                                colSpan='2'
                                className='has-text-centered price-heading-table'>
                                RATES
                              </th>
                            </tr>
                            {equipment.rates.map((rate) => (
                              <tr className='table-hoverable' key={rate._id}>
                                <td>{rate.hireOption.option}</td>
                                <td className='pricing-color has-text-weight-semibold'>
                                  ${rate.price}
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                    <button
                      className='mt-4 button is-warning is-fullwidth'
                      onClick={handleBookNowClick}>
                      Book now
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
