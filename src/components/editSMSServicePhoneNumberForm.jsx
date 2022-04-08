import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";
import qs from "qs";
import axios from "axios";
import config from "../config.json";
import { authData } from "../services/authServices";
import { getErrorString } from "./utils/error-converter";
import { withRouter } from "react-router-dom";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditDeviceForm extends Form {
  state = {
    data: { deviceID: "", deviceName: "", phoneNumber: "", address: "" },
    errors: {},
    hardwareList: [],
    authData: { username: authData.username, token: authData.token },
    checkedHardware: [],
  };

  schema = {
    phoneNumber: Joi.string().max(20).required().messages({
      "any.required": "وارد کردن شماره الزامی است",
      "string.empty": "وارد کردن نام دستگاه الزامی است",
      "string.max": "اندازه شماره باید حداکثر ۲۰ رقم باشد",
      "string.length": "اندازه شماره باید حداکثر ۲۰ رقم باشد",
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
        const { deviceID, deviceName, phoneNumber, address } =
          details.deviceInfo;
        const checkedHardware = details.hardwareName.split(",");
        console.log(checkedHardware);
        const data = {
          deviceID,
          deviceName,
          phoneNumber,
          address,
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
        <form onSubmit={this.handleSubmit} className='d-flex flex-column px-4'>
          <div
            className='w-75'
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
          >
            <div className='w-75'>
              <Input
                name='phoneNumber'
                type='text'
                value={data.phoneNumber}
                onChange={this.handleChange}
                label='شماره'
                error={errors.phoneNumber}
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className='btn btn-primary mt-2 w-25'
          >
            ویرایش اطلاعات
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(EditDeviceForm);
