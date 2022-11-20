import React, { Component } from "react";
import HardwareModule from "./hardwareModule";
import "../services/httpServices";
import { getErrorString } from "./utils/error-converter";
import { authData } from "./../services/authServices";
import ReportTable from "./reportTable";
import { DatePicker } from "jalali-react-datepicker";
import { filterDatetime } from "./utils/filter";
import { Link } from "react-router-dom";
import qs from "qs";
import getToken from "./../services/token";
import axios from "./../services/httpServices";
import { Toaster, toast } from "react-hot-toast";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class Device extends Component {
  state = {
    hardwareModules: [],
    phoneNumber: this.props.match.params.phoneNumber,
    columns: [],
    allReportData: [],
    currentPage: 1,
    pageSize: 15,
    filterStartDate: "",
    filterEndDate: "",
  };

  deviceID = this.props.match.params.deviceID;

  async componentDidMount() {
    const deviceHardwareOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        deviceID: this.props.match.params.deviceID,
        ...authData,
      }),
      url: `/deviceHardwareList.php`,
    };

    const hardwareListResponse = await axios(deviceHardwareOptions);
    console.log(hardwareListResponse);
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
      url: `/deviceInfo.php`,
    };

    const { data } = await axios(deviceInfoOption);
    if (data.status) {
      const { body } = data;
      const { deviceName, description, address } = body;
      this.setState({ deviceName, description, address });
    }

    const deviceReportOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        deviceID: this.props.match.params.deviceID,
        ...authData,
      }),
      url: `/getDeviceReports.php`,
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

  handleDeleteButtonClick = async (item) => {
    const token = getToken();
    const reportID = item.key;
    if (window.confirm("آیا میخواهید این آیتم را حذف کنید؟")) {
      try {
        const response = await axios.post(
          "/deleteReportItem.php",
          qs.stringify({ reportID, deviceID: this.deviceID, token })
        );

        const { data } = response;
        if (data.status) {
          const newState = { ...this.state };
          const newReports = [...newState.allReportData];
          newState.allReportData = newReports.filter(
            (item) => item.key !== reportID
          );
          this.setState(newState);
          toast.success("گزارش با موفقیت حذف شد");
        } else {
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  updateColumnsFromReport = ({ report }) => {
    const reportArray = JSON.parse(report);
    const columns = reportArray.map((item) => {
      return { name: item.name, label: item.label };
    });
    columns.push({ name: "datetime", label: "زمان" });
    if (authData.isAdmin) {
      columns.push({
        name: "deleteButton",
        label: "",
        content: (item) => (
          <button
            onClick={() => this.handleDeleteButtonClick(item)}
            className='btn btn-danger'
            style={{ fontSize: 12 }}
          >
            <i className='fa fa-trash '></i>
          </button>
        ),
      });
    }

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
    const {
      hardwareModules,
      allReportData,
      columns,
      filterStartDate,
      filterEndDate,
      deviceName,
      description,
      address,
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

    return (
      <div className='device-info-container'>
        <Toaster />
        <h1>{deviceName}</h1>
        <h6 className='mt-3 mb-5'>{address}</h6>
        <h6 className='mt-3 mb-5'>{description}</h6>
        <div className='button-container'>
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

        <div className='report-container'>
          <div className='report-header'>
            <Link
              to={`${dir}/admin/report/${this.deviceID}`}
              className='icon-btn fa fa-file-excel'
            />
            <Link to={`${dir}/admin/print/${this.deviceID}`}>
              <i className='icon-btn fa fa-print'></i>
            </Link>
            <DatePicker
              onClickSubmitButton={this.handleOnStartDateClick}
              label='از تاریخ: '
              timePicker={false}
            />
            <DatePicker
              onClickSubmitButton={this.handleOnEndDateClick}
              label='تا تاریخ: '
              timePicker={false}
            />
            <button
              className='btn btn-sm btn-secondary'
              onClick={this.resetFilters}
            >
              حذف فیلتر
            </button>

            <button
              className='btn btn-sm btn-primary mr-2'
              onClick={this.handleSyncButton}
            >
              <i className='fa fa-sync'></i> ‌ همگام‌سازی اطلاعات
            </button>
          </div>
          <div className='report-content'>
            <ReportTable columns={columns} data={conditionedData} />
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

  handleOnDialogEnds = () => {
    this.setState({ dialogIsVisible: false });
  };

  handleStartButtonClick = async (item) => {
    this.sendTextMessage(item["sms_text_on"]);
  };

  handleStopButtonClick = async (item) => {
    this.sendTextMessage(item["sms_text_off"]);
  };

  handleSyncButton = () => {
    window.location.reload();
  };

  sendTextMessage = async (textSMS) => {
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...authData,
        deviceID: this.deviceID,
        command: textSMS,
      }),
      url: `/command.php`,
    };

    const response = await axios(options);
    console.log(response);
    if (response.data.status) {
      alert("دستور ارسال شد");
    } else {
      alert(getErrorString(response.data.errors));
    }
  };
}

export default Device;
