import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DialogMessage extends React.Component {

  handleChange = event => {
    this.props.getMessage(event.target.value)    
  }

  render() {
    const {
      typeClickMsg
    } = this.props
    var memo;
    if(typeClickMsg == 'delete') {
      memo = "Write the reason the reason for the failure to confirm or delete"
    }else if(typeClickMsg == 'approve') {
      memo = "Write a letter with the wishes"
    } 

    return (
      <Dialog
        open={this.props.open}
        onClose={ (event) => this.props.handleClose(event,'none') }
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {memo}
          </DialogContentText>
          <TextField
            label="Message"
            multiline
            margin="normal"
            variant="outlined"
            onChange={this.handleChange}
            autoFocus
            fullWidth
            value ={this.props.message}
            margin="normal"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ (event) => this.props.handleClose(event,'none') } color="primary">
            Cancel
          </Button>
          <Button onClick={ (event) => this.props.handleClose(event,typeClickMsg) }  color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DialogMessage;