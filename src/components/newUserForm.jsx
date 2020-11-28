import React from "react";
import Form from "./common/form";
import Joi from "joi";
import Input from "./common/input";
import "./../services/httpServices";
import { authData } from "./../services/authServices";
import axios from "axios";
import qs from "qs";
import config from "../config.json";
import { getErrorString } from "./utils/error-converter";
import Dialog from "./common/dialog";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class NewUserForm extends Form {
  state = {
    data: {
      clientUsername: "",
      clientPassword: "",
      clientNickname: "",
    },
    errors: {},
    dialogIsVisible: false,
    dialogMessage: "",
    dialogSuccess: true,
  };

  schema = {
    clientUsername: Joi.string().required().min(8).max(30).messages({
      "string.empty": "وارد کردن نام کاربری الزامی است",
      "string.min": "طول نام کاربری باید حداقل ۸ کارکتر باشد",
      "string.max": "طول نام کاربری باید حداکثر ۳۰ کارکتر باشد",
    }),
    clientNickname: Joi.string()
      .max(50)
      .regex(/^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+\d]+$/s)
      .messages({
        "string.empty": "وارد کردن نام الزامی است",
        "string.max": "طول نام باید حداکثر ۵۰ کارکتر باشد",
        "string.pattern.base": "نام باید فارسی باشد",
      }),
    clientPassword: Joi.string().min(8).max(50).required().messages({
      "string.empty": "وارد کردن رمز عبور الزامی است",
      "string.min": "طول رمز عبور باید حداقل ۸ کارکتر باشد",
      "string.max": "طول رمز عبور باید حداکثر ۵۰ کارکتر باشد",
    }),
  };

  doSubmit = async () => {
    const serverData = { ...this.state.data, ...authData };
    const newUserOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(serverData),
      url: `${config.apiBaseURL}/newUser.php`,
    };
    const newUserResponse = await axios(newUserOptions);
    const { data: responseData } = newUserResponse;
    if (responseData.status === true) {
      window.location = `${dir}/admin/users`;
    } else {
      this.setState({
        dialogIsVisible: true,
        dialogMessage: getErrorString(responseData.errors),
        dialogSuccess: false,
      });
    }
  };

  render() {
    const {
      data,
      errors,
      dialogIsVisible,
      dialogSuccess,
      dialogMessage,
    } = this.state;
    return (
      <React.Fragment>
        <form
          onSubmit={this.handleSubmit}
          className="d-flex flex-column w-25 px-4"
        >
          <Input
            autoFocus
            name="clientUsername"
            type="text"
            value={data.clientUsername}
            onChange={this.handleChange}
            label="نام کاربری"
            error={errors.clientUsername}
          />

          <Input
            name="clientNickname"
            type="text"
            value={data.clientNickname}
            onChange={this.handleChange}
            label="نام"
            error={errors.clientNickname}
          />

          <Input
            name="clientPassword"
            type="password"
            value={data.clientPassword}
            onChange={this.handleChange}
            label="رمز عبور"
            error={errors.clientPassword}
          />
          <button
            type="submit"
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className="btn btn-primary mt-2"
          >
            ثبت کاربر جدید
          </button>
        </form>
        <Dialog
          id="dialog"
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

export default NewUserForm;
