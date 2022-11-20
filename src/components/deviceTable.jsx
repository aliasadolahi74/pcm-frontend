import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authData } from "./../services/authServices";
import PaginatedTable from "./common/Pagination/PaginatedTable";

const dir = process.env.REACT_APP_CUSTOM_DIR;

class DeviceTable extends Component {
  state = {
    columns: [
      { name: "deviceID", label: "شناسه دستگاه" },
      { name: "deviceName", label: "نام دستگاه" },
      {
        name: "phoneNumber",
        label: "شماره سیمکارت",
        content: (item) => (
          <div style={{ direction: "ltr" }}>{item.phoneNumber}</div>
        ),
      },
      { name: "nickname", label: "نام مشتری" },
      { name: "description", label: "توضیحات" },
      { name: "type", label: "نوع دستگاه" },
      { name: "address", label: "محل نصب" },
      { name: "installationDatetime", label: "زمان نصب" },
      {
        name: "deleteBtn",
        content: (item) => (
          <button
            className='btn btn-outline-danger'
            onClick={() => {
              this.handleDelete(item);
            }}
          >
            <i className='fa fa-trash mr-1'></i>
          </button>
        ),
      },
      {
        name: "editButton",
        content: (item) => {
          if (authData.isAdmin) {
            return (
              <Link to={`${dir}/admin/edit-device/${item.deviceID}`}>
                <i className='fa fa-edit mr-1'></i>
              </Link>
            );
          } else {
            return null;
          }
        },
      },
      {
        name: "detailsButton",
        content: (item) => (
          <Link to={`${dir}/admin/device/${item.deviceID}/${item.phoneNumber}`}>
            جزئیات
            <i className='fa fa-info-circle mr-1'></i>
          </Link>
        ),
      },
    ],
  };

  componentDidMount() {
    if (!authData.isAdmin) {
      const columns = this.state.columns.filter(
        (item) => item.name !== "nickname" && item.name !== "deleteBtn"
      );
      this.setState({ columns });
    }
  }

  handleDelete = (item) => {
    this.props.onDeleteDeviceButtonClick(item);
  };

  render() {
    const { columns } = this.state;
    const { devices } = this.props;
    return <PaginatedTable columns={columns} data={devices} />;
  }
}

export default DeviceTable;
