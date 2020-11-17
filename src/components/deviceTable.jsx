import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
import { authData } from "./../services/authServices";

class DeviceTable extends Component {
  state = {
    columns: [
      { name: "deviceID", label: "شناسه دستگاه" },
      { name: "deviceName", label: "نام دستگاه" },
      { name: "nickname", label: "نام مشتری" },
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

  componentDidMount() {
    if (!authData.isAdmin) {
      const columns = this.state.columns.filter(
        (item) => item.name !== "nickname"
      );
      this.setState({ columns });
    }
  }

  render() {
    const { columns } = this.state;
    const { devices } = this.props;
    return <Table isCountable={true} columns={columns} data={devices} />;
  }
}

export default DeviceTable;
