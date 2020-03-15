import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { Button } from "@material-ui/core";
import Functions from '../utils/Functions';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});


class Support extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.Valid = this.Valid.bind(this);
  }
  state = {
    email: '',
    problem: '',
    description: '',
    modal: false,
    succes: false
  };

  OpenCloseModal() {
    this.setState({ email: '',
                    problem: '',
                    description: '',
                    modal: !this.state.modal})
  }

  SuccesClose() {
    this.setState({succes: false})
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value})
  };

  Valid(message) {
    return (message.problem && message.description &&  message.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
  }

  handleSubmit(event) {
    event.preventDefault();
    const message = {
      email: this.state.email,
      problem: this.state.problem,
      description: this.state.description
    };
    if (this.Valid(message)) {
      axios.post(`http://localhost:3000/support`, { 
        message,
        authenticity_token: Functions.getMetaContent("csrf-token")
      })
      this.setState({
        modal: false,
        succes: true
      })
    }
  }

  SuccesModal(){
    return (
      <Dialog
        open={this.state.succes}
        onClose={this.SuccesClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">{"Succes!"}</DialogTitle>
      <DialogContent>
      <DialogContentText id="alert-dialog-description" className='alert alert-success'>
        Your mail has been sent successfully! Wait answer on {this.state.email}
      </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={this.SuccesClose.bind(this)} color="primary">
        Ok
      </Button>
      </DialogActions>
    </Dialog>)
  }

  render() {
    const { classes } = this.props;
    return (
      <div className='Support'>
        <a className="badge support" onClick={this.OpenCloseModal.bind(this)}>
          Support</a>
        <Dialog
          open={this.state.modal}
          onClose={this.OpenCloseModal.bind(this)}
          aria-labelledby="form-dialog-title"
          aria-label="form-dialog-title">
        <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
            <FormControl className={classes.formControl}> 
          <DialogTitle id="form-dialog-title">Text to us about the difficulties!</DialogTitle>
          <DialogContent>
            <DialogContentText className='alert alert-info'>
              Please, fill in all fields.
            </DialogContentText>
              <TextField
                autoFocus
                id="outlined-email-input"
                label="Email"
                className={classes.textField}
                type="email"
                name="email"
                required
                autoComplete="email"
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={this.handleChange}
              />
              <TextField
                id="outlined-problem-input"
                label="Problem"
                required
                name="problem"
                className={classes.textField}
                type="problem"
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={this.handleChange}
              />
              <TextField
                id="outlined-textarea"
                label="Problem description"
                placeholder="Describe your problem"
                name="description"
                required
                multiline
                rows='2'
                className={classes.textField}
                margin="normal"
                fullWidth
                variant="outlined"
                onChange={this.handleChange}
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.OpenCloseModal.bind(this)} color="primary" size='large'>
              Cancel
            </Button>
            <Button type='submit' color="primary" size='large'>
              Send
            </Button>
          </DialogActions>
          </FormControl>
          </form>
        </Dialog>
        {this.SuccesModal()}
      </div>
    );
  }
}

export default withStyles(styles)(Support);
