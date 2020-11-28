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
import { authData } from "../services/authServices";
import "../services/httpServices";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditNicknameForm extends Form {
  state = {
    data: {
      clientNickname: "",
    },
    authData: {
      username: authData.username,
      token: authData.token,
    },
    errors: {},
    dialogIsVisible: false,
    dialogMessage: "",
    dialogSuccess: true,
  };

  schema = {
    clientNickname: Joi.string()
      .max(50)
      .regex(/^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+\d]+$/s)
      .messages({
        "string.empty": "وارد کردن نام الزامی است",
        "string.max": "طول نام باید حداکثر ۵۰ کارکتر باشد",
        "string.pattern.base": "نام باید فارسی باشد",
      }),
  };

  doSubmit = async () => {
    const { clientUsername } = this.props;
    const editNicknameOption = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...this.state.data,
        ...this.state.authData,
        clientUsername,
      }),
      url: `${config.apiBaseURL}/editNickname.php`,
    };
    const editNicknameResponse = await axios(editNicknameOption);
    console.log(editNicknameResponse);
    const status = editNicknameResponse.data.status;
    if (status) {
      window.location = `${dir}/admin/user/${clientUsername}`;
    } else {
      this.setState({
        dialogIsVisible: true,
        dialogMessage: getErrorString(editNicknameResponse.data.errors),
        dialogSuccess: false,
      });
    }
  };

  render() {
    const {
      data,
      errors,
      dialogIsVisible,
      dialogMessage,
      dialogSuccess,
    } = this.state;
    return (
      <React.Fragment>
        <form
          onSubmit={this.handleSubmit}
          className="d-flex flex-column w-25 px-4"
        >
          <Input
            name="clientNickname"
            type="text"
            value={data.clientNickname}
            onChange={this.handleChange}
            label="نام"
            error={errors.clientNickname}
          />
          <button
            type="submit"
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className="btn btn-primary mt-2"
          >
            ویرایش نام
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

export default withRouter(EditNicknameForm);
