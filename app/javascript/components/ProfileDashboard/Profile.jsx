import React from 'react';
import Foindation from '../FoundationShow'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import List from '@material-ui/core/List';
import Course from '../ManagerDashboard/CoursesPanel/Course'

const styles = theme => ({
  root: {
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
})

class Profile extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      profile: this.props.profile,
      current_user: this.props.current_user,
      typeUser: this.props.typeUser, 
      foundation: this.props.foundation, 
      level: this.props.level,
      group: this.props.group,    
      courses: this.props.courses    
    }
  }


  render() {
    const { classes } = this.props;
    const { level, group, profile, current_user, courses } = this.state
    var lvlInfo, badge, levelInfo, groupInfo;
    if(this.state.typeUser == 'student') {
      if(group) {
        levelInfo =  level.name
        groupInfo = group.name
        badge = <Grid container spacing={24} justify="flex-start">
                    <Badge style={{margin: 10}} badgeContent={courses.length}  color="primary">
                      <Typography className={classes.padding}>Your Courses: </Typography>
                    </Badge>
                    {courses.map(course => { 
                      return (
                        <Course 
                          level={this.state.level.name}
                          key={course.id}
                          course={course}
                          student={true}/>
                      )})}
                </Grid>        
      } else {
        levelInfo = 'While you don\'t have level'
        groupInfo = 'While you don\'t have group'
      }
      lvlInfo = <ListItem button>
                    <ListItemText inset primary={ 'Current level: ' + levelInfo } />
                  </ListItem>
      groupInfo = <ListItem button>
                    <ListItemText inset primary={ 'Current group: ' +  groupInfo} />
                </ListItem>
    }
    return (
       <div className={classes.root}>
        <Grid container spacing={8} className='mt-4'>
          <Grid item xs={12} className='mb-5'>
            <Grid container spacing={8} justify="flex-start">
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <List component="nav" className={classes.root}>
                  <ListItem button>
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={ 'Full Name: ' + profile.first_name + ' ' + profile.last_name } />
                  </ListItem>
                  <ListItem button>
                    <ListItemText inset primary={ 'Email: ' + current_user.email } />
                  </ListItem>
                  <ListItem button>
                    <ListItemText inset primary={ 'Role: ' + current_user.role } />
                  </ListItem>
                  {lvlInfo}                 
                  {groupInfo}
                  <ListItem button>
                    <ListItemText inset primary={ 'Sing Up date: ' + new Intl.DateTimeFormat('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                      }).format(new Date(current_user.created_at)) } />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Grid>
          {badge}
        </Grid>
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
