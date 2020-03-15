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
import { Button } from "@material-ui/core";
import Functions from '../../utils/Functions'
import RadioButtons from './../RadioButtonsGroup'  
import Phone from 'react-phone-number-input'


const styles = theme => ({
  parent_form: {
  },
  fieldset: {
    width: '100%',
  },
});

class EmergencyForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      model: 'EmergencyConn',
        params : {
            first_name: this.props.data.first_name,
            second_name: this.props.data.second_name,
            third_name: this.props.data.third_name,
            phone_number: this.props.data.phone_number,
        },
    }
    this.setPhone = this.setPhone.bind(this)

  }

  handleChange = event => {
      var field_name = event.target.name;
      var field_value = event.target.value; 
      this.setState(prevState => ({
        params : {...prevState.params, [field_name]: field_value },
      }))
      this.props.updateState(this.state);
  };    

  setPhone = (e) => {
    console.log(this.state.params);
    this.setState(prevState => ({
      params : {...prevState.params, phone_number: event.target.value },
    }))
    this.props.updateState(this.state);
  }
	render() {
      const { classes } = this.props;
        
      return(
        <div id="parent-form" className={classes.parent_form}>
		      <form className="form-group" autoComplete="off" id="" onSubmit={this.handleSubmit}>
            <FormControl component="fieldset" className={classes.formControl +' '+ classes.fieldset}>
                <TextField
                    label="First Name"
                    margin="normal"
                    name="first_name"
                    required
                    onChange={this.handleChange}
                    value={this.state.params.first_name}
                />
                <TextField
                    label="Last Name"
                    margin="normal"
                    name="second_name"
                    required
                    onChange={this.handleChange}
                    value={this.state.params.second_name}
                />
                <TextField
                    label="Third Name(optional)"
                    margin="normal"
                    name="third_name"
                    onChange={this.handleChange}
                    value={this.state.params.third_name}
                />
                <Phone
                    margin="normal"
                    name="phone_number"
                    required
                    placeholder="Enter phone number"
                    onChange={this.setPhone}
                    value={this.state.params.phone_number}
                />
            </FormControl>
          </form>
        </div>
      )
	}
}

export default withStyles(styles)(EmergencyForm);