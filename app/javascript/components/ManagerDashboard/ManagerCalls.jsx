import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'
import axios from 'axios';
import { lv } from 'date-fns/locale';

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

class ManagerCalls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: props.channels,
      groups: props.levels.map(lvl => lvl.groups).flat(),
      courses: props.courses,
      selectedGroup: null, 
      selectedCourse: null 
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.updateCourse = this.updateCourse.bind(this);
  }

  updateGroup = (value) => {
    this.setState({ selectedGroup: value });
  }

  updateCourse = (value) => {
    this.setState({ selectedCourse: value });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    switch(name)
    {
      case 'course':
        updateCourse(event.target.value)
        break;
      case 'group':
        updateGroup(event.target.value)
        break;
    }
  };

  render() {
    const {channels, groups, courses} = this.state;
    const {classes} = this.props;

    return (
      <div id='managerCalls'>
        <FormControl>  
          <TextField
            select
            label="Select"
            className={classes.textField}
            value={this.state.selectedGroup}
            onChange={this.handleChange('group')}
            margin="normal"
            required
            variant="outlined"
          >
            {groups.map(option => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select"
            className={classes.textField}
            value={this.state.selectedCourse}
            onChange={this.handleChange('course')}
            margin="normal"
            required
            variant="outlined"
          >
            {courses.map(course => (
              <MenuItem key={course.id} value={course.name}>
                {course.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(ManagerCalls);
