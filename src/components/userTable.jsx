import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

class UserTable extends Component {
  state = {
    columns: [
      { name: "nickname", label: "نام" },
      { name: "username", label: "نام کاربری" },
      { name: "datetime", label: "تاریخ ثبت‌نام" },
      { name: "status", label: "وضعیت" },
      {
        name: "detailsButton",
        content: (item) => (
          <Link to={"/admin/user/" + item["username"]}>
            جزئیات
            <i className="fa fa-info-circle mr-1"></i>
          </Link>
        ),
      },
    ],
  };
  render() {
    const { columns } = this.state;
    const { users } = this.props;
    return <Table isCountable={true} columns={columns} data={users} />;
  }
}

export default UserTable;
