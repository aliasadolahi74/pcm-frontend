import React, { Component } from "react";

class Dialog extends Component {
  componentDidMount() {
    const { id, buttonID } = this.props;
    const dialog = document.getElementById(id);
    const btn = document.getElementById(buttonID);
    btn.addEventListener("click", function () {
      dialog.style.display = "flex";
      setTimeout(function () {
        dialog.style.opacity = "1";
      }, 10);
      setTimeout(function () {
        dialog.style.opacity = "0";
        dialog.style.display = "none";
      }, 2000);
    });
  }

  render() {
    const { message, success, id: htmlID } = this.props;
    return (
      <div className="vida-dialog" id={htmlID}>
        <div>{message}</div>
      </div>
    );
  }
}

export default Dialog;
