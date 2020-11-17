import React, { Component } from "react";
import jwtDecode from "jwt-decode";

class Dashboard extends Component {
  state = {
    user: {},
  };

  componentDidMount() {
    try {
      const user = jwtDecode(localStorage.getItem("token"));
      this.setState({ user });
    } catch (ex) {}
  }

  render() {
    return (
      <h1 className="section-title">
        {this.state.user.nickname + " خوش آمدید"}
      </h1>
    );
  }
}

export default Dashboard;
