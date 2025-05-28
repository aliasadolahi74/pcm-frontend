import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";
import qs from "qs";
import axios from "./../services/httpServices";
import { authData } from "./../services/authServices";
import { getErrorString } from "./utils/error-converter";
import TextArea from "./common/textarea";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class NewDeviceForm extends Form {
  state = {
    data: {
      deviceID: "",
      deviceName: "",
      phoneNumber: "",
      address: "",
      description: "",
      installationDatetime: "",
      type: "",
      pumpType: "",
      watt: "",
      current: "",
      guard: "",
    },
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
    address: Joi.string().allow("", null),

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

    pumpType: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "نوع پمپ دارای کارکتر غیرمجاز است",
      }),

    guard: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "نگهبان دارای کارکتر غیرمجاز است",
      }),

    watt: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "توان دارای کارکتر غیرمجاز است",
      }),

    current: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "جریان دارای کارکتر غیرمجاز است",
      }),

    depth: Joi.string()
      .regex(
        /^[A-Za-z0-9، ـ@#$%^*()+آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+.\-\d]+$/s
      )
      .allow("", null)
      .messages({
        "string.pattern.base": "عمق چاه دارای کارکتر غیرمجاز است",
      }),
  };

  async componentDidMount() {
    try {
      const hardwareOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({ ...this.state.authData }),
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
      console.error(ex);
    }
  }

  handleCheckboxChange = (hardwareName) => {
    const checkedHardwareCloned = [...this.state.checkedHardware];
    const index = checkedHardwareCloned.indexOf(hardwareName);

    if (checkedHardwareCloned[index] !== undefined) {
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
        url: `/newDevice.php`,
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
      console.error(ex);
    }
  };

  render() {
    const { data, errors, hardwareList } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} className='d-flex flex-column px-4'>
          <div className='w-75 newDeviceFormInputContainer'>
            <div className='w-75'>
              <Input
                autoFocus
                name='deviceID'
                type='text'
                value={data.deviceID}
                onChange={this.handleChange}
                label='شناسه دستگاه'
                error={errors.deviceID}
              />
            </div>

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

            <div className='w-75'>
              <TextArea
                name='pumpType'
                type='text'
                value={data.pumpType}
                onChange={this.handleChange}
                label='نوع پمپ'
                error={errors.pumpType}
              />
            </div>

            <div className='w-75'>
              <TextArea
                name='guard'
                type='text'
                value={data.guard}
                onChange={this.handleChange}
                label='نگهبان'
                error={errors.guard}
              />
            </div>

            <div className='w-75'>
              <TextArea
                name='watt'
                type='text'
                value={data.watt}
                onChange={this.handleChange}
                label='توان'
                error={errors.watt}
              />
            </div>

            <div className='w-75'>
              <TextArea
                name='current'
                type='text'
                value={data.current}
                onChange={this.handleChange}
                label='شدت جریان'
                error={errors.current}
              />
            </div>

            <div className='w-75'>
              <TextArea
                name='depth'
                type='text'
                value={data.depth}
                onChange={this.handleChange}
                label='عمق چاه'
                error={errors.depth}
              />
            </div>
          </div>

          <div className='form-group'>
            <span className='mb-3 mt-3 d-block'>
              قابلیت‌های سخت‌افزاری (
              <small>قابلیت‌های دستگاه مورد نظر را وارد نمایید</small>)
            </span>
            <div className='checkbox-container d-flex flex-column'>
              <div>
                {hardwareList.map((item) => (
                  <div key={item.name}>
                    <label htmlFor={item.name}>{item.label}</label>
                    <input
                      onChange={() => this.handleCheckboxChange(item.name)}
                      type='checkbox'
                      name={item.name}
                      id={item.name}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type='submit'
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className='btn btn-primary mt-2 w-25'
          >
            ثبت دستگاه
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default NewDeviceForm;
