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

var foundationTypes = ['university'];
var univLvl= ['1', '2', '3', '4', '5', '6'];
var NEWFOUNDATION = ['Create New Foundation'];

class FormStudent extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      foundationType: '',
      foundationName: '',
      foundationLvl: '',
      role: 'student',
      levels: [],
      schools: [],
      universities: [],
      colleges: [],
      kindergartens: [],
      foundationId: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.getLevels = this.getLevels.bind(this)
  }

  componentDidMount(){
    axios.get('/list_foundations', {})
      .then( res => {
          this.setState({
            schools: this.state.schools.concat(res.data.schools),
            universities: this.state.universities.concat(res.data.universities),
            colleges: this.state.colleges.concat(res.data.colleges),
            kindergartens: this.state.kindergartens.concat(res.data.kindergartens),
            levels: this.state.levels.concat(res.data.levels)
        })
        console.log(res.data)
      })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    switch(name)
    {
      case 'firstName':
        this.props.updateFirstName(event.target.value)
        break;
      case 'lastName':
        this.props.updateLastName(event.target.value)
        break;
      case 'foundationLvl':
        this.props.updateFoundationLvl(event.target.value)
        break;
      case 'foundationName':
        this.props.updateFoundationName(event.target.value)
        this.getLevels(event.target.value)
        break;
      case 'foundationType':
        this.props.updateFoundationType(event.target.value)
        break;
    }
  };

  getLevels = (foundationName) => {
    axios.get('/get_levels', {
      params:{
        levels_by_nf: true,
        name: foundationName
      }
    })
    .then( res => {
        this.setState({
          levels: res.data.levels
      })
      console.log(res.data)
    })
  }


  render() {
    const { classes } = this.props;
    const {schools, universities, colleges, kindergartens, levels} = this.state
    var fndts = [];
    switch(this.state.foundationType)
    {
      case 'university': 
        fndts = universities;
        break; 
    }
    return (
      <div>
        <FormControl component="fieldset" className={classes.formControl}>
          <TextField
              label="First Name"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange('firstName')}
              margin="normal"
              required
              variant="outlined"
          />
          <TextField
              label="Last Name"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleChange('lastName')}
              margin="normal"
              required
              variant="outlined"
          />
          <TextField
            select
            label="Select"
            className={classes.textField}
            value={this.state.foundationType}
            onChange={this.handleChange('foundationType')}
            helperText="Please select your type of foundation"
            margin="normal"
            required
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
            onChange={this.handleChange('foundationName')}
            helperText="Please select your name of foundation"
            margin="normal"
            required
            variant="outlined"
          >
            {fndts.map(option => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select"
            className={classes.textField}
            value={this.state.foundationLvl}
            onChange={this.handleChange('foundationLvl')}
            helperText="Please select your level of foundation"
            margin="normal"
            required
            variant="outlined"
          >
            {levels.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </div>
    )
  }
}
export default withStyles(styles)(FormStudent);
