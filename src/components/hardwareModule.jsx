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
            onStopClick(hardwareModule);
          }}
          className="btn btn-success ml-2"
        >
          روشن
        </button>
        <button className="btn btn-danger">خاموش</button>
      </div>
    </div>
  );
};

export default HardwareModule;
