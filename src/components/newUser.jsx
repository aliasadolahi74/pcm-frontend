import React, { Component } from "react";
import NewUserForm from "./newUserForm";

class NewUser extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="mb-5">
          <div className="section-header">
            <h1 className="section-title">کاربر جدید</h1>
          </div>
        </section>
        <section>
          <NewUserForm />
        </section>
      </React.Fragment>
    );
  }
}

export default NewUser;
