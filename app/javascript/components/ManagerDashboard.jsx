import React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import VideoCallIcon from '@material-ui/icons/VideoCall'
import DomainIcon from '@material-ui/icons/Domain';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GroupIcon from '@material-ui/icons/Group';
import BookIcon from '@material-ui/icons/Book';
import EmailIcon from '@material-ui/icons/Email';
import DraftsIcon from '@material-ui/icons/Drafts';
import TableOfInvites from './ManagerDashboard/TableOfInvites';
import FoundationShow from './FoundationShow'
import TableOfStudents from './ManagerDashboard/TableOfStudents'
import TableOfRequests from './ManagerDashboard/TableOfRequests'
import Alert from './Alert';
import LevelsPanel from './ManagerDashboard/LevelsPanel';
import CoursesPanel from './ManagerDashboard/CoursesPanel';
import Functions from '../utils/Functions';
import axios from 'axios';
import ManagerCalls from './ManagerDashboard/ManagerCalls'
import Reports from './ManagerDashboard/Reports'
import Profile from './ManagerDashboard/Profile';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

class ManagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_user: this.props.current_user,
      foundation: this.props.foundation,
      levels: this.props.levels,
      requests: this.props.requests,
      invites: this.props.invites,
      students: this.props.students,
      courses: this.props.courses,
      studentsWithoutGroup: this.props.studentsWithoutGroup,
      point: <TableOfStudents students={this.props.students}
                              OpenCloseAlert={this.OpenCloseAlert.bind(this)}
                              foundation={this.props.foundation}
                              SetMessageAlert={this.SetMessageAlert.bind(this)}
                              SetTypeAlert={this.SetTypeAlert.bind(this)}/>,
      alertOpen: false,
      alertType: 'success',
      alertMessage: ''
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.OpenCloseAlert = this.OpenCloseAlert.bind(this);
    this.SetTypeAlert = this.SetTypeAlert.bind(this);
    this.SetMessageAlert = this.SetMessageAlert.bind(this);
    this.CheckAccept = this.CheckAccept.bind(this)
    this.deleteCourse = this.deleteCourse.bind(this)
    this.newCourse = this.newCourse.bind(this)
    this.updateCourse = this.updateCourse.bind(this)
    this.Reload = this.Reload.bind(this)
  }

  CheckAccept(invite) {
    const studentsId = this.state.students.map(student => (student.id))
    return studentsId.indexOf(invite.id) != -1
  }

  OpenCloseAlert(){
    this.setState({alertOpen: true})
  }

  CloseAlert(){
    this.setState({alertOpen: false})
  }
  SetTypeAlert(type){
    this.setState({alertType: type})
  }
  SetMessageAlert(message){
    this.setState({alertMessage: message})
  }

  newCourse(course){
    const courses = this.state.courses
    courses.push(course)
    this.setState({courses: courses})
  }

  updateCourse(course){
    const courses = this.state.courses
    const index = courses.findIndex((Course) => {if (Course.id == course.id) return true})
    courses.splice(index, 1, course)
    this.setState({courses: courses})
  }

  deleteCourse(course){
    const courses = this.state.courses
    const index = courses.findIndex((Course) => {if (Course.id == course.id) return true})
    courses.splice(index, 1)
    this.setState({courses: courses})
  }

  Reload() {
    axios.post('/manager_dashboard/reload', {
      id: this.state.foundation.id,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
      .then(res => {
        this.setState({courses: res.data.courses,
                       levels: res.data.levels,
                       requests: res.data.requests,
                       invites: res.data.invites,
                       students: res.data.students,
                       studentsWithoutGroup: res.data.studentsWithoutGroup})
      }
    )
  }
  
  

  handleSelect(e) {
    e.preventDefault();
    e.stopPropagation();
    const id = e.target.offsetParent.id
    this.Reload()
    switch(id) {
      case 'profile':
        this.setState({point: <Profile current_user={this.props.current_user}
                                       foundation={this.props.foundation}/>})
        break;
      case 'foundation':
        this.setState({
          point: <FoundationShow foundationImage={this.props.foundationImage}
                                 foundation={this.state.foundation}
                                 manager={this.props.manager}
                                 foundationImageNotFound={this.props.foundationImageNotFound}
                                 levels={this.state.levels}
                                 OpenCloseAlert={this.OpenCloseAlert}
                                 SetMessageAlert={this.SetMessageAlert}
                                 SetTypeAlert={this.SetTypeAlert}
                                 current_user={this.state.current_user}
                                 studentsCount={this.state.students.length}
                                 managersCount={this.props.managers_count}/>
          })
        break
      case 'groups':
        this.setState({point: <LevelsPanel levels={this.props.levels}
                                           studentsWithoutGroup={this.state.studentsWithoutGroup}
                                           foundation={this.props.foundation}
                                           OpenCloseAlert={this.OpenCloseAlert}
                                           SetMessageAlert={this.SetMessageAlert}
                                           SetTypeAlert={this.SetTypeAlert}/>})
        break;
      case 'students':
        this.setState({point: <TableOfStudents students={this.state.students}
                                               foundation={this.state.foundation}
                                               OpenCloseAlert={this.OpenCloseAlert}
                                               SetMessageAlert={this.SetMessageAlert}
                                               SetTypeAlert={this.SetTypeAlert}/>})
        break;
      case 'invites':
        this.setState({point: <TableOfInvites  invites={this.props.invites}
                                               foundation={this.state.foundation}
                                               OpenCloseAlert={this.OpenCloseAlert}
                                               CheckAccept={this.CheckAccept}
                                               SetMessageAlert={this.SetMessageAlert}
                                               SetTypeAlert={this.SetTypeAlert} />});
        break; 
      case 'courses':
        this.setState({point: <CoursesPanel student={false}
                                            deleteCourse={this.deleteCourse}
                                            courses={this.state.courses}
                                            foundation={this.props.foundation}
                                            levels={this.props.levels}
                                            imageNotFound={this.props.imageNotFound}
                                            newCourse={this.newCourse}
                                            updateCourse={this.updateCourse}
                                            OpenCloseAlert={this.OpenCloseAlert}
                                            SetMessageAlert={this.SetMessageAlert}
                                            SetTypeAlert={this.SetTypeAlert}/>})
        break;
      case 'requests':
        this.setState({point: <TableOfRequests requests={this.state.requests}
                                               OpenCloseAlert={this.OpenCloseAlert}
                                               SetMessageAlert={this.SetMessageAlert}
                                               SetTypeAlert={this.SetTypeAlert}/> })
        break;
      case 'calls':
        this.setState({
          point: <ManagerCalls courses={this.state.courses}
                               levels={this.props.levels}
                               channels={this.props.channels}/>
        });
        break;  
      case 'reports':
        this.setState({
          point: <Reports foundationId={this.state.foundation.id}/>
        });
        break;
    }
  };

  ListItemComposition() {
    const { classes } = this.props;
    return (
        <Paper style={{ height: '100%'}} >
          <MenuList onSelect={this.handleSelect}>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='profile'>
              <ListItemIcon className={classes.icon}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="My profile" />
            </MenuItem>
            <MenuItem className={classes.menuItem}  onClick={this.handleSelect} id='foundation'>
              <ListItemIcon className={classes.icon}>
                <DomainIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="My foundation"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='groups'>
              <ListItemIcon className={classes.icon}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Groups"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='students'>
              <ListItemIcon className={classes.icon}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Students"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='invites'>
              <ListItemIcon className={classes.icon}>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Invites"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='courses'>
              <ListItemIcon className={classes.icon}>
                <BookIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Courses"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='requests'>
              <ListItemIcon className={classes.icon}>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Requests"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='calls'>
              <ListItemIcon className={classes.icon}>
                <VideoCallIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Calls"/>
            </MenuItem>
            {
              // TODO: future feature
            }
            {/* <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='reports'>
              <ListItemIcon className={classes.icon}>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Statistics"/>
            </MenuItem> */}
          </MenuList>
        </Paper>
    );
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route>
            <div className='form-row ManagerDashboard'>
              <div className="col-md-2 MenuList">
                {this.ListItemComposition()}
                <Alert onClose={this.CloseAlert.bind(this)} alertOpen={this.state.alertOpen} alertType={this.state.alertType} alertMessage={this.state.alertMessage}/>
              </div>
                {this.state.point}
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

ManagerDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManagerDashboard);