import React, { Component } from "react";
import Modal from "./common/modal";
import UserTable from "./userTable";
import Pagination from "./common/pagination";
import userList from "../server-files/users.json";
import { paginate } from "./utils/paginate";

class Users extends Component {
  state = {
    addUserModalVisible: false,
    currentPage: 1,
    pageSize: 2,
    allUsers: userList.users,
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { allUsers, currentPage, pageSize } = this.state;
    const users = paginate(allUsers, currentPage, pageSize);
    return (
      <React.Fragment>
        <section className="mb-2">
          <div className="section-header">
            <h1 className="section-title">کاربران</h1>
            <div className="button-container">
              <button
                type="button"
                className="btn btn-success handle-modal"
                modal-id="addUserModal"
              >
                <i className="fa fa-user-plus"></i>
              </button>
            </div>
          </div>
          <Modal id="addUserModal">اضافه کردن کاربر</Modal>
        </section>
        <UserTable users={users} />
        <Pagination
          itemsCount={allUsers.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

export default Users;
