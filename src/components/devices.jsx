import React, { Component } from "react";
import DeviceTable from "./deviceTable";
import { Link } from "react-router-dom";
import axios from "./../services/httpServices";
import "../services/httpServices";
import qs from "qs";
import "../services/httpServices";
import { authData } from "./../services/authServices";
import { getErrorString } from "./utils/error-converter";
import AlertDialog from "./alertDialog";
class Devices extends Component {
  state = {
    allDevices: [],
    authData: { username: authData.username, token: authData.token },
    isAlertDialogOpen: false,
    selectedDeleteButton: {},
  };

  async componentDidMount() {
    try {
      const devicesOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(this.state.authData),
        url: `/devices.php`,
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
    this.setState({ isAlertDialogOpen: true, selectedDeleteButton: item });
  };

  render() {
    const { allDevices, isAlertDialogOpen, selectedDeleteButton } = this.state;
    return (
      <React.Fragment>
        <section className='mb-2'>
          <div className='section-header'>
            <h1 className='section-title'>دستگاه‌ها</h1>
            <div className='button-container'>
              {authData.isAdmin ? (
                <Link className='btn btn-success' to='./new-device'>
                  <i className='fa fa-plus'></i>
                </Link>
              ) : null}
            </div>
          </div>
        </section>
        <DeviceTable
          onDeleteDeviceButtonClick={this.onDeviceDelete}
          devices={allDevices}
        />
        <AlertDialog
          open={isAlertDialogOpen}
          onClose={this.handleAlertDialogClose}
          title='حذف دستگاه'
          message='آیا میخواهید این دستگاه را حذف کنید؟'
          onYesClick={() => this.handleYesClick(selectedDeleteButton)}
        />
      </React.Fragment>
    );
  }

  handleAlertDialogClose = () => {
    this.setState({ isAlertDialogOpen: false });
  };

  handleYesClick = async (item) => {
    try {
      const devicesOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({ ...this.state.authData, deviceID: item.deviceID }),
        url: `/delete-device.php`,
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

    this.setState({ isAlertDialogOpen: false });
  };
}

export default Devices;
