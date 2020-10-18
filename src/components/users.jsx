import React, { Component } from "react";
import Modal from "./common/modal";
import UserTable from "./userTable";

class Users extends Component {
  state = {
    addUserModalVisible: false,
  };

  render() {
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
        <UserTable />
      </React.Fragment>
    );
  }
}

export default Users;
