import React, { Component } from "react";

class ToggleButton extends Component {
  render() {
    const { name, className, isActive, onToggleButtonClick } = this.props;
    return (
      <div
        className={className + " d-inline-block"}
        onClick={onToggleButtonClick}
      >
        <input type="hidden" name={name} value={isActive ? "active" : ""} />
        <span
          className={
            isActive ? "vida-toggle-button active" : "vida-toggle-button"
          }
        ></span>
      </div>
    );
  }

  handleToggleButtonClick = () => {
    const isActive = this.props.isActive;
    this.setState({ isActive: !isActive });
  };
}

export default ToggleButton;
