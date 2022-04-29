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
import UsersDropdown from "./usersDropdown";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class User extends Component {
  state = {
    allInfo: [],
    userInfo: {},
    devices: [],
    currentPage: 1,
    pageSize: 5,
    isAlertDialogOpen: false,
    selectedDeleteButton: {},
    authData: { username: authData.username, token: authData.token },
    branches: [],
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
      const allInfo = userInfoResponse.data.body;
      const branches = allInfo["branches"];
      const userInfo = allInfo[0];
      const userDevicesOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `${config.apiBaseURL}/userDevices.php`,
      };
      const userDevicesResponse = await axios(userDevicesOptions);
      const devices = userDevicesResponse.data.body;
      // const branches = allInfo.branches;
      this.setState({ userInfo, devices, allInfo, branches });
    }
  }

  handleUsersDropDownChange = async (e) => {
    const branchUsername = e.target.value;
    if (branchUsername !== "null") {
      const data = {
        clientUsername: this.props.match.params.username,
        ...this.state.authData,
        branchUsername,
      };
      const setBranchOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `${config.apiBaseURL}/setBranch.php`,
      };
      const setBranchResponse = await axios(setBranchOptions);
      console.log(setBranchResponse);
      const { branches } = setBranchResponse.data.body;
      this.setState({ branches });
    }
  };

  handleDeleteAccessBtnClick = async (item) => {
    const branchUsername = item.branchUsername;
    if (branchUsername !== "null") {
      const data = {
        clientUsername: this.props.match.params.username,
        ...this.state.authData,
        branchUsername,
      };
      const setBranchOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `${config.apiBaseURL}/deleteBranch.php`,
      };
      const setBranchResponse = await axios(setBranchOptions);
      console.log(setBranchResponse);
      const { branches } = setBranchResponse.data.body;
      this.setState({ branches });
    }
  };

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
    const { nickname, datetime, isAdmin, address, phoneNumber } = userInfo;
<<<<<<< HEAD

=======
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
    return (
      <div>
        <h1>{nickname}</h1>
        <h6 className='mt-3 mb-5'>{username}</h6>
        <div className='user-info-container'>
          <section>
            <div className='user-section-header d-flex flex-row justify-content-between pl-2'>
              <h4 className='title'>اطلاعات کاربر</h4>
            </div>
            <div className='user-info-box'>
              <span>نام‌کاربری</span>
              <span>{username}</span>
              <span></span>
              <span>نام‌</span>
              <span>{nickname}</span>
              <Link to={`${dir}/admin/editNickname/${username}`}>
                <i className='fa fa-edit icon-btn'></i>
              </Link>
              <span>رمز عبور</span>
              <span>رمزنگاری شده</span>
              {isAdmin === "1" ? (
                <span></span>
              ) : (
                <React.Fragment>
                  <Link to={`${dir}/admin/editPassword/${username}`}>
<<<<<<< HEAD
                    <i className='fa fa-edit icon-btn'></i>
=======
                    <i className="fa fa-edit icon-btn"></i>
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
                  </Link>
                  <span>تلفن همراه</span>
                  <span>{phoneNumber}</span>
                  <Link to={`${dir}/admin/editPhoneNumber/${username}`}>
<<<<<<< HEAD
                    <i className='fa fa-edit icon-btn'></i>
                  </Link>

                  <span>آدرس</span>
                  <span className='small'>{address}</span>
                  <Link to={`${dir}/admin/editAddress/${username}`}>
                    <i className='fa fa-edit icon-btn'></i>
=======
                    <i className="fa fa-edit icon-btn"></i>
                  </Link>

                  <span>آدرس</span>
                  <span className="small">{address}</span>
                  <Link to={`${dir}/admin/editAddress/${username}`}>
                    <i className="fa fa-edit icon-btn"></i>
>>>>>>> 56f99646e54e4149e299b6afa1c0573d508a1d4c
                  </Link>
                </React.Fragment>
              )}

              <span>تاریخ ثبت‌نام</span>
              <span className='datetime'>{datetime}</span>
              <span></span>
            </div>
          </section>
          <section>
            <div className='user-devices-section-header d-flex flex-row justify-content-between'>
              <h4 className='title'>دستگاه‌ها</h4>
              <Link
                to={`${dir}/admin/device-assignment/${username}`}
                className='btn btn-outline-success'
              >
                <i className='fa fa-plus'></i>&nbsp; تخصیص دستگاه
              </Link>
            </div>
            <div className='devices-box'>
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
            title='قطع دسترسی به دستگاه'
            message='آیا میخواهید دسترسی کاربر به دستگاه مورد نظر را قطع کنید؟'
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
        data: qs.stringify({
          ...authData,
          deviceID: item.deviceID,
          clientUsername: this.props.match.params.username,
        }),
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
