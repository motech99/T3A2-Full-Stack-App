import { useQuery } from '@tanstack/react-query';
import { EQUIPMENT_URL } from './Equipment.jsx';

export const Prices = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prices'],
    queryFn: () => fetch(EQUIPMENT_URL).then((res) => res.json()),
  });

  if (isLoading) return <h1 className='title headings'>Loading...</h1>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1 className='title headings'>Equipment</h1>
      <ul>
        {data?.map((prices) => (
          <li key={prices._id}>
            <h2>{prices.item}</h2>
            <img
              src={prices.image}
              alt={prices.item}
              style={{ width: '200px', height: 'auto' }}
            />
            <p>Quantity: {prices.quantity}</p>
            <h3>Rates:</h3>
            <ul>
              {prices.rates.map((rate) => (
                <li key={rate._id}>
                  {rate.hireOption.option} - ${rate.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};
