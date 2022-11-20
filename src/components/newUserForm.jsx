import React from "react";
import Form from "./common/form";
import Joi from "joi";
import Input from "./common/input";
import { authData } from "./../services/authServices";
import axios from "./../services/httpServices";
import qs from "qs";
import { getErrorString } from "./utils/error-converter";
import Dialog from "./common/dialog";
import TextArea from "./common/textarea";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class NewUserForm extends Form {
  state = {
    data: {
      clientUsername: "",
      clientPassword: "",
      clientNickname: "",
      phoneNumber: "",
      address: "",
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
    phoneNumber: Joi.string()
      .regex(/^[0-9]+$/)
      .required()
      .messages({
        "string.empty": "وارد کردن شماره تماس الزامی است",
        "string.pattern.base": "شماره تماس باید فقط عدد باشد",
      }),
    address: Joi.string()
      .regex(/^[، آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئج+\d]+$/s)
      .messages({
        "string.pattern.base":
          "آدرس باید فارسی باشد. استفاده از کارکترهایی بجز - و ، غیرمجاز است",
      }),
  };

  doSubmit = async () => {
    const serverData = { ...this.state.data, ...authData };
    const newUserOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(serverData),
      url: `/newUser.php`,
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
    const { data, errors, dialogIsVisible, dialogSuccess, dialogMessage } =
      this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} className='d-flex flex-column px-4'>
          <div className='new-user-input-conatiner'>
            <Input
              autoFocus
              name='clientUsername'
              type='text'
              value={data.clientUsername}
              onChange={this.handleChange}
              label='نام کاربری'
              error={errors.clientUsername}
            />

            <Input
              name='clientNickname'
              type='text'
              value={data.clientNickname}
              onChange={this.handleChange}
              label='نام'
              error={errors.clientNickname}
            />

            <Input
              name='clientPassword'
              type='password'
              value={data.clientPassword}
              onChange={this.handleChange}
              label='رمز عبور'
              error={errors.clientPassword}
            />

            <Input
              name='phoneNumber'
              type='text'
              value={data.phoneNumber}
              onChange={this.handleChange}
              label='شماره تماس'
              error={errors.phoneNumber}
            />

            <TextArea
              name='address'
              value={data.address}
              onChange={this.handleChange}
              label='آدرس'
              error={errors.address}
            />
          </div>

          <button
            type='submit'
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className='btn btn-primary mt-2 w-25'
          >
            ثبت کاربر جدید
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

export default NewUserForm;
