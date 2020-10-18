import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

class UserTable extends Component {
  state = {
    users: [
      {
        key: "1",
        username: "aliasadolahi",
        name: "علی اسدالهی",
        registerDate: "1399/07/03",
        status: 1,
      },
      {
        key: "2",
        username: "abfa",
        name: "آب و فاضلاب لرستان",
        registerDate: "1399/07/04",
        status: 1,
      },
    ],

    columns: [
      { name: "name", label: "نام" },
      { name: "username", label: "نام کاربری" },
      { name: "registerDate", label: "تاریخ ثبت‌نام" },
      { name: "status", label: "وضعیت" },
      { name: "detailsButton", label: "" },
    ],
  };
  render() {
    const { users, columns } = this.state;
    return <Table isCountable={true} columns={columns} data={users} />;
  }
}

export default UserTable;
