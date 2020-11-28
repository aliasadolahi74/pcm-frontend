import React, { Component } from "react";
import LoginForm from "./loginForm";
import icon from "../images/logo.png";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class Login extends Component {
  render() {
    console.log(process.env);
    const token = localStorage.getItem("token");
    if (token !== null) {
      window.location = `${dir}/admin/dashboard`;
      return null;
    } else {
      return (
        <div className="background">
          <div className="login-page-container">
            <div className="container-fluid p-5 h-100 w-100 main-section">
              <div className="d-flex justify-content-center align-items-center flex-column login-form-container">
                <img src={icon} className="tmb-logo" alt="logo" />
                <LoginForm />
              </div>
              <div className="d-flex w-100"></div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Login;
