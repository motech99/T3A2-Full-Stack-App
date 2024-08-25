const FormRow = ({ type, name, labelText, placeholder, value, handleChange }) => {
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
        />
      </div>
    </div>
  );
};

export default FormRow;
