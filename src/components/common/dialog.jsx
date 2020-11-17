import React, { Component } from "react";

class Dialog extends Component {
  componentDidUpdate() {
    const { id, isVisible, onDialogEnds } = this.props;
    const dialog = document.getElementById(id);
    if (isVisible) {
      dialog.style.display = "flex";
      setTimeout(function () {
        dialog.style.opacity = "1";
      }, 10);
      setTimeout(function () {
        dialog.style.opacity = "0";
        dialog.style.display = "none";
        onDialogEnds();
      }, 2700);
    }
  }

  render() {
    const { message, success, id: htmlID } = this.props;
    return (
      <div className="vida-dialog" id={htmlID}>
        <div className="d-flex flex-column align-items-center p-3 pt-5">
          {this.getStatusIcon(success)}
          <span className="mt-5 font-weight-bold">{message}</span>
        </div>
      </div>
    );
  }

  getStatusIcon = (success) => {
    if (!success) {
      return (
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          fill="none"
          width="100px"
          height="100px"
          viewBox="0 0 100 100"
        >
          <g id="XMLID_5_">
            <circle stroke="#ED1C24" strokeWidth="8" cx="50" cy="50" r="45.5" />
            <g>
              <line
                className="cross-rtl"
                x1="68.9"
                y1="31.1"
                x2="31.1"
                y2="68.9"
              />
              <line
                className="cross-ltr"
                x1="31.1"
                y1="31.1"
                x2="68.9"
                y2="68.9"
              />
            </g>
          </g>
        </svg>
      );
    } else {
      return (
        <svg
          version="1.0"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100px"
          height="100px"
          fill="none"
          viewBox="0 0 100 100"
        >
          <g id="XMLID_3_">
            <path
              stroke="#06C58A"
              className="vida-tick-svg"
              d="M72.4,35.5L44,63.9c-0.7,0.7-1.9,0.7-2.6,0L27.6,50.2"
            />
            <circle stroke="#06C58A" strokeWidth="8" cx="50" cy="50" r="45.5" />
          </g>
        </svg>
      );
    }
  };
}

export default Dialog;
