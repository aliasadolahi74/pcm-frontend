import React from "react";
import Input from "./common/input";
import Joi from "joi";
import Form from "./common/form";
import { withRouter } from "react-router-dom";
import axios from "./../services/httpServices";
import qs from "qs";
import Dialog from "./common/dialog";
import { getErrorString } from "./utils/error-converter";
import { authData } from "../services/authServices";

class EditPasswordForm extends Form {
  state = {
    data: {
      clientPassword: "",
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
    clientPassword: Joi.string().min(6).max(50).required().messages({
      "string.empty": "وارد کردن رمز عبور الزامی است",
      "string.min": "طول رمز عبور باید حداقل ۶ کارکتر باشد",
      "string.max": "طول رمز عبور باید حداکثر ۵۰ کارکتر باشد",
    }),
  };

  doSubmit = async () => {
    const { clientUsername } = this.props;
    const editPasswordOption = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...this.state.data,
        ...this.state.authData,
        clientUsername,
      }),
      url: `/editPassword.php`,
    };
    const editPasswordResponse = await axios(editPasswordOption);
    const status = editPasswordResponse.data.status;
    if (status) {
      // window.location = `${dir}/admin/user/clientUsername`;
    } else {
      this.setState({
        dialogIsVisible: true,
        dialogMessage: getErrorString(editPasswordResponse.data.errors),
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
          className='d-flex flex-column w-25 px-4'
        >
          <Input
            name='clientPassword'
            type='password'
            value={data.clientPassword}
            onChange={this.handleChange}
            label='رمز عبور'
            error={errors.clientPassword}
          />
          <button
            type='submit'
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className='btn btn-primary mt-2'
          >
            ویرایش رمز عبور
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

export default withRouter(EditPasswordForm);
