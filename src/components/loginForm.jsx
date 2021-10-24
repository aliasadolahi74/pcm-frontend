import React from "react";
import Input from "./common/input";
import Joi from "joi";
import Form from "./common/form";
import { withRouter } from "react-router-dom";
import axios from "axios";
import config from "../config.json";
import qs from "qs";
import Dialog from "./common/dialog";
import { getErrorString } from "./utils/error-converter";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
    dialogIsVisible: false,
    dialogMessage: "",
    dialogSuccess: true,
  };

  schema = {
    username: Joi.string().required().min(8).max(30).messages({
      "string.empty": "وارد کردن نام کاربری الزامی است",
      "string.min": "طول نام کاربری باید حداقل ۸ کارکتر باشد",
      "string.max": "طول نام کاربری باید حداکثر ۳۰ کارکتر باشد",
    }),
    password: Joi.string().min(8).max(50).required().messages({
      "string.empty": "وارد کردن رمز عبور الزامی است",
      "string.min": "طول رمز عبور باید حداقل ۸ کارکتر باشد",
      "string.max": "طول رمز عبور باید حداکثر ۵۰ کارکتر باشد",
    }),
  };

  doSubmit = async () => {
    // call server

    const loginOptions = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(this.state.data),
      url: `${config.apiBaseURL}/login.php`,
    };
    const loginInfo = await axios(loginOptions);
    const status = loginInfo.data.status;
    console.log(loginInfo);
    if (status) {
      const token = loginInfo.data.body.token;
      localStorage.setItem("token", token);
      window.location = `${dir}/Admin`;
    } else {
      this.setState({
        dialogIsVisible: true,
        dialogMessage: getErrorString(loginInfo.data.errors),
        dialogSuccess: false,
      });
    }
  };

  render() {
    const { data, errors, dialogIsVisible, dialogMessage, dialogSuccess } =
      this.state;
    return (
      <React.Fragment>
        <form
          onSubmit={this.handleSubmit}
          className='d-flex align-items-center justify-content-center flex-column w-75 px-4'
        >
          <Input
            autoFocus
            name='username'
            type='text'
            value={data.username}
            onChange={this.handleChange}
            className='w-100'
            label='نام کاربری'
            error={errors.username}
          />
          <Input
            name='password'
            type='password'
            value={data.password}
            onChange={this.handleChange}
            className='w-100'
            label='رمز عبور'
            error={errors.password}
          />
          <button
            type='submit'
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className='btn btn-success w-100 mt-2'
          >
            ورود
          </button>
        </form>
        <Dialog
          id='dialog'
          isVisible={dialogIsVisible}
          onDialogEnds={this.handleOnDialogEnds}
          message={dialogMessage}
          success={dialogSuccess}
        />
      </React.Fragment>
    );
  }

  handleOnDialogEnds = () => {
    this.state.dialogIsVisible = false;
  };
}

export default withRouter(LoginForm);
