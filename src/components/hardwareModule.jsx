import React from "react";

const HardwareModule = (props) => {
  const { hardwareModule, onStartClick, onStopClick } = props;

  return (
    <div className="hardware-button-container mb-4">
      <span className="label mb-2">{hardwareModule.label}</span>
      <div>{getButtons(hardwareModule, onStartClick, onStopClick)}</div>
    </div>
  );
};

const getButtons = (hardwareModule, onStartClick, onStopClick) => {
  if (hardwareModule.name === "Door") {
    return (
      <React.Fragment>
        <button
          onClick={() => {
            onStartClick(hardwareModule);
          }}
          className="btn btn-success"
        >
          {hardwareModule["on_text"]}
        </button>
        <span></span>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
};
export default HardwareModule;
