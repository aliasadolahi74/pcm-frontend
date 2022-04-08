import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";
import { authData } from "./../services/authServices";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class UserTable extends Component {
  state = {
    columns: [
      { name: "nickname", label: "نام" },
      { name: "username", label: "نام کاربری" },
      { name: "phoneNumber", label: "شماره تماس" },
      { name: "datetime", label: "تاریخ ثبت‌نام" },
      {
        name: "deleteBtn",
        content: (item) => (
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              this.handleDelete(item);
            }}
          >
            <i className="fa fa-trash mr-1"></i>
          </button>
        ),
      },
      {
        name: "detailsButton",
        content: (item) => (
          <Link to={`${dir}/admin/user/${item.username}`}>
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
        (item) => item.name !== "deleteBtn"
      );
      this.setState({ columns });
    }
  }

  handleDelete = (item) => {
    this.props.onDeleteDeviceButtonClick(item);
  };

  render() {
    const { columns } = this.state;
    const { users } = this.props;
    return <Table isCountable={true} columns={columns} data={users} />;
  }
}

export default UserTable;
