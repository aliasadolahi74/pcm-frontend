import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";
import qs from "qs";
import axios from "../services/httpServices";
import config from "../config.json";
import { authData } from "../services/authServices";
import { getErrorString } from "./utils/error-converter";
import { withRouter } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditSMSServicePhoneNumberForm extends Form {
  state = {
    data: { phoneNumber: "" },
    errors: {},
  };

  schema = {
    phoneNumber: Joi.string().max(20).required().messages({
      "any.required": "وارد کردن شماره الزامی است",
      "string.empty": "وارد کردن شماره الزامی است",
      "string.max": "اندازه شماره باید حداکثر ۲۰ رقم باشد",
      "string.length": "اندازه شماره باید حداکثر ۲۰ رقم باشد",
    }),
  };

  async componentDidMount() {
    try {
      const response = await axios.post(
        "/getSMSServicePhoneNumber.php",
        qs.stringify({
          ...authData,
        })
      );

      const { data } = response;
      if (data.ok) {
        const { body } = data;
        const state = { ...this.state };
        state.data = { phoneNumber: body.phoneNumber };
        this.setState(state);
      } else {
        console.log(data.errors);
      }
    } catch (e) {
      console.log(e);
    }
  }

  doSubmit = async () => {
    const { phoneNumber } = this.state.data;

    try {
      const response = await axios.post(
        "/changeSMSServicePhoneNumber.php",
        qs.stringify({
          ...authData,
          phoneNumber,
        })
      );
      const { data } = response;
      console.log(response);
      if (data.ok) {
        toast.success("شماره با موفقیت ویرایش گردید");
      } else {
        toast.error(data.errors);
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
        <Toaster />
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

export default withRouter(EditSMSServicePhoneNumberForm);
