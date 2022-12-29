import React, { Component } from "react";
import { DatePicker } from "jalali-react-datepicker";
import { authData } from "../services/authServices";
import axios from "./../services/httpServices";
import qs from "qs";
import report from "../../src/images/report.png";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const startDate = new Date();
startDate.setHours(0, 0, 0, 0);
const endDate = new Date();
endDate.setHours(23, 59, 59, 999);

const dir = process.env.REACT_APP_CUSTOM_DIR;

class Report extends Component {
  state = {
    filterStartDate: startDate.getTime(),
    filterEndDate: endDate.getTime(),
    devices: [],
    deviceID: null,
  };

  async componentDidMount() {
    try {
      const devicesOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(authData),
        url: `/get-devices.php`,
      };
      const devicesInfo = await axios(devicesOptions);
      const devices = devicesInfo.data.body;
      this.setState({ devices });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <section className='mb-5'>
          <div className='section-header'>
            <h1 className='section-title'>دریافت گزارش</h1>
          </div>
        </section>
        <img src={report} style={{ width: 200, marginBottom: 50 }} />
        <section>
          <form
            onSubmit={this.handleSubmit}
            className='d-flex flex-column w-25 px-4 align-items-start w-100'
          >
            <div className='mb-3 d-flex flex-row align-items-center'>
              <label className='text-nowrap ml-2 mb-0' htmlFor={"deviceID"}>
                نام دستگاه
              </label>
              <select
                name='deviceID'
                id='deviceID'
                className='form-control'
                onChange={this.handleSelectChange}
              >
                <option value=''>انتخاب کنید</option>
                {this.state.devices.map((item) => (
                  <option key={item.key} value={item.deviceID}>
                    {item.deviceName + " - " + item.deviceID}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <DatePicker
                onClickSubmitButton={this.handleOnStartDateClick}
                label='از تاریخ: '
                className='align-self-center'
                timePicker={false}
              />
            </div>

            <div className='mb-3'>
              <DatePicker
                onClickSubmitButton={this.handleOnEndDateClick}
                label='تا تاریخ: '
                timePicker={false}
              />
            </div>

            <button
              type='submit'
              onClick={this.handleSubmit}
              className='btn btn-primary mt-2'
            >
              دانلود گزارش
            </button>
          </form>
        </section>
      </React.Fragment>
    );
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { deviceID } = this.state;
    const { filterStartDate, filterEndDate } = this.state;
    const downloadOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        deviceID: deviceID,
        ...authData,
      }),
      url: `/download-report.php`,
    };

    const downloadResponse = await axios(downloadOptions);
    if (downloadResponse.data.status) {
      const downloadToken = downloadResponse.data.body["download-token"];
      const url = `${apiEndpoint}/download.php?token=${downloadToken}&deviceID=${deviceID}&startDatetime=${filterStartDate}&endDatetime=${filterEndDate}`;
      window.open(url);
    }
  };

  handleSelectChange = ({ currentTarget }) => {
    const deviceID = currentTarget.value;
    this.setState({ ...this.state, deviceID });
  };

  handleOnStartDateClick = ({ value }) => {
    const filterStartDate = Date.parse(value["_i"].slice(0, -3) + "T00:00:00");
    this.setState({ filterStartDate });
  };
  handleOnEndDateClick = ({ value }) => {
    const filterEndDate = Date.parse(value["_i"].slice(0, -3) + "T23:59:59");
    this.setState({ filterEndDate });
  };
}

export default Report;
