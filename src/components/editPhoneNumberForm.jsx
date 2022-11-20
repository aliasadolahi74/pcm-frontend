import React from "react";
import Input from "./common/input";
import Joi from "joi";
import Form from "./common/form";
import { withRouter } from "react-router-dom";
import qs from "qs";
import Dialog from "./common/dialog";
import { getErrorString } from "./utils/error-converter";
import { authData } from "../services/authServices";
import axios from "./../services/httpServices";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditPhoneNumberForm extends Form {
  state = {
    data: {
      clientPhoneNumber: "",
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
    clientPhoneNumber: Joi.string()
      .regex(/^[0-9]+$/)
      .required()
      .messages({
        "string.empty": "وارد کردن شماره تماس الزامی است",
        "string.pattern.base": "شماره تماس باید فقط عدد باشد",
      }),
  };

  doSubmit = async () => {
    const { clientUsername } = this.props;
    const editPhoneNumberOption = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...this.state.data,
        ...this.state.authData,
        clientUsername,
      }),
      url: `/editPhoneNumber.php`,
    };
    const editPhoneNumberResponse = await axios(editPhoneNumberOption);
    const status = editPhoneNumberResponse.data.status;
    if (status) {
      window.location = `${dir}/admin/user/${clientUsername}`;
    } else {
      this.setState({
        dialogIsVisible: true,
        dialogMessage: getErrorString(editPhoneNumberResponse.data.errors),
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
            name='clientPhoneNumber'
            type='text'
            value={data.clientPhoneNumber}
            onChange={this.handleChange}
            label='شماره تماس'
            error={errors.clientPhoneNumber}
          />
          <button
            type='submit'
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className='btn btn-primary mt-2'
          >
            ویرایش شماره تماس
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

export default withRouter(EditPhoneNumberForm);
