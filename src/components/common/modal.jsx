import React, { Component } from "react";

class Modal extends Component {
  state = {};
  render() {
    return (
      <div
        id={this.props.id}
        className="vida-modal-container"
        onClick={this.handleModalBackgroundClick}
      >
        <div onClick={this.handleModalClick}>{this.props.children}</div>
      </div>
    );
  }

  componentDidMount() {
    const listOfModalButtons = document.body.querySelectorAll(".handle-modal");
    for (let i = 0; i < listOfModalButtons.length; i++) {
      const modalBtn = listOfModalButtons.item(i);
      const modalID = modalBtn.getAttribute("modal-id");
      modalBtn.addEventListener("click", function () {
        const modal = document.getElementById(modalID);
        modal.style.display = "flex";
        setTimeout(function () {
          modal.style.opacity = "1";
        }, 10);
      });
    }
    console.log("Modal Buttons: ", listOfModalButtons.item(0));
  }

  handleModalBackgroundClick = () => {
    const modal = document.getElementById(this.props.id);
    modal.style.opacity = "0";
    setTimeout(function () {
      modal.style.display = "none";
    }, 200);
  };

  handleModalClick = (e) => {
    e.stopPropagation();
  };
}

export default Modal;
