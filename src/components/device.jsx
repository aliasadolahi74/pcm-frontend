import React, { Component } from "react";
import HardwareModule from "./hardwareModule";
import axios from "axios";
import qs from "qs";
import "../services/httpServices";
import config from "../config.json";
import { authData } from "./../services/authServices";
import ReportTable from "./reportTable";
import { paginate } from "./utils/paginate";
import Pagination from "./common/pagination";
import { DatePicker } from "jalali-react-datepicker";
import { filterDatetime } from "./utils/filter";
class Device extends Component {
  state = {
    hardwareModules: [],
    phoneNumber: this.props.match.params.phoneNumber,
    columns: [],
    allReportData: [],
    currentPage: 1,
    pageSize: 5,
    filterStartDate: "",
    filterEndDate: "",
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

    const deviceInfoOption = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        deviceID: this.props.match.params.deviceID,
        ...authData,
      }),
      url: `${config.apiBaseURL}/deviceInfo.php`,
    };

    const { data } = await axios(deviceInfoOption);
    if (data.status) {
      this.setState({ deviceName: data.body.deviceName });
    }

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
    if (deviceReportResponse.data.status) {
      const deviceReportArray = deviceReportResponse.data.body;
      if (deviceReportArray.length > 0) {
        const columns = this.updateColumnsFromReport(deviceReportArray[0]);
        const reportData = this.updateDataFromReport(deviceReportArray);
        this.setState({ columns, allReportData: reportData });
      }
    }
  }

  updateColumnsFromReport = ({ report }) => {
    const reportArray = JSON.parse(report);
    const columns = reportArray.map((item) => {
      return { name: item.name, label: item.label };
    });
    columns.push({ name: "datetime", label: "زمان" });
    return columns;
  };

  updateDataFromReport = (reportArray) => {
    const reportData = [];
    for (const item of reportArray) {
      const reportItem = JSON.parse(item.report);
      const reportItemData = {};
      reportItem.forEach((reportItem) => {
        reportItemData[reportItem.name] = reportItem.status;
        reportItemData["key"] = item.key;
        reportItemData["datetime"] = item.datetime;
      });
      reportData.push(reportItemData);
    }
    return reportData;
  };

  render() {
    const deviceID = this.props.match.params.deviceID;

    const {
      hardwareModules,
      allReportData,
      columns,
      pageSize,
      currentPage,
      filterStartDate,
      filterEndDate,
      deviceName,
    } = this.state;

    let conditionedData = {};
    if (filterStartDate !== "" && filterEndDate !== "") {
      conditionedData = filterDatetime(
        filterStartDate,
        filterEndDate,
        allReportData
      );
    } else {
      conditionedData = allReportData;
    }
    const reportData = paginate(conditionedData, currentPage, pageSize);
    return (
      <div className="device-info-container">
        <h1>{deviceName}</h1>
        <h6 className="mt-3 mb-5">{deviceID}</h6>
        <div className="button-container">
          {hardwareModules.map((item) => {
            return (
              <HardwareModule
                onStartClick={this.handleStartButtonClick}
                onStopClick={this.handleStopButtonClick}
                key={item.name}
                hardwareModule={item}
              />
            );
          })}
        </div>
        <div className="mb-5">
          <button
            type="button"
            onClick={this.handleLockButtonClick}
            className="btn btn-outline-primary mt-4"
          >
            <i className="fas fa-lock"></i>&nbsp; فرمان تحریک قفل برقی
          </button>
          <button
            id=""
            type="button"
            onClick={this.handleReportingButtonClick}
            className="btn btn-outline-primary mt-4 mr-2 "
          >
            <i className="fas fa-sync"></i>&nbsp; درخواست گزارش لحظه‌ای
          </button>
        </div>

        <div className="report-container">
          <div className="report-header">
            <i
              onClick={this.handleExcelButtonClick}
              className="icon-btn fa fa-file-excel"
            ></i>
            <i className="icon-btn fa fa-print"></i>
            <DatePicker
              onClickSubmitButton={this.handleOnStartDateClick}
              label="از تاریخ: "
              timePicker={false}
            />
            <DatePicker
              onClickSubmitButton={this.handleOnEndDateClick}
              label="تا تاریخ: "
              timePicker={false}
            />
            <button
              className="btn btn-sm btn-secondary"
              onClick={this.resetFilters}
            >
              حذف فیلتر
            </button>
          </div>
          <div className="report-content">
            <ReportTable columns={columns} data={reportData} />
            <Pagination
              itemsCount={conditionedData.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }

  resetFilters = () => {
    this.setState({ filterStartDate: "", filterEndDate: "", currentPage: 1 });
  };

  handleOnStartDateClick = ({ value }) => {
    this.setState({ filterStartDate: value["_i"] });
  };
  handleOnEndDateClick = ({ value }) => {
    this.setState({ filterEndDate: value["_i"] });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

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
