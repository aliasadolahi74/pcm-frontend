import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";
import qs from "qs";
import axios from "../services/httpServices";
import { authData } from "../services/authServices";
import { withRouter } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

class EditStatisticsSettingsForm extends Form {
  state = {
    data: { updateInterval: "" },
    errors: {},
  };

  schema = {
    updateInterval: Joi.string().required().messages({
      "any.required": "وارد کردن بازه زمانی الزامی است",
      "string.empty": "وارد کردن بازه زمانی الزامی است",
    }),
  };

  async componentDidMount() {
    try {
      const response = await axios.post(
        "/getIntervalValue.php",
        qs.stringify({
          ...authData,
        })
      );
      const { data } = response;
      if (data.ok) {
        const { body } = data;
        const state = { ...this.state };
        state.data = { updateInterval: body.updateInterval };
        this.setState(state);
      } else {
        console.error(data.errors);
      }
    } catch (e) {
      console.error(e);
    }
  }

  doSubmit = async () => {
    const { updateInterval: intervalValue } = this.state.data;
    try {
      const response = await axios.post(
        "/changeIntervalValue.php",
        qs.stringify({
          ...authData,
          intervalValue,
        })
      );
      const { data } = response;
      if (data.ok) {
        toast.success("بازه زمانی با موفقیت ویرایش گردید");
      } else {
        toast.error(data.errors);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
      console.error(ex);
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
                name='updateInterval'
                type='text'
                value={data.updateInterval}
                onChange={this.handleChange}
                label='بازه زمانی (ثانیه)'
                error={errors.updateInterval}
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

export default withRouter(EditStatisticsSettingsForm);
