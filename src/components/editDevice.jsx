import React, { Component } from "react";
import EditDeviceForm from "./editDeviceForm";
class EditDevice extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <section className="mb-5">
          <div className="section-header">
            <h1 className="section-title">ویرایش دستگاه</h1>
          </div>
        </section>
        <section>
          <EditDeviceForm />
        </section>
      </React.Fragment>
    );
  }
}

export default EditDevice;
