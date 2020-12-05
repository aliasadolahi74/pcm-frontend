import React, { Component } from "react";
import UserDevicesTable from "./userDevicesTable";
import { paginate } from "./utils/paginate";
import Pagination from "./common/pagination";
import axios from "axios";
import qs from "qs";
import config from "../config.json";
import "../services/httpServices";
import { Link } from "react-router-dom";
import { getErrorString } from "./utils/error-converter";
import { authData } from "./../services/authServices";
import AlertDialog from "./alertDialog";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class User extends Component {
  state = {
    userInfo: {},
    devices: [],
    currentPage: 1,
    pageSize: 5,
    isAlertDialogOpen: false,
    selectedDeleteButton: {},
    authData: { username: authData.username, token: authData.token },
  };

  async componentDidMount() {
    const data = {
      clientUsername: this.props.match.params.username,
      ...this.state.authData,
    };
    const userInfoOptions = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(data),
      url: `${config.apiBaseURL}/userInfo.php`,
    };
    const userInfoResponse = await axios(userInfoOptions);

    if (userInfoResponse.data.status) {
      const userInfo = userInfoResponse.data.body[0];

      const userDevicesOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `${config.apiBaseURL}/userDevices.php`,
      };
      const userDevicesResponse = await axios(userDevicesOptions);
      const devices = userDevicesResponse.data.body;
      this.setState({ userInfo, devices });
    }
  }

  render() {
    const {
      devices: allDevices,
      currentPage,
      pageSize,
      userInfo,
      isAlertDialogOpen,
      selectedDeleteButton,
    } = this.state;
    const devices = paginate(allDevices, currentPage, pageSize);
    const username = this.props.match.params.username;
    const { nickname, datetime, isAdmin } = userInfo;
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
              <Link to={`${dir}/admin/editNickname/${username}`}>
                <i className="fa fa-edit icon-btn"></i>
              </Link>
              <span>رمز عبور</span>
              <span>رمزنگاری شده</span>
              {isAdmin === "1" ? (
                <span></span>
              ) : (
                <Link to={`${dir}/admin/editPassword/${username}`}>
                  <i className="fa fa-edit icon-btn"></i>
                </Link>
              )}

              <span>تاریخ ثبت‌نام</span>
              <span className="datetime">{datetime}</span>
            </div>
          </section>
          <section>
            <div className="user-devices-section-header d-flex flex-row justify-content-between">
              <h4 className="title">دستگاه‌ها</h4>
              <Link
                to={`${dir}/admin/device-assignment/${username}`}
                className="btn btn-outline-success"
              >
                <i className="fa fa-plus"></i>&nbsp; تخصیص دستگاه
              </Link>
            </div>
            <div className="devices-box">
              <UserDevicesTable
                devices={devices}
                onDelete={this.handleDelete}
              />
              <Pagination
                currentPage={currentPage}
                itemsCount={allDevices.length}
                onPageChange={this.handlePageChange}
                pageSize={pageSize}
              />
            </div>
          </section>
          <AlertDialog
            open={isAlertDialogOpen}
            onClose={this.handleAlertDialogClose}
            title="قطع دسترسی به دستگاه"
            message="آیا میخواهید دسترسی کاربر به دستگاه مورد نظر را قطع کنید؟"
            onYesClick={() => this.handleYesClick(selectedDeleteButton)}
          />
        </div>
      </div>
    );
  }

  handleDelete = async (item) => {
    this.setState({ isAlertDialogOpen: true, selectedDeleteButton: item });
  };

  onUserDelete = async (item) => {
    this.setState({ isAlertDialogOpen: true, selectedDeleteButton: item });
  };

  handleAlertDialogClose = () => {
    this.setState({ isAlertDialogOpen: false });
  };

  handleYesClick = async (item) => {
    const { authData } = this.state;
    try {
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({ ...authData, deviceID: item.deviceID }),
        url: `${config.apiBaseURL}/delete-device-assignment.php`,
      };

      const deleteDeviceAssignmentResponse = await axios(options);
      const { data: responseData } = deleteDeviceAssignmentResponse;
      const status = responseData.status;
      if (status) {
        const devices = [...this.state.devices];
        const newDevices = devices.filter(
          (deviceItem) => item.deviceID !== deviceItem.deviceID
        );
        this.setState({ devices: newDevices });
      } else {
        alert(getErrorString(responseData.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
    }
    this.setState({ isAlertDialogOpen: false });
  };

  handleEditDeviceNameClick = (item) => {
    console.log(item);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
}

export default User;
