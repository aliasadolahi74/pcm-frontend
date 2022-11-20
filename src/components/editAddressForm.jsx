import React from "react";
import Joi from "joi";
import Form from "./common/form";
import { withRouter } from "react-router-dom";
import axios from "./../services/httpServices";
import qs from "qs";
import Dialog from "./common/dialog";
import { getErrorString } from "./utils/error-converter";
import { authData } from "../services/authServices";
import "../services/httpServices";
import TextArea from "./common/textarea";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditAddressForm extends Form {
  state = {
    data: {
      clientAddress: "",
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
    clientAddress: Joi.string()
      .regex(/^[، آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+\d]+$/s)
      .messages({
        "string.pattern.base":
          "آدرس باید فارسی باشد. استفاده از کارکترهایی بجز - و ، غیرمجاز است",
      }),
  };

  doSubmit = async () => {
    const { clientUsername } = this.props;
    const editAddressOption = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...this.state.data,
        ...this.state.authData,
        clientUsername,
      }),
      url: `/editAddress.php`,
    };
    const editAddressResponse = await axios(editAddressOption);
    const status = editAddressResponse.data.status;
    if (status) {
      window.location = `${dir}/admin/user/${clientUsername}`;
    } else {
      this.setState({
        dialogIsVisible: true,
        dialogMessage: getErrorString(editAddressResponse.data.errors),
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
          <TextArea
            name='clientAddress'
            value={data.clientAddress}
            onChange={this.handleChange}
            label='آدرس'
            error={errors.clientAddress}
          />
          <button
            type='submit'
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className='btn btn-primary mt-2'
          >
            ویرایش آدرس
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

export default withRouter(EditAddressForm);
