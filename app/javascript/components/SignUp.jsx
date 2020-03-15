import React from "react"
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab'
import PropTypes from "prop-types"
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import { Button } from "@material-ui/core";
import Functions from '../utils/Functions'
import RadioButtons from './RadioButtonsGroup'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '25%',
    marginRight: '10%',
  },
  textField: {
    width: '150%',
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

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateStudentEmail = this.updateStudentEmail.bind(this);
    this.updateFoundationType = this.updateFoundationType.bind(this);
    this.updateFoundationName = this.updateFoundationName.bind(this);
    this.updateFoundationLvl = this.updateFoundationLvl.bind(this);
    this.updateRole = this.updateRole.bind(this);
  }
  state = {
    email: '',
    password: '',
    password_confirmation: '',
    alert: null,
    firstName: '',
    lastName: '',
    studentEmail: '',
    foundationType: '',
    foundationName: '',
    foundationLvl: '',
    role: 'parent'
  };

  handleChange = event => {
    switch(event.target.name)
    {
      case 'email': 
        this.setState({ email: event.target.value});
        break;
      case 'password': 
        this.setState({ password: event.target.value});
        break;
      case 'password_confirmation': 
        this.setState({ password_confirmation: event.target.value});
        break;
    }
  };

  updateFirstName = (value) => {
    this.setState({ firstName: value })
  }

  updateLastName = (value) => {
    this.setState({ lastName: value })
  }

  updateFoundationLvl = (value) => {
    this.setState({ foundationLvl: value })
  }

  updateFoundationName = (value) => {
    this.setState({ foundationName: value })
  }

  updateFoundationType = (value) => {
    this.setState({ foundationType: value })
  }

  updateStudentEmail = (value) => {
    this.setState({ studentEmail: value })
  }

  updateRole = (value) => {
    this.setState({ role: value })
  }

  componentDidUpdate()
  {
    console.log(this.state)
  }

  handleSubmit = event => {
    event.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
      role: this.state.role
    };
    const profile = {
      first_name: this.state.firstName,
      last_name: this.state.lastName
    }
    const foundation = {
      type_foundation: this.state.foundationType,
      name: this.state.foundationName,
      foundationLvl: this.foundationLvl
    }
    const student = {
      student_email: this.state.studentEmail,
      type_foundation: this.foundationType,
      name_foundation: this.state.foundationName,
      foundationLvl: this.foundationLvl
    }

    axios.post(`/users/`, {
        user,
        profile,
        foundation,
        student,
        authenticity_token: Functions.getMetaContent("csrf-token")
    })
      .then(res => {
        this.setState({
          alert: res.data.message,
          open: true
        })
        if(this.state.alert == null)
        {
          window.location.reload()
        }
      })
      .catch( err => {
        console.log(err)
      })
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { alert, open } = this.state;

    return (
      <div>
         <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          open={open}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{alert}</span>}
        />
        <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
            <FormControl component="fieldset" className={classes.formControl}>
              <TextField
                id="outlined-email-input"
                label="Email"
                className={classes.textField}
                type="email"
                name="email"
                required
                autoComplete="email"
                margin="normal"
                variant="outlined"
                onChange={this.handleChange}
              />
              <TextField
                id="outlined-password-input"
                label="Password"
                required
                name="password"
                className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                onChange={this.handleChange}
              />
              <TextField
                id="outlined-password-input-confirm"
                label="Confirm Password"
                required
                name="password_confirmation"
                className={classes.textField}
                type="password"
                autoComplete="current-password"
                margin="normal"
                variant="outlined"
                onChange={this.handleChange}
              />
              <RadioButtons 
                updateFirstName = {this.updateFirstName}
                updateLastName = {this.updateLastName}
                updateStudentEmail = {this.updateStudentEmail}
                updateRole = {this.updateRole}
                updateFoundationLvl = {this.updateFoundationLvl}
                updateFoundationName = {this.updateFoundationName}
                updateFoundationType = {this.updateFoundationType}
              />
              <Button type="submit" color="primary" aria-label="Add">
                <AddIcon />
              </Button>
            </FormControl>
        </form>
      </div>
    );
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp);