import React, { Component } from "react";
import { authData } from "../services/authServices";
import "../services/httpServices";
import EditPhoneNumberForm from "./editPhoneNumberForm";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditPhoneNumber extends Component {
  state = {
    clientUsername: this.props.match.params.clientUsername,
  };

  componentDidMount() {
    if (!authData.isAdmin) {
      this.props.history.replace(`${dir}/admin/dashboard`);
    }
  }

  render() {
    const { clientUsername } = this.state;
    if (authData.isAdmin) {
      return (
        <React.Fragment>
          <section className="mb-5">
            <div className="section-header">
              <h1 className="section-title">
                {"ویرایش تلفن همراه " + clientUsername}
              </h1>
            </div>
          </section>
          <section>
            <EditPhoneNumberForm clientUsername={clientUsername} />
          </section>
        </React.Fragment>
      );
    }
    return null;
  }
}

export default EditPhoneNumber;
