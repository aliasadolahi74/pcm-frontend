import React, { Component } from "react";
import Modal from "./common/modal";

class Devices extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <section>
          <div className="section-header">
            <h1 className="section-title">دستگاه‌ها</h1>
            <div className="button-container">
              <button
                type="button"
                className="btn btn-success handle-modal"
                modal-id="addDeviceModal"
              >
                <i className="fa fa-user-plus"></i>
              </button>
            </div>
          </div>
          <Modal id="addDeviceModal">اضافه کردن دستگاه</Modal>
        </section>
      </React.Fragment>
    );
  }
}

export default Devices;
