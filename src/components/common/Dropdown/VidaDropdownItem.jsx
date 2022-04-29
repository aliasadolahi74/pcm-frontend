import React from "react";

const VidDropdownItem = (props) => {
  const { children, value, index } = props;

  return (
    <option index={index} value={value}>
      {children}
    </option>
  );
};

export default VidDropdownItem;
