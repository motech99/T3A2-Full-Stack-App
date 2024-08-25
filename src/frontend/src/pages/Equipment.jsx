import { useQuery } from '@tanstack/react-query';
import './Equipment.css'; // Import the custom CSS

const EQUIPMENT_URL = 'https://t3a2-full-stack-app-api.onrender.com/equipment';

export const Equipment = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => fetch(EQUIPMENT_URL).then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

return (
  <div className='equipment-container'>
    <h1 className='title headings'>Equipment</h1>
    <div className='columns is-multiline is-centered hello'>
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
                  <button className='button is-warning is-fullwidth'>
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
