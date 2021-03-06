import React, { Component } from "react";
import UserTable from "./userTable";
import Pagination from "./common/pagination";
import { paginate } from "./utils/paginate";
import { Link } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import "../services/httpServices";
import { authData } from "../services/authServices";
import config from "../config.json";
import { getErrorString } from "./utils/error-converter";
import AlertDialog from "./alertDialog";

class Users extends Component {
  state = {
    currentPage: 1,
    pageSize: 10,
    allUsers: [],
    isAlertDialogOpen: false,
    selectedDeleteButton: {},
    authData: { username: authData.username, token: authData.token },
  };

  async componentDidMount() {
    try {
      const loginOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(authData),
        url: `${config.apiBaseURL}/users.php`,
      };
      const usersInfo = await axios(loginOptions);
      const errors = usersInfo.data.errors;

      if (errors) {
        alert(errors[0].message);
      } else {
        const allUsers = usersInfo.data.body || [];
        console.log(allUsers);
        this.setState({ allUsers });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }

      if (ex.response && ex.response.status === 403) {
        alert("شما دسترسی لازم به این بهش را ندارید");
      }
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const {
      allUsers,
      currentPage,
      pageSize,
      isAlertDialogOpen,
      selectedDeleteButton,
    } = this.state;
    const users = paginate(allUsers, currentPage, pageSize);
    return (
      <React.Fragment>
        <section className="mb-2">
          <div className="section-header">
            <h1 className="section-title">کاربران</h1>
            <div className="button-container">
              <Link className="btn btn-success" to="./new-user">
                <i className="fa fa-user-plus"></i>
              </Link>
            </div>
          </div>
        </section>
        <UserTable
          users={users}
          onDeleteDeviceButtonClick={this.onUserDelete}
        />
        <Pagination
          itemsCount={allUsers.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
        <AlertDialog
          open={isAlertDialogOpen}
          onClose={this.handleAlertDialogClose}
          title="حذف کاربر"
          message="آیا میخواهید این کاربر را حذف کنید؟"
          onYesClick={() => this.handleYesClick(selectedDeleteButton)}
        />
      </React.Fragment>
    );
  }

  onUserDelete = async (item) => {
    this.setState({ isAlertDialogOpen: true, selectedDeleteButton: item });
  };

  handleAlertDialogClose = () => {
    this.setState({ isAlertDialogOpen: false });
  };

  handleYesClick = async (item) => {
    try {
      const userDeleteOptions = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify({
          ...this.state.authData,
          clientUsername: item.username,
        }),
        url: `${config.apiBaseURL}/delete-user.php`,
      };
      const { data } = await axios(userDeleteOptions);
      if (data.status) {
        const allUsersCloned = [...this.state.allUsers];
        const allUsers = allUsersCloned.filter(
          (user) => user.username !== item.username
        );
        this.setState({ allUsers });
      } else {
        alert(getErrorString(data.errors));
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        alert("Bad Request");
      }
    }
    this.setState({ isAlertDialogOpen: false });
  };
}

export default Users;
