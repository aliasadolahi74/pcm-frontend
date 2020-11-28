import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class UserDevicesTable extends Component {
  state = {
    columns: [
      { name: "deviceID", label: "شناسه دستگاه" },
      { name: "deviceName", label: "نام دستگاه" },
      {
        name: "deleteButton",
        content: (item) => (
          <button
            onClick={() => {
              this.handleDeleteAssignmentClick(item);
            }}
            className="btn btn-outline-danger"
          >
            <i className="fa fa-trash"></i>
          </button>
        ),
      },
      {
        name: "detailsButton",
        content: (item) => (
          <Link to={`${dir}/admin/device/${item.deviceID}/${item.phoneNumber}`}>
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

  handleDeleteAssignmentClick = (item) => {
    this.props.onDelete(item);
  };

  handleEditDeviceNameClick = (item) => {};
}

export default UserDevicesTable;
