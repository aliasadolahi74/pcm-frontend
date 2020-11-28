import { Component } from "react";
const dir = process.env.REACT_APP_CUSTOM_DIR;

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");
    this.props.history.push(`${dir}/login`);
  }

  render() {
    return null;
  }
}

export default Logout;
