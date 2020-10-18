import React, { Component } from "react";

class User extends Component {
  state = {};
  render() {
    return <h1>{this.props.match.params.username}</h1>;
  }
}

export default User;
