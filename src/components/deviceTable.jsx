import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";

class DeviceTable extends Component {
  state = {
    devices: [
      {
        key: "1",
        deviceID: "Device1",
        customerName: "علی اسدالهی",
        status: 1,
      },
      {
        key: "2",
        deviceID: "Device2",
        customerName: "آبفا",
        registerDate: "1399/07/03",
        status: 1,
      },
    ],

    columns: [
      { name: "deviceID", label: "شناسه دستگاه" },
      { name: "customerName", label: "نام مشتری" },
      { name: "status", label: "وضعیت" },
      {
        name: "detailsButton",
        content: (item) => (
          <Link to={"/admin/devices/" + item.deviceID}>
            <i className="fa fa-info-circle"></i>
          </Link>
        ),
      },
    ],
  };

  render() {
    const { devices, columns } = this.state;
    return <Table isCountable={true} columns={columns} data={devices} />;
  }
}

export default DeviceTable;
