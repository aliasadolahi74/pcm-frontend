import React, { Component } from "react";
import Pagination from "./common/pagination";
import DeviceTable from "./deviceTable";
import { paginate } from "./utils/paginate";
import { Link } from "react-router-dom";
import axios from "axios";
import "../services/httpServices";
import config from "../config.json";
import qs from "qs";
import "../services/httpServices";
import { authData } from "./../services/authServices";
import { getErrorString } from "./utils/error-converter";

class Devices extends Component {
  state = {
    allDevices: [],
    currentPage: 1,
    pageSize: 10,
    authData: { username: authData.username, token: authData.token },
  };

  async componentDidMount() {
    try {
      const devicesOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(this.state.authData),
        url: `${config.apiBaseURL}/devices.php`,
      };
      const devicesInfo = await axios(devicesOptions);
      const allDevices = devicesInfo.data.body;
      this.setState({ allDevices });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  onDeviceDelete = async (item) => {
    try {
      const devicesOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({ ...this.state.authData, deviceID: item.deviceID }),
        url: `${config.apiBaseURL}/delete-device.php`,
      };
      const deleteDeviceResponse = await axios(devicesOptions);
      const { data } = deleteDeviceResponse;
      if (data.status) {
        const allDevicesCloned = [...this.state.allDevices];
        const allDevices = allDevicesCloned.filter(
          (device) => device.deviceID !== item.deviceID
        );
        this.setState({ allDevices });
      } else {
        alert(getErrorString(data.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
    }
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
              {authData.isAdmin ? (
                <Link className="btn btn-success" to="./new-device">
                  <i className="fa fa-plus"></i>
                </Link>
              ) : null}
            </div>
          </div>
        </section>
        <DeviceTable onDeviceDelete={this.onDeviceDelete} devices={devices} />
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
