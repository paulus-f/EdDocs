import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { Button } from "@material-ui/core";
import Functions from '../../utils/Functions'


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


class InviteForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.Valid = this.Valid.bind(this);
  }
  state = {
    email: '',
    first_name: '',
    last_name: ''
  };

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value})
  };

  Valid(invite) {
    return (invite.first_name && invite.last_name &&  invite.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
  }

  handleSubmit(event) {
    event.preventDefault();
    const invite = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email
    }
     if (this.Valid(invite)) {
      axios.post(`http://localhost:3000/invite`, { 
        invite,
        foundation_id: this.props.foundation_id,
        authenticity_token: Functions.getMetaContent("csrf-token")
       }).then(res => {
        this.props.AddInvite(res.data);
       })
      this.props.Close()
      this.setState({
        email: '',
        first_name: '',
        last_name: ''
      })
      }
      
  }

render() {
  const { classes } = this.props;
  return (
  <Dialog
    open={this.props.OpenState}
    onClose={this.props.Close}
    aria-label="form-dialog-title"
    className='Invite-form'>
    <DialogTitle id="form-dialog-title">Invite student</DialogTitle>
    <DialogContent className='form-row' style={{marginLeft:0, marginRight:0}}>
      <div className='col-md-4'>
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
          value={this.state.email}
          onChange={this.handleChange}
        />
      </div>
      <div className='col-md-4'>
        <TextField
          id="outlined-first-input"
          label="First name"
          required
          name="first_name"
          className={classes.textField}
          type="first_name"
          margin="normal"
          variant="outlined"
          value={this.state.first_name}
          onChange={this.handleChange}
        />
      </div>
       <div className='col-md-4'>
        <TextField
          id="outlined-last-input"
          label="Last name"
          name="last_name"
          required
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={this.state.last_name}
          onChange={this.handleChange}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={this.props.Close} color="primary" size='large'>
        Cancel
      </Button>
      <Button onClick={this.handleSubmit} color="primary" size='large'>
        Invite
      </Button>
    </DialogActions>
  </Dialog>
    );
  }
}

export default withStyles(styles)(InviteForm);