import React, { Component } from "react";
import NewDeviceForm from "./newDeviceForm";

class NewDevice extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <section className="mb-5">
          <div className="section-header">
            <h1 className="section-title">دستگاه جدید</h1>
          </div>
        </section>
        <section>
          <NewDeviceForm />
        </section>
      </React.Fragment>
    );
  }
}

export default NewDevice;
