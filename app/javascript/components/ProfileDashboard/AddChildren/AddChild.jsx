import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Functions from '../../../utils/Functions'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

class AddChild extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      studentEmail: '', 
      parent: this.props.parent,
      children: []
    } 
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount(){
    axios.get('/free_children')
    .then( res => {
      this.setState({
        children: res.data.children
      })
    })
  }

  handleChange = event => {
    this.setState({
      studentEmail: event.target.value
    })
  }

  handleClose = (event) => {
    this.setState({
      open: false
    })
  }


  handleClick = (event) => {
    //enrollment/children/new/
    axios.post('/enrollment/children/new', {
      email: this.state.studentEmail,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then( res => {
      this.setState({
        open: true,
        message: res.data.message
      })
      this.props.handleUpdateStudent()
      console.log(res.data)
    })
  }


  render() {
    return (
      <div style={{marginTop: 15}}>
        <TextField
          select
          label="Select"
          value={this.state.studentEmail}
          onChange={this.handleChange}
          helperText="Please select your child"
          margin="normal"
          required
          variant="outlined"
        >
          {this.state.children.map(child => (
            <MenuItem key={child.id} value={child.email}>
              {child.email}
            </MenuItem>
          ))}
        </TextField>
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
        <Button onClick={this.handleClick} style= {{marginLeft: 20, marginRight: 20}} variant="contained" color="primary">
          Add
        </Button>
      </div>
    );
  }
}

export default AddChild
