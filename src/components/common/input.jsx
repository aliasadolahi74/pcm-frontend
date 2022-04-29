import React from "react";

const Input = ({
  name,
  label,
  type,
  value,
  onChange,
  autoFocus,
  className,
  error,
  id,
  withNoPlaceholder,
}) => {
  return (
    <div className={className ? "form-group " + className : "form-group"}>
      <label htmlFor={name}>{label}</label>
      <input
        autoFocus={autoFocus ? true : false}
        type={type}
        className='form-control'
        id={id === null ? name : id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={withNoPlaceholder ? null : `${label} را وارد کنید`}
      />
      {error && (
        <div className='alert alert-danger mt-2'>
          <small>{error}</small>
        </div>
      )}
    </div>
  );
};

export default Input;
