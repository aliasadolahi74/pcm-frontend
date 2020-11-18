import React, { Component } from "react";
import UserDevicesTable from "./userDevicesTable";
import { paginate } from "./utils/paginate";
import Pagination from "./common/pagination";
import Modal from "./common/modal";
import axios from "axios";
import qs from "qs";
import config from "../config.json";
import "../services/httpServices";
import { authData } from "../services/authServices";
import { Link } from "react-router-dom";

class User extends Component {
  state = {
    userInfo: {},
    devices: [],
    currentPage: 1,
    pageSize: 5,
  };

  async componentDidMount() {
    const data = {
      clientUsername: this.props.match.params.username,
      ...authData,
    };
    const userInfoOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(data),
      url: `${config.apiBaseURL}/userInfo.php`,
    };
    const userInfoResponse = await axios(userInfoOptions);
    const userInfo = userInfoResponse.data.body[0];

    const userDevicesOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: qs.stringify(data),
      url: `${config.apiBaseURL}/userDevices.php`,
    };
    const userDevicesResponse = await axios(userDevicesOptions);
    console.log(userDevicesResponse);
    const devices = userDevicesResponse.data.body;
    this.setState({ userInfo, devices });
  }

  render() {
    const { devices: allDevices, currentPage, pageSize, userInfo } = this.state;
    const devices = paginate(allDevices, currentPage, pageSize);
    const username = this.props.match.params.username;
    const { nickname, datetime } = userInfo;
    return (
      <div>
        <h1>{nickname}</h1>
        <h6 className="mt-3 mb-5">{username}</h6>
        <div className="user-info-container">
          <section>
            <div className="user-section-header d-flex flex-row justify-content-between pl-2">
              <h4 className="title">اطلاعات کاربر</h4>
            </div>
            <div className="user-info-box">
              <span>نام‌کاربری</span>
              <span>{username}</span>
              <span></span>
              <span>نام‌</span>
              <span>{nickname}</span>
              <Link to={"/admin/editNickname/" + username}>
                <i className="fa fa-edit icon-btn"></i>
              </Link>
              <span>رمز عبور</span>
              <span>رمزنگاری شده</span>
              <Link to={"/admin/editPassword/" + username}>
                <i className="fa fa-edit icon-btn"></i>
              </Link>
              <span>تاریخ ثبت‌نام</span>
              <span className="datetime">{datetime}</span>
            </div>
          </section>
          <section>
            <div className="user-devices-section-header d-flex flex-row justify-content-between">
              <h4 className="title">دستگاه‌ها</h4>
              <button
                className="btn btn-outline-success handle-modal"
                modal-id="allocate-device-modal"
              >
                <i className="fa fa-plus"></i>&nbsp; تخصیص دستگاه
              </button>
            </div>
            <div className="devices-box">
              <UserDevicesTable devices={devices} />
              <Pagination
                currentPage={currentPage}
                itemsCount={allDevices.length}
                onPageChange={this.handlePageChange}
                pageSize={pageSize}
              />
            </div>
          </section>
          <Modal id="allocate-device-modal"></Modal>
        </div>
      </div>
    );
  }

  handleEditDeviceNameClick = (item) => {
    console.log(item);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
}

export default User;
