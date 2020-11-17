import React from "react";
import ToggleButton from "./common/toggleButton";

const HardwareModule = (props) => {
  const { hardwareModule, onToggleButtonClick } = props;

  return (
    <React.Fragment>
      <span className="label">{hardwareModule.label}</span>
      <ToggleButton
        isActive={hardwareModule.isActive === "1"}
        onToggleButtonClick={() => {
          onToggleButtonClick(hardwareModule);
        }}
        name={hardwareModule.name}
      />
    </React.Fragment>
  );
};

export default HardwareModule;
