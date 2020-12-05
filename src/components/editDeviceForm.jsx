import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";
import qs from "qs";
import axios from "axios";
import config from "./../config.json";
import { authData } from "./../services/authServices";
import { getErrorString } from "./utils/error-converter";
import { withRouter } from "react-router-dom";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditDeviceForm extends Form {
  state = {
    data: { deviceID: "", deviceName: "", phoneNumber: "" },
    errors: {},
    hardwareList: [],
    authData: { username: authData.username, token: authData.token },
    checkedHardware: [],
  };

  schema = {
    deviceID: Joi.string().required().min(5).max(30).messages({
      "string.empty": "وارد کردن شناسه دستگاه الزامی است",
      "string.min": "طول شناسه دستگاه باید حداقل ۵ کارکتر باشد",
      "string.max": "طول شناسه دستگاه باید حداکثر ۳۰ کارکتر باشد",
    }),
    deviceName: Joi.string().min(5).max(50).required().messages({
      "string.empty": "وارد کردن نام دستگاه الزامی است",
      "string.min": "اندازه نام دستگاه باید حداقل ۵ کارکتر باشد",
      "string.max": "اندازه نام دستگاه باید حداکثر ۵۰ کارکتر باشد",
    }),
    phoneNumber: Joi.string().length(11).required().messages({
      "string.empty": "وارد کردن نام دستگاه الزامی است",
      "string.length": "اندازه شماره سیم کارت باید ۱۱ رقم باشد",
    }),
  };

  async componentDidMount() {
    try {
      const hardwareOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(this.state.authData),
        url: `${config.apiBaseURL}/hardwareList.php`,
      };
      const hardwareListResponse = await axios(hardwareOptions);
      const { data } = hardwareListResponse;
      if (data.status) {
        const hardwareList = data.body;
        this.setState({ hardwareList });
      } else {
        alert(getErrorString(data.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
      console.log(ex);
    }

    try {
      const deviceDetailsOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          ...this.state.authData,
          deviceID: this.props.match.params.deviceID,
        }),
        url: `${config.apiBaseURL}/getDeviceDetails.php`,
      };
      const deviceDetailsResponse = await axios(deviceDetailsOptions);
      const { data: receivedData } = deviceDetailsResponse;
      if (receivedData.status) {
        const details = receivedData.body;
        const { deviceID, deviceName, phoneNumber } = details.deviceInfo;
        const checkedHardware = details.hardwareName.split(",");
        console.log(checkedHardware);
        const data = {
          deviceID: deviceID,
          deviceName: deviceName,
          phoneNumber: phoneNumber,
        };
        this.setState({ checkedHardware, data });
      } else {
        alert(getErrorString(receivedData.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
      console.log(ex);
    }
  }

  handleCheckboxChange = (hardwareName) => {
    const checkedHardwareCloned = [...this.state.checkedHardware];
    const index = checkedHardwareCloned.indexOf(hardwareName);

    if (checkedHardwareCloned[index] !== undefined) {
      console.log(checkedHardwareCloned[hardwareName]);
      const checkedHardware = checkedHardwareCloned.filter((value) => {
        return value !== hardwareName;
      });
      this.setState({ checkedHardware });
    } else {
      checkedHardwareCloned.push(hardwareName);
      this.setState({ checkedHardware: checkedHardwareCloned });
    }
  };

  doSubmit = async () => {
    const { checkedHardware, authData, data: deviceInfo } = this.state;
    try {
      const checkedHardwareString = checkedHardware.join(",");
      const newDeviceOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          ...authData,
          checkedHardware: checkedHardwareString,
          ...deviceInfo,
        }),
        url: `${config.apiBaseURL}/updateDevice.php`,
      };
      const newDeviceResponse = await axios(newDeviceOptions);
      const { data } = newDeviceResponse;
      console.log(newDeviceResponse);
      if (data.status) {
        window.location = `${dir}/admin/devices`;
      } else {
        alert(getErrorString(data.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
      console.log(ex);
    }
  };

  render() {
    const { data, errors, hardwareList, checkedHardware } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} className="d-flex flex-column px-4">
          <div
            className="w-75"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
          >
            <div className="w-75">
              <Input
                name="deviceName"
                type="text"
                value={data.deviceName}
                onChange={this.handleChange}
                label="نام دستگاه"
                error={errors.deviceName}
              />
            </div>

            <div className="w-75">
              <Input
                name="phoneNumber"
                type="text"
                value={data.phoneNumber}
                onChange={this.handleChange}
                label="شماره سیم کارت"
                error={errors.phoneNumber}
              />
            </div>
          </div>

          <div className="form-group">
            <span className="mb-3 mt-3 d-block">
              قابلیت‌های سخت‌افزاری (
              <small>قابلیت‌های دستگاه مورد نظر را وارد نمایید</small>)
            </span>
            <div className="checkbox-container d-flex flex-column">
              <div>
                {hardwareList.map((item) => {
                  const isChecked = checkedHardware.includes(item.name);
                  return (
                    <React.Fragment key={item.name}>
                      <label htmlFor={item.name}>{item.label}</label>
                      <input
                        onChange={() => this.handleCheckboxChange(item.name)}
                        type="checkbox"
                        checked={isChecked}
                        name={item.name}
                        id={item.name}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className="btn btn-primary mt-2 w-25"
          >
            ویرایش اطلاعات
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(EditDeviceForm);
