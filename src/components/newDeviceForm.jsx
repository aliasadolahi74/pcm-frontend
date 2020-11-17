import React from "react";
import Joi from "joi";
import Input from "./common/input";
import Form from "./common/form";

class NewDeviceForm extends Form {
  state = {
    data: { deviceID: "", deviceName: "" },
    errors: {},
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
  };

  doSubmit = () => {
    console.log("submitted");
    // call server
  };

  render() {
    const { data, errors } = this.state;
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit} className="d-flex flex-column px-4">
          <div className="w-25">
            <Input
              autoFocus
              name="deviceID"
              type="text"
              value={data.username}
              onChange={this.handleChange}
              label="شناسه دستگاه"
              error={errors.username}
            />

            <Input
              name="deviceName"
              type="text"
              value={data.nikname}
              onChange={this.handleChange}
              label="نام دستگاه"
              error={errors.nikname}
            />
          </div>

          <div className="form-group">
            <span className="mb-3 mt-3 d-block">
              قابلیت‌های سخت‌افزاری (
              <small>قابلیت‌های دستگاه مورد نظر را وارد نمایید</small>)
            </span>
            <div className="checkbox-container d-flex flex-column">
              <div>
                <label htmlFor="engine">موتور</label>
                <input type="checkbox" name="engine" id="engine" />
                <label htmlFor="security">دزدگیر</label>
                <input type="checkbox" name="security" id="security" />
                <label htmlFor="commandTimer">رله ساعت فرمان</label>
                <input type="checkbox" name="commandTimer" id="commandTimer" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={this.validate()}
            onClick={this.handleSubmitButton}
            className="btn btn-primary mt-2 w-25"
          >
            ثبت دستگاه جدید
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default NewDeviceForm;
