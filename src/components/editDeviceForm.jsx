import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";
import qs from "qs";
import { authData } from "./../services/authServices";
import { getErrorString } from "./utils/error-converter";
import { withRouter } from "react-router-dom";
import TextArea from "./common/textarea";
import NewHardwareItem from "./newHardwareItem";
import { v4 } from "uuid";
import axios from "./../services/httpServices";
import getToken from "../services/token";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditDeviceForm extends Form {
  state = {
    data: {
      deviceID: "",
      deviceName: "",
      phoneNumber: "",
      address: "",
      description: "",
      installationDatetime: "",
      type: "",
    },
    errors: {},
    hardwareList: [],
    authData: { username: authData.username, token: authData.token },
    checkedHardware: [],
    newHardwares: [],
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
    address: Joi.string()
      .regex(/^[، آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+\d]+$/s)
      .allow("", null)
      .messages({
        "string.pattern.base":
          "محل نصب باید فارسی باشد. استفاده از کارکترهایی بجز - و ، غیرمجاز است",
      }),
    description: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "توضیحات دارای کارکتر غیرمجاز است",
      }),

    type: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "نوع دستگاه دارای کارکتر غیرمجاز است",
      }),

    installationDatetime: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "تاریخ نصب دارای کارکتر غیرمجاز است",
      }),
  };

  async componentDidMount() {
    try {
      const hardwareOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          ...this.state.authData,
          deviceID: this.props.match.params.deviceID,
        }),
        url: `/hardwareList.php`,
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
        url: `/getDeviceDetails.php`,
      };
      const deviceDetailsResponse = await axios(deviceDetailsOptions);
      const { data: receivedData } = deviceDetailsResponse;
      if (receivedData.status) {
        const details = receivedData.body;
        const {
          deviceID,
          deviceName,
          phoneNumber,
          address,
          description,
          installationDatetime,
          type,
        } = details.deviceInfo;
        const checkedHardware = details.hardwareName.split(",");
        console.log(checkedHardware);
        const data = {
          deviceID,
          deviceName,
          phoneNumber,
          address,
          description,
          installationDatetime,
          type,
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
        url: `/updateDevice.php`,
      };
      const newDeviceResponse = await axios(newDeviceOptions);
      const { data } = newDeviceResponse;
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

  handleNewHardwareBtnClick = () => {
    const state = { ...this.state };
    let { newHardwares } = state;
    newHardwares = [...newHardwares, {}];
    state.newHardwares = newHardwares;
    this.setState(state);
  };

  handleOnSubmitHardwareItemClick = async (item) => {
    try {
      const token = getToken();
      const deviceID = this.props.match.params.deviceID;
      const response = await axios.post(
        "/addNewHardware.php",
        qs.stringify({ token, ...item, deviceID })
      );
      console.log({ token, ...item });
      console.log(response);
      const { data } = response;
      if (data.ok) {
        const newState = { ...this.state };
        const newHardwareList = [...newState.hardwareList];
        newHardwareList.push(item);
        newState.hardwareList = newHardwareList;
        this.setState(newState);
      } else {
        console.log(data.errors);
      }
    } catch (e) {
      console.log(e);
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
                name='deviceName'
                type='text'
                value={data.deviceName}
                onChange={this.handleChange}
                label='نام دستگاه'
                error={errors.deviceName}
              />
            </div>

            <div className='w-75'>
              <Input
                name='phoneNumber'
                type='text'
                value={data.phoneNumber}
                onChange={this.handleChange}
                label='شماره سیم کارت'
                error={errors.phoneNumber}
              />
            </div>

            <div className='w-75'>
              <Input
                name='address'
                type='text'
                value={data.address}
                onChange={this.handleChange}
                label='محل نصب'
                error={errors.address}
              />
            </div>

            <div className='w-75'>
              <TextArea
                name='description'
                type='text'
                value={data.description}
                onChange={this.handleChange}
                label='توضیحات'
                error={errors.description}
              />
            </div>

            <div className='w-75'>
              <TextArea
                name='installationDatetime'
                type='text'
                value={data.installationDatetime}
                onChange={this.handleChange}
                label='تاریخ نصب'
                error={errors.installationDatetime}
              />
            </div>

            <div className='w-75'>
              <TextArea
                name='type'
                type='text'
                value={data.type}
                onChange={this.handleChange}
                label='نوع دستگاه'
                error={errors.type}
              />
            </div>
          </div>

          <div className='form-group'>
            <span className='mb-3 mt-3 d-block'>
              قابلیت‌های سخت‌افزاری (
              <small>قابلیت‌های دستگاه مورد نظر را وارد نمایید</small>)
              <button
                type='button'
                onClick={this.handleNewHardwareBtnClick}
                style={{
                  width: 30,
                  height: 30,
                  fontSize: 10,
                  display: "inline-flex",
                  marginRight: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className='btn btn-success'
              >
                <i className='fa fa-plus'></i>
              </button>
            </span>
            <div className='checkbox-container d-flex flex-column'>
              <div>
                {hardwareList.map((item) => {
                  const isChecked = checkedHardware.includes(item.name);
                  return (
                    <div key={item.name}>
                      <label htmlFor={item.name}>{item.label}</label>
                      <input
                        onChange={() => this.handleCheckboxChange(item.name)}
                        type='checkbox'
                        checked={isChecked}
                        name={item.name}
                        id={item.name}
                      />
                    </div>
                  );
                })}
              </div>
              {this.state.newHardwares.length > 0 ? (
                <div
                  className='d-flex flex-column mt-3 border border-gray rounded p-2 bg-white flex-end'
                  style={{ rowGap: 10 }}
                >
                  {this.state.newHardwares.map((item, i) => (
                    <NewHardwareItem
                      key={`${i}${v4()}`}
                      onSubmitHardwareItemClick={
                        this.handleOnSubmitHardwareItemClick
                      }
                    />
                  ))}
                </div>
              ) : null}
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
