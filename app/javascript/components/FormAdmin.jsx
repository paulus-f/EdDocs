import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'
import axios from 'axios';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '160%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

var foundationTypes = ['school', 'college', 'university', 'kindergarten'] // then remove, when will models

class FormAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      foundationType: '',
      foundationName: '',
      role: 'admin',
      schools: [{name: 'Create New Foundation', id: -1}],
      universities: [{name: 'Create New Foundation', id: -1}],
      colleges: [{name: 'Create New Foundation', id: -1}],
      kindergartens: [{name: 'Create New Foundation', id: -1}],
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount(){
    axios.get('/list_foundations')
      .then( res => {
          this.setState({
          schools: this.state.schools.concat(res.data.schools),
          universities: this.state.universities.concat(res.data.universities),
          colleges: this.state.colleges.concat(res.data.colleges),
          kindergartens: this.state.kindergartens.concat(res.data.kindergartens),
        })
      })
  }
  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value })
    switch(name)
    {
      case 'firstName':
        this.props.updateFirstName(value)
        break;
      case 'lastName':
        this.props.updateLastName(value)
        break;
      case 'foundationName':
        this.props.updateFoundationName(value)
        break;
      case 'foundationType':
        this.props.updateFoundationType(value)
        break;
    }
  };

  render() {
    const { classes } = this.props
    const { schools, universities, colleges, kindergartens } = this.state
    var fndts = [], fndtsLvl = [];
    switch(this.state.foundationType)
    {
      case 'school':
        fndts = schools;
        break;
      case 'college': 
        fndts = colleges;
        break;
      case 'university': 
        fndts = universities;
        break;
      case 'kindergarten':
        fndts = kindergartens;
        break; 
    }
    return (
      <div>
        <FormControl component="fieldset" className={classes.formControl}>
          <TextField
            label="First Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange}
            name='firstName'
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            label="Last Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange}
            margin="normal"
            name='lastName'
            required
            variant="outlined"
          />
          <TextField
            select
            label="Select"
            className={classes.textField}
            value={this.state.foundationType}
            onChange={this.handleChange}
            helperText="Please select your type of foundation"
            margin="normal"
            required
            name='foundationType'
            variant="outlined"
          >
            {foundationTypes.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select"
            className={classes.textField}
            value={this.state.foundationName}
            onChange={this.handleChange}
            helperText="Please select your name of foundation"
            margin="normal"
            name='foundationName'
            required
            variant="outlined"
          >
            {fndts.map(option => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </div>
    )
  }
}

export default withStyles(styles)(FormAdmin);