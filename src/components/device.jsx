import React, { Component } from "react";
import Dialog from "./common/dialog";
import tick from "../icons/tick.svg";

class Device extends Component {
  state = {};
  render() {
    const deviceID = this.props.match.params.deviceID;
    return (
      <div>
        <h1>{deviceID}</h1>
        <button id="dialogBtn">Click Here</button>
        <Dialog id="vida-dialog" buttonID="dialogBtn" success={true} />
        <svg
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100px"
          height="100px"
          viewBox="0 0 468.293 468.293"
          className="tick-container"
        >
          <circle cx="234.146" cy="234.146" r="234.146" />
          <polygon
            className="vida-tick-svg"
            stroke="#ffffff"
            stroke-width="20px"
            points="357.52,110.145 191.995,275.67 110.773,194.451 69.534,235.684 191.995,358.148 
	398.759,151.378 "
          />
        </svg>
      </div>
    );
  }

  handleButtonClick = () => {};
}

export default Device;
