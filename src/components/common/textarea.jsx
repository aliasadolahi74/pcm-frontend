import React from "react";

const TextArea = ({
  name,
  label,
  value,
  onChange,
  autoFocus,
  className,
  error,
}) => {
  return (
    <div className={className ? "form-group " + className : "form-group"}>
      <label htmlFor={name}>{label}</label>
      <textarea
        autoFocus={autoFocus ? true : false}
        className='form-control'
        id={name}
        name={name}
        onChange={onChange}
        rows='3'
        value={value === null ? "" : value}
        placeholder={`${label} را وارد کنید`}
      />
      {error && (
        <div className='alert alert-danger mt-2'>
          <small>{error}</small>
        </div>
      )}
    </div>
  );
};

export default TextArea;
