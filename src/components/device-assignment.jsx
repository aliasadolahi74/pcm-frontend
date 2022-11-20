import React, { Component } from "react";
import { authData } from "./../services/authServices";
import axios from "./../services/httpServices";
import qs from "qs";
import { getErrorString } from "./utils/error-converter";

const dir = process.env.REACT_APP_CUSTOM_DIR;

class DeviceAssignment extends Component {
  state = {
    clientUsername: this.props.match.params.clientUsername,
    authData: { username: authData.username, token: authData.token },
    data: { deviceID: "" },
    devices: [],
  };

  async componentDidMount() {
    if (!authData.isAdmin) {
      this.props.history.replace(`${dir}/admin/dashboard`);
    } else {
      try {
        const devicesOptions = {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          data: qs.stringify(authData),
          url: `/get-devices.php`,
        };
        const devicesInfo = await axios(devicesOptions);
        const devices = devicesInfo.data.body;
        this.setState({ devices });
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          alert("Bad Request");
        }
      }
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { authData, data, clientUsername } = this.state;

    try {
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({ ...authData, ...data, clientUsername }),
        url: `/assign-device.php`,
      };

      const assigningDeviceResponse = await axios(options);
      const { data: responseData } = assigningDeviceResponse;
      const status = responseData.status;
      if (status) {
        window.location = dir + "/admin/user/" + clientUsername;
      } else {
        alert(getErrorString(responseData.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
    }
  };

  validate = () => {
    if (this.state.data.deviceID === "") {
      return true;
    }
    return false;
  };

  handleSelectChange = ({ currentTarget }) => {
    const deviceID = currentTarget.value;
    const data = { ...this.state.data };
    data.deviceID = deviceID;
    this.setState({ data });
  };

  render() {
    const { clientUsername, devices } = this.state;
    if (authData.isAdmin) {
      return (
        <React.Fragment>
          <section className='mb-5'>
            <div className='section-header'>
              <h1 className='section-title'>
                {"تخصیص دستگاه به  " + clientUsername}
              </h1>
            </div>
          </section>
          <section>
            <form
              onSubmit={this.handleSubmit}
              className='d-flex flex-column w-25 px-4'
            >
              <select
                name='deviceID'
                id='deviceID'
                className='form-control'
                onChange={this.handleSelectChange}
              >
                <option value=''>انتخاب کنید</option>
                {devices.map((item) => (
                  <option key={item.key} value={item.deviceID}>
                    {item.deviceName + " - " + item.deviceID}
                  </option>
                ))}
              </select>
              <button
                disabled={this.validate()}
                type='submit'
                onClick={this.handleSubmitButton}
                className='btn btn-primary mt-5'
              >
                تخصیص
              </button>
            </form>
          </section>
        </React.Fragment>
      );
    }
    return null;
  }
}

export default DeviceAssignment;
