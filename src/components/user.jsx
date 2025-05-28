import React, { Component } from "react";
import UserDevicesTable from "./userDevicesTable";
import axios from "./../services/httpServices";
import qs from "qs";
import "../services/httpServices";
import { Link } from "react-router-dom";
import { getErrorString } from "./utils/error-converter";
import { authData } from "./../services/authServices";
import AlertDialog from "./alertDialog";
import JDate from "jalali-date";
import { Modal, Textarea, UnstyledButton, Button, Switch } from "@mantine/core";
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
    lastTimeLogin: null,
    messageModalIsOpened: false,
    hasChangingPermission: null,
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
      url: `/userInfo.php`,
    };
    const userInfoResponse = await axios(userInfoOptions);

    if (userInfoResponse.data.status) {
      const allInfo = userInfoResponse.data.body;
      const branches = allInfo["branches"];
      let lastTimeLogin = null;
      if (allInfo["lastTimeLogin"].length > 0) {
        const date = new Date(allInfo["lastTimeLogin"]);
        const jdate = new JDate(date);
        lastTimeLogin = `${jdate.format(
          "YYYY/MM/DD"
        )}  ${date.toLocaleTimeString("en-GB")}`;
      }
      const userInfo = allInfo[0];
      const userDevicesOptions = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `/userDevices.php`,
      };
      const userDevicesResponse = await axios(userDevicesOptions);
      const devices = userDevicesResponse.data.body;
      // const branches = allInfo.branches;
      this.setState({
        userInfo,
        devices,
        allInfo,
        branches,
        lastTimeLogin,
        hasChangingPermission:
          userInfo.hasChangingPermission === "0" ? false : true,
      });
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
        url: `/setBranch.php`,
      };
      const setBranchResponse = await axios(setBranchOptions);
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
        url: `/deleteBranch.php`,
      };
      const setBranchResponse = await axios(setBranchOptions);
      const { branches } = setBranchResponse.data.body;
      this.setState({ branches });
    }
  };

  setMessageModalOpened = (state) => {
    const oldState = { ...this.state };
    oldState.messageModalIsOpened = state;
    this.setState(oldState);
  };

  handleEditMessageClick = async () => {
    try {
      const messageForUser = this.state.messageForUser;
      const data = {
        clientUsername: this.props.match.params.username,
        ...this.state.authData,
        messageForUser,
      };
      const userInfoOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `/setMessageForUser.php`,
      };
      const messageEditResponse = await axios(userInfoOptions);

      if (messageEditResponse.data.status) {
        this.setMessageModalOpened(false);
      } else {
        alert(messageEditResponse.data.errors[0].message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  handleSwitchPermissionChange = async (e) => {
    const { checked } = e.currentTarget;

    try {
      const data = {
        clientUsername: this.props.match.params.username,
        ...this.state.authData,
        status: checked ? 1 : 0,
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `/toggleEditPermission.php`,
      };

      const response = await axios(options);

      if (response.data.status) {
        const state = { ...this.state };
        state.hasChangingPermission = parseInt(
          response.data.body.hasChangingPermission
        );
        this.setState(state);
      } else {
        alert(response.data.errors[0].message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const {
      devices,
      userInfo,
      isAlertDialogOpen,
      selectedDeleteButton,
      lastTimeLogin,
    } = this.state;
    const username = this.props.match.params.username;
    const {
      nickname,
      datetime,
      isAdmin,
      address,
      phoneNumber,
      messageForUser,
    } = userInfo;

    return (
      <div>
        <Modal
          onClose={() => {
            this.setMessageModalOpened(false);
          }}
          opened={this.state.messageModalIsOpened}
        >
          <Textarea
            styles={{ input: { textAlign: "right" } }}
            placeholder={"پیام به کاربر"}
            value={messageForUser}
            onChange={(e) => {
              const state = { ...this.state };
              state.messageForUser = e.currentTarget.value;
              const userInfo = { ...state.userInfo };
              userInfo.messageForUser = e.currentTarget.value;
              state.userInfo = userInfo;
              this.setState(state);
            }}
          />

          <Button
            onClick={this.handleEditMessageClick}
            color='teal'
            style={{ marginTop: 10 }}
          >
            ثبت
          </Button>
        </Modal>
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
                    <i className='fa fa-edit icon-btn'></i>
                  </Link>
                  <span>تلفن همراه</span>
                  <span>{phoneNumber}</span>
                  <Link to={`${dir}/admin/editPhoneNumber/${username}`}>
                    <i className='fa fa-edit icon-btn'></i>
                  </Link>

                  <span>آدرس</span>
                  <span className='small'>{address}</span>
                  <Link to={`${dir}/admin/editAddress/${username}`}>
                    <i className='fa fa-edit icon-btn'></i>
                  </Link>
                </React.Fragment>
              )}

              <span>تاریخ ثبت‌نام</span>
              <span className='datetime'>{datetime}</span>
              <span></span>

              <span>پیام به کاربر</span>
              <span className='datetime'>{messageForUser}</span>
              <UnstyledButton
                onClick={() => {
                  this.setMessageModalOpened(true);
                }}
              >
                <i className='fa fa-edit icon-btn'></i>
              </UnstyledButton>

              {lastTimeLogin ? (
                <>
                  <span>آخرین ورود</span>
                  <span className='datetime'>{lastTimeLogin}</span>
                  <span></span>
                </>
              ) : null}

              <span>اجازه تغییر جزئیات</span>
              <span className='datetime'>
                <Switch
                  checked={this.state.hasChangingPermission}
                  size='lg'
                  onLabel={"دارد"}
                  offLabel={"ندارد"}
                  onChange={this.handleSwitchPermissionChange}
                />
              </span>
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
        url: `/delete-device-assignment.php`,
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
}

export default User;
