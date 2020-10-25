import React, { Component } from "react";
import Modal from "./common/modal";
import Pagination from "./common/pagination";
import DeviceTable from "./deviceTable";
import deviceList from "../server-files/devices.json";
import { paginate } from "./utils/paginate";

class Devices extends Component {
  state = {
    allDevices: deviceList.devices,
    currentPage: 1,
    pageSize: 2,
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { allDevices, currentPage, pageSize } = this.state;
    const devices = paginate(allDevices, currentPage, pageSize);
    return (
      <React.Fragment>
        <section className="mb-2">
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
        <DeviceTable devices={devices} />
        <Pagination
          itemsCount={allDevices.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

export default Devices;
