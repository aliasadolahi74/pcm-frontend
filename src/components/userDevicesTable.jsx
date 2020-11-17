import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";

class UserDevicesTable extends Component {
  state = {
    columns: [
      { name: "deviceID", label: "شناسه دستگاه" },
      { name: "deviceName", label: "نام دستگاه" },
      {
        name: "editName",
        content: (item) => (
          <i
            className="fa fa-edit icon-btn"
            onClick={() => {
              this.handleEditDeviceNameClick(item);
            }}
          ></i>
        ),
      },
      {
        name: "deleteButton",
        content: (item) => (
          <button className="btn btn-outline-danger">
            <i className="fa fa-trash"></i>
          </button>
        ),
      },
      {
        name: "detailsButton",
        content: (item) => (
          <Link to={"/admin/device/" + item.deviceID}>
            جزئیات
            <i className="fa fa-info-circle mr-1"></i>
          </Link>
        ),
      },
    ],
  };

  render() {
    const { columns } = this.state;
    const { devices } = this.props;
    return <Table isCountable={true} columns={columns} data={devices} />;
  }

  handleEditDeviceNameClick = (item) => {
    console.log(item);
  };
}

export default UserDevicesTable;
