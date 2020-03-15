import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormParent from './FormParent';
import FormAdmin from './FormAdmin';

class FormControlLabelPosition extends React.Component {
  constructor(props) {
    super(props);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateStudentEmail = this.updateStudentEmail.bind(this);
    this.updateFoundationType = this.updateFoundationType.bind(this);
    this.updateFoundationName = this.updateFoundationName.bind(this);
    this.updateFoundationLvl = this.updateFoundationLvl.bind(this);
  }

  state = {
    value: 'parent',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
    this.props.updateRole(event.target.value)
  };

  updateFirstName = (value) => {
    this.props.updateFirstName(value)
  }

  updateLastName = (value) => {
    this.props.updateLastName(value)
  }

  updateFoundationLvl = (value) => {
    this.props.updateFoundationLvl(value)
  }

  updateFoundationName = (value) => {
    this.props.updateFoundationName(value)
  }

  updateFoundationType = (value) => {
    this.props.updateFoundationType(value)
  }

  updateStudentEmail = (value) => {
    this.props.updateStudentEmail(value)
  }

  render() {
    const { value } = this.state
    var userForm;
    switch(value)
    {
      case 'manager': 
        userForm = <FormAdmin
          updateFirstName = {this.updateFirstName}
          updateLastName = {this.updateLastName}
          updateFoundationLvl = {this.updateFoundationLvl}
          updateFoundationName = {this.updateFoundationName}
          updateFoundationType = {this.updateFoundationType}
        /> 
        break;
      case 'parent': 
        userForm = <FormParent
          updateFirstName = {this.updateFirstName}  
          updateLastName = {this.updateLastName}
          updateStudentEmail = {this.updateStudentEmail}
          updateFoundationLvl = {this.updateFoundationLvl}
          updateFoundationName = {this.updateFoundationName}
          updateFoundationType = {this.updateFoundationType}
        /> 
        break;
    }
    return (
      <div>
        <FormControl component="fieldset" className="Radio">
          <FormLabel component="legend">Choose your role:</FormLabel>
          <RadioGroup
            aria-label="position"
            name="position"
            value={this.state.value}
            onChange={this.handleChange}
            row
          >
            <FormControlLabel
              value="parent"
              control={<Radio color="primary" />}
              label="Parent"
              labelPlacement="end"
            />
            <FormControlLabel
              value="manager"
              control={<Radio color="primary" />}
              label="Manager"
              labelPlacement="end"
            />
          </RadioGroup>
        </FormControl>
        {userForm}
      </div>
    );
  }
}

export default FormControlLabelPosition;