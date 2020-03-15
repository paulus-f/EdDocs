import React from 'react';
import Button from '@material-ui/core/Button';
import Functions from '../../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton';
import IconCached from '@material-ui/icons/Cached';
import IconDelete from '@material-ui/icons/Delete';
import DialogContent from '@material-ui/core/DialogContent';
import axios from 'axios';
import Group from './Group'
import { Dialog } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';


class Certificate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: '',
      open: false,
      message: '',
      certificateId: null
    }
    this.handleCertificateUpdate  = this.handleCertificateUpdate
  }

  componentDidMount() {
    axios.get('levels/'+ this.props.levelId + '/certificate/')
    .then( res => {
      this.setState({
        header: res.data.header,
        message: res.data.message, 
        certificateId: res.data.id,
        alertMessage: ''
      })
    })
  }
 
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleClose = (event) => {
    this.setState({
      open: false
    })
  };

  handleCertificateUpdate = (e) => {
    axios.put('certificates/'+ this.state.certificateId, {
      certificate: {
        header: this.state.header,
        message: this.state.message,
      },  
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then( res => {
      this.setState({
        open: true,
        alertMessage: res.data.msg, 
      })
      console.log(res.data.msg)
    })
  }

  render() {
        return(
        <Dialog
          open={this.props.certificateAction}
          onClose={this.props.certificateEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div className='form-row'>
            <form autoComplete="off">
              <FormControl> 
                <TextField
                  autoFocus
                  value={this.state.header}
                  name="header"
                  margin="dense"
                  variant="outlined"
                  onChange={this.handleChange}/>
                <TextField
                  autoFocus
                  value={this.state.message}
                  name="message"
                  multiline
                  margin="dense"
                  variant="outlined"
                  onChange={this.handleChange}/>
                <Button color="primary" aria-label="Save" onClick={this.handleCertificateUpdate}>
                  Save
                </Button>
                <Button color="primary">
                  <a href={'/certificates/' + this.state.certificateId + '.pdf' }> Show PDF </a>
                </Button>
                <Button color="primary" aria-label="Cancel" onClick={this.props.certificateEdit}>
                  Cancel
                </Button>
              </FormControl>
            </form>
            </div>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={this.state.open}
              autoHideDuration={2000}
              onClose={this.handleClose}
              message={this.state.alertMessage}
            />
          </DialogContent>
        </Dialog>
      )
  }
}

export default Certificate