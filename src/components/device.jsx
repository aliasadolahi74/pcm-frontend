import React, { Component } from "react";
import HardwareModule from "./hardwareModule";
import axios from "axios";
import qs from "qs";
import "../services/httpServices";
import config from "../config.json";
import { authData } from "./../services/authServices";
import ReportTable from "./reportTable";

class Device extends Component {
  state = {
    hardwareModules: [],
    phoneNumber: this.props.match.params.phoneNumber,
    columns: [],
    reportData: [],
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

    const deviceReportOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        deviceID: this.props.match.params.deviceID,
        ...authData,
      }),
      url: `${config.apiBaseURL}/getDeviceReports.php`,
    };

    const deviceReportResponse = await axios(deviceReportOptions);
    const deviceReportArray = deviceReportResponse.data.body;
    if (deviceReportArray.length > 0) {
      this.updateColumnsFromReport(deviceReportArray[0]);
      this.updateDataFromReport(deviceReportArray);
    }
    // const availableHardwareList = hardwareListResponse.data.body.hardwareList;
  }

  updateColumnsFromReport = ({ report }) => {
    const reportArray = JSON.parse(report);
    const columns = reportArray.map((item) => {
      return { name: item.name, label: item.label };
    });
    columns.push({ name: "datetime", label: "زمان" });
    this.setState({ columns });
  };

  updateDataFromReport = (reportArray) => {
    const reportData = [];
    reportArray.forEach((item) => {
      const reportItem = JSON.parse(item.report);
      const reportItemData = {};
      reportItem.forEach((reportItem) => {
        reportItemData[reportItem.name] = reportItem.status;
        reportItemData["key"] = item.key;
        reportItemData["datetime"] = item.datetime;
      });
      reportData.push(reportItemData);
    });
    this.setState({ reportData });
  };

  render() {
    const deviceID = this.props.match.params.deviceID;

    const { hardwareModules } = this.state;
    return (
      <div className="device-info-container">
        <h1 className="mb-5">{deviceID}</h1>
        <div className="button-container">
          {hardwareModules.map((item) => (
            <HardwareModule
              onStartClick={this.handleStartButtonClick}
              onStopClick={this.handleStopButtonClick}
              key={item.name}
              hardwareModule={item}
            />
          ))}
        </div>
        <div className="mb-5">
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
            className="btn btn-outline-primary mt-4 mr-2 "
          >
            <i className="fas fa-sync"></i>&nbsp; گزارش گیری
          </button>
        </div>

        <div className="report-container">
          <div className="report-header">
            <i
              onClick={this.handleExcelButtonClick}
              className="icon-btn fa fa-file-excel"
            ></i>
            <i className="icon-btn fa fa-print"></i>
          </div>
          <div className="report-content">
            <ReportTable
              columns={this.state.columns}
              data={this.state.reportData}
            />
          </div>
        </div>
      </div>
    );
  }

  handleExcelButtonClick = async () => {
    const deviceID = this.props.match.params.deviceID;
    const downloadOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        deviceID: deviceID,
        ...authData,
      }),
      url: `${config.apiBaseURL}/download-report.php`,
    };

    const downloadResponse = await axios(downloadOptions);
    if (downloadResponse.data.status) {
      const downloadToken = downloadResponse.data.body["download-token"];
      window.open(
        `${config.apiBaseURL}/download.php?token=${downloadToken}&deviceID=${deviceID}`
      );
    }
  };

  handleOnDialogEnds = () => {
    this.setState({ dialogIsVisible: false });
  };

  handleLockButtonClick = async () => {
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...authData,
        devicePhoneNumber: this.state.phoneNumber,
        command: "DOOR",
      }),
      url: `${config.apiBaseURL}/command.php`,
    };

    const response = await axios(options);
    if (response.data === 1) {
      alert("دستور ارسال شد");
    }
  };

  handleReportingButtonClick = async () => {
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...authData,
        devicePhoneNumber: this.state.phoneNumber,
        command: "G",
      }),
      url: `${config.apiBaseURL}/command.php`,
    };

    const response = await axios(options);
    if (response.data === 1) {
      alert("دستور ارسال شد");
    }
  };

  handleStartButtonClick = async (item) => {
    const textSMS = item["sms_text_on"];
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...authData,
        devicePhoneNumber: this.state.phoneNumber,
        command: textSMS,
      }),
      url: `${config.apiBaseURL}/command.php`,
    };

    const response = await axios(options);
    if (response.data === 1) {
      alert("دستور ارسال شد");
    }
  };

  handleStopButtonClick = async (item) => {
    console.log(item);
    const textSMS = item["sms_text_off"];

    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...authData,
        devicePhoneNumber: this.state.phoneNumber,
        command: textSMS,
      }),
      url: `${config.apiBaseURL}/command.php`,
    };

    const response = await axios(options);
    if (response.data === 1) {
      alert("دستور ارسال شد");
    }
  };
}

export default Device;
