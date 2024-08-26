const FormRow = ({
  type,
  name,
  labelText,
  placeholder,
  value,
  handleChange,
  options,
  min,
  max,
}) => {
  if (type === 'select') {
    return (
      <div className='field'>
        <label htmlFor={name} className='label'>
          {labelText || name}
        </label>
        <div className='control'>
          <div className='select is-fullwidth'>
            <select
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              required>
              {options}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='field'>
      <label htmlFor={name} className='label'>
        {labelText || name}
      </label>
      <div className='control'>
        <input
          type={type}
          id={name}
          name={name}
          className='input'
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

export default FormRow;
