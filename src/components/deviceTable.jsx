import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";

class DeviceTable extends Component {
  state = {
    columns: [
      { name: "deviceID", label: "شناسه دستگاه" },
      { name: "customerName", label: "نام مشتری" },
      { name: "status", label: "وضعیت" },
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
}

export default DeviceTable;
