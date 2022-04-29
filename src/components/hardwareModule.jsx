import React from "react";

const HardwareModule = (props) => {
  const { hardwareModule, onStartClick, onStopClick } = props;

  return (
<<<<<<< HEAD
    <div className='hardware-button-container mb-4'>
      <span className='label mb-2'>{hardwareModule.label}</span>
=======
    <div className="hardware-button-container mb-4">
      <span className="label mb-2">{hardwareModule.label}</span>
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
      <div>{getButtons(hardwareModule, onStartClick, onStopClick)}</div>
    </div>
  );
};

const getButtons = (hardwareModule, onStartClick, onStopClick) => {
  if (hardwareModule.name === "Door") {
    return (
      <React.Fragment>
<<<<<<< HEAD
=======
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
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
        <button
          onClick={() => {
            onStartClick(hardwareModule);
          }}
          className='btn btn-success'
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
          className='btn btn-success ml-2'
        >
          {hardwareModule["on_text"]}
        </button>
<<<<<<< HEAD
        {hardwareModule["off_text"] !== "" ? (
          <button
            onClick={() => {
              onStopClick(hardwareModule);
            }}
            className='btn btn-danger'
          >
            {hardwareModule["off_text"]}
          </button>
        ) : null}
=======
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
      </React.Fragment>
    );
  }
};
export default HardwareModule;
