import React, { Component } from "react";
import { authData } from "../services/authServices";
import "../services/httpServices";
import EditAddressForm from "./editAddressForm";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class EditAddress extends Component {
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
                {"ویرایش آدرس " + clientUsername}
              </h1>
            </div>
          </section>
          <section>
            <EditAddressForm clientUsername={clientUsername} />
          </section>
        </React.Fragment>
      );
    }
    return null;
  }
}

export default EditAddress;
