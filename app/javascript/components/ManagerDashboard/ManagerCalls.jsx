import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import { Button } from "@material-ui/core";
import Functions from '../../utils/Functions';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import { Redirect, withRouter, Link } from 'react-router-dom';

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
      groups: props.levels.map((lvl) => {
        lvl.groups = lvl.groups.map(group => {
          group.level = lvl;
          return group;
        });
        return lvl.groups;
      }).flat(),
      courses: props.courses,
      selectedGroup: null, 
      selectedCourse: null,
      selectedCall: null,
      redirectToCall: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.updateCourse = this.updateCourse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChipClick = this.handleChipClick.bind(this);
  }

  updateCourse = (value) => {
    this.setState({ selectedCourse: value });
  };

  updateGroup = (value) => {
    this.setState({ selectedGroup: value });
  }

  handleChange = name => event => {
    switch(name)
    {
      case 'course':
        this.updateCourse(event.target.value)
        break;
      case 'group':
        this.updateGroup(event.target.value)
        break;
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    axios.post('/video_channels/', {
      group_id: this.state.selectedGroup,
      course_id: this.state.selectedCourse,
      authenticity_token: Functions.getMetaContent("csrf-token")
  })
    .then(res => {
      const { channels } = this.state
      this.setState({
        channels: [...channels, res.data.video_channel],
      });
    })
    .catch(err => {
      console.log(err);
    });
  };

  handleChipClick = id => {
    this.setState({
      selectedCall: id
    });
  }

  render() {
    const {channels, groups, courses, redirectToCall, selectedCall} = this.state;
    const {classes} = this.props;

    return (
      <div id='managerCalls'>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
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
                <MenuItem key={option.id} value={option.id}>
                  {`${option.level.name} - ${option.name}`}
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
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" color="primary" aria-label="Add">
              <AddIcon />
            </Button>
          </FormControl>
        </form>
        <br/>
        <div>
          {channels.map((channel) =>{
            return (
              <Link target={"_blank"}
                    to={`/video_channels/${channel.id}`} 
                    activeClassName='active'>
                <Chip key={channel.id}
                      label={channel.name}
                      clickable
                      onClick={(e) => this.handleChipClick(channel.id)}
                      color='primary' />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(ManagerCalls));
