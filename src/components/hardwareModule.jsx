import React from "react";

const HardwareModule = (props) => {
  const { hardwareModule, onStartClick, onStopClick } = props;

  return (
    <div className="hardware-button-container mb-4">
      <span className="label mb-2">{hardwareModule.label}</span>
      <div>
        <button
          onClick={() => {
            onStartClick(hardwareModule);
          }}
          className="btn btn-success ml-2"
        >
          {hardwareModule["on_text"]}
        </button>
        <button
          onClick={() => {
            onStopClick(hardwareModule);
          }}
          className="btn btn-danger"
        >
          {hardwareModule["off_text"]}
        </button>
      </div>
    </div>
  );
};

export default HardwareModule;
