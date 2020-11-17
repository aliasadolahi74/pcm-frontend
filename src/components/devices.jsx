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

class Devices extends Component {
  state = {
    allDevices: [],
    currentPage: 1,
    pageSize: 10,
  };

  async componentDidMount() {
    try {
      const loginOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(authData),
        url: `${config.apiBaseURL}/devices.php`,
      };
      const devicesInfo = await axios(loginOptions);
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
                  <i className="fa fa-user-plus"></i>
                </Link>
              ) : null}
            </div>
          </div>
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
