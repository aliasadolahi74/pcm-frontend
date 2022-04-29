import React from "react";
import styles from "./VidaDropdown.module.css";

const VidaDropDown = (props) => {
  const {
    name,
    label,
    children: options,
    onChange,
    errors,
    id,
    defaultValue,
  } = props;

  const renderError = () => {
    return errors && errors[name] ? (
      <span className={styles.ErrorText}>{errors[name]}</span>
    ) : null;
  };

  const renderLabel = () => {
    return label ? <label htmlFor={id}>{label}</label> : null;
  };
  return (
    <div className={styles.VidaDropdownContainer}>
      <div className={styles.LabelContainer}>
        {renderLabel()}
        {renderError()}
      </div>

      <select
        onChange={onChange}
        name={name ? name : "select"}
        id={id}
        value={defaultValue}
        className={styles.DropdownSelect}
      >
        {options}
      </select>
    </div>
  );
};

export default VidaDropDown;
