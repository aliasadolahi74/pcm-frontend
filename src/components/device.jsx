import { findIndex } from "lodash";
import React, { Component } from "react";

import Dialog from "./common/dialog";
import HardwareModule from "./hardwareModule";
import axios from "axios";
import qs from "qs";
import "../services/httpServices";
import config from "../config.json";
import { authData } from "./../services/authServices";

class Device extends Component {
  state = {
    dialogIsVisible: false,
    dialogMessage: "Hello World!",
    dialogSuccess: true,
    hardwareModules: [],
  };

  async componentDidMount() {
    const deviceHardwareOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        deviceID: this.props.match.params.deviceID,
        ...authData,
      }),
      url: `${config.apiBaseURL}/deviceHardwareList.php`,
    };

    const hardwareListResponse = await axios(deviceHardwareOptions);
    const hardwareModules = hardwareListResponse.data.body;
    hardwareModules.map((item, index) =>
      hardwareModules[index].isActive === "1"
        ? (hardwareModules.isActive = true)
        : (hardwareModules.isActive = false)
    );
    this.setState({ hardwareModules });
    // const availableHardwareList = hardwareListResponse.data.body.hardwareList;
  }

  render() {
    const deviceID = this.props.match.params.deviceID;
    const {
      dialogIsVisible,
      dialogMessage,
      dialogSuccess,
      hardwareModules,
    } = this.state;
    return (
      <div className="device-info-container">
        <h1 className="mb-5">{deviceID}</h1>
        <div className="button-container">
          {hardwareModules.map((item) => (
            <HardwareModule
              onToggleButtonClick={this.handleToggleButtonClick}
              key={item.name}
              hardwareModule={item}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={this.handleLockButtonClick}
          className="btn btn-outline-primary mt-4"
        >
          <i className="fas fa-lock"></i>&nbsp; قفل برقی
        </button>
        <button
          id=""
          type="button"
          onClick={this.handleReportingButtonClick}
          className="btn btn-outline-primary mt-4 mr-2"
        >
          <i className="fas fa-sync"></i>&nbsp; گزارش گیری
        </button>

        <Dialog
          id="dialog"
          isVisible={dialogIsVisible}
          onDialogEnds={this.handleOnDialogEnds}
          message={dialogMessage}
          success={dialogSuccess}
        />
      </div>
    );
  }

  handleOnDialogEnds = () => {
    this.setState({ dialogIsVisible: false });
  };

  handleLockButtonClick = () => {
    // Todo: ajax
    this.setState({
      dialogIsVisible: true,
      dialogMessage: "handleLockButtonClick",
      dialogSuccess: true,
    });
  };

  handleReportingButtonClick = () => {
    // Todo: ajax
    this.setState({
      dialogIsVisible: true,
      dialogMessage: "handleReportingButtonClick",
      dialogSuccess: true,
    });
  };

  handleToggleButtonClick = (item) => {
    const hardwareModules = [...this.state.hardwareModules];
    const index = findIndex(hardwareModules, item);
    if (item.isActive === "1") {
      hardwareModules[index].isActive = "0";
    } else {
      hardwareModules[index].isActive = "1";
    }
    this.setState({ hardwareModules });
  };

  handleEngineTB = () => {
    this.setState({ engineIsActive: !this.state.engineIsActive });
  };
  handleCommandTimerTB = () => {
    this.setState({ commandTimerIsActive: !this.state.commandTimerIsActive });
  };
  handleSecurityTB = () => {
    this.setState({ securityIsActive: !this.state.securityIsActive });
  };
}

export default Device;
