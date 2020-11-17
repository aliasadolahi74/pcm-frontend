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
}) => {
  return (
    <div className={className ? "form-group " + className : "form-group"}>
      <label htmlFor={name}>{label}</label>
      <input
        autoFocus={autoFocus ? true : false}
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`${label} را وارد کنید`}
      />
      {error && (
        <div className="alert alert-danger mt-2">
          <small>{error}</small>
        </div>
      )}
    </div>
  );
};

export default Input;
