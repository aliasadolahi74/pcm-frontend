import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";
import qs from "qs";
import { authData } from "../services/authServices";
import { getErrorString } from "./utils/error-converter";
import { withRouter } from "react-router-dom";
import TextArea from "./common/textarea";
import NewHardwareItem from "./newHardwareItem";
import { v4 } from "uuid";
import axios from "../services/httpServices";
import getToken from "../services/token";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditDeviceFormForUser extends Form {
  state = {
    data: {
      deviceID: "",
      deviceName: "",
      address: "",
      description: "",
      pumpType: "",
      watt: "",
      current: "",
      guard: "",
    },
    errors: {},
    authData: { username: authData.username, token: authData.token },
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
          address,
          description,
          guard,
          watt,
          current,
          pumpType,
          depth,
        } = details.deviceInfo;

        const data = {
          deviceID,
          deviceName,
          address,
          description,
          guard,
          watt,
          current,
          pumpType,
          depth,
        };
        this.setState({ data });
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

  doSubmit = async () => {
    const { authData, data: deviceInfo } = this.state;
    try {
      const newDeviceOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          ...authData,
          ...deviceInfo,
        }),
        url: `/updateDeviceForUser.php`,
      };
      console.log({
        ...authData,
        ...deviceInfo,
      });
      const newDeviceResponse = await axios(newDeviceOptions);
      console.log(newDeviceResponse);
      const { data } = newDeviceResponse;
      if (data.status) {
        window.location = `${dir}/admin/devices`;
      } else {
        console.log(data.errors);
        // alert(getErrorString(data.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
      console.log(ex);
    }
  };

  render() {
    const { data, errors } = this.state;
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

export default withRouter(EditDeviceFormForUser);
