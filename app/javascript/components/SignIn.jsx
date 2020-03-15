import React from "react"
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Snackbar from '@material-ui/core/Snackbar';
import FormGroup from '@material-ui/core/FormGroup'
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab'
import PropTypes from "prop-types"
import axios from 'axios';
import { Button } from "@material-ui/core";
import Functions from '../utils/Functions'
import Links from './Links'

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

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      alert: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
 
  componentDidUpdate()
  {
  }

  handleChange = event => {
    switch(event.target.type)
    {
      case 'email': 
        this.setState({ email: event.target.value});
        break;
      case 'password': 
        this.setState({ password: event.target.value});
        break;
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log( this.state.email )
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    axios.post(`http://localhost:3000/users/sign_in`, { 
      user,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
      .then(res => {
        this.setState({
          alert: res.data.message,
        })
        if(this.state.alert == null)
        {
          window.location.reload()
        } else {
          this.setState({
            open: true
          })
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
              <Links/>
              <Button type="submit" color="primary" aria-label="Add">
                <AddIcon />
              </Button>
            </FormControl>
        </form>
      </div>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);