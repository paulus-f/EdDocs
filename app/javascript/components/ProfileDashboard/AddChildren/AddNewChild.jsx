import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Functions from '../../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import Snackbar from '@material-ui/core/Snackbar';

var foundationTypes = ['school', 'college', 'university', 'kindergarten'] // then remove, when will models

class AddChild extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      studentEmail: '',
      firstName: '',
      lastName: '', 
      parent: this.props.parent,
      open: false,
      message: ''
    }
    this.handleClick = this.handleClick.bind(this) 
    this.handleChange = this.handleChange.bind(this) 
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }
  
  handleClose = (event) => {
    this.setState({
      open: false
    })
  }


  handleClick = (event) => {
    event.preventDefault()
    axios.post('/enrollment/children/new', {
      email: this.state.studentEmail,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      foundation: this.state.foundationName,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then( res => {
      this.setState({
        open: true,
        message: res.data.message
      })
      this.setState({lastName: '', firstName: '', studentEmail: ''})
      this.props.handleUpdateStudent()
      console.log(this.props)
      console.log(res.data)
    })
  }

  
  render() {
    const {studentEmail, firstName, lastName} = this.state
    return (
      <div style={{marginTop: 15}}>
      <form onSubmit={this.handleClick}>
        <FormControl component="fieldset" >
          <TextField
              label="Student Email"
              value={studentEmail}
              onChange={this.handleChange('studentEmail')}
              margin="normal"
              type="email"
              name="email"
              required
              autoComplete="email"
              variant="outlined"
          />
          <TextField
              label="Student first name"
              value={firstName}
              onChange={this.handleChange('firstName')}
              margin="normal"
              name="firstName"
              required
              variant="outlined"
          />
          <TextField
              label="Student last name"
              value={lastName}
              onChange={this.handleChange('lastName')}
              margin="normal"
              name="lastName"
              required
              variant="outlined"
          />
        <Button type='submit' style= {{marginLeft: 20, marginRight: 20}} variant="contained" color="primary">
          Add
        </Button>
        </FormControl>
      </form>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={this.handleClose}
          open={this.state.open}
          autoHideDuration={3000}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  }
}

export default AddChild
