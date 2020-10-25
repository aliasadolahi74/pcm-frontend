import React, { Component } from "react";

class Device extends Component {
  state = {};
  render() {
    const deviceID = this.props.match.params.deviceID;
    return <h1>{deviceID}</h1>;
  }
}

export default Device;
