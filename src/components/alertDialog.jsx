import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class AlertDialog extends Component {
  render() {
    const { open, onClose, onYesClick, title, message } = this.props;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            خیر
          </Button>
          <Button onClick={onYesClick} color="primary" autoFocus>
            بله
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AlertDialog;
