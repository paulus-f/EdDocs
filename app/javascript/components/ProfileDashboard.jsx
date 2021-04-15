import React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import DomainIcon from '@material-ui/icons/Domain';
import StatisticIcon from '@material-ui/icons/Report'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GroupIcon from '@material-ui/icons/Group';
import BookIcon from '@material-ui/icons/Book';
import EmailIcon from '@material-ui/icons/Email';
import Profile from './ProfileDashboard/Profile';
import Chat from './ProfileDashboard/Chat'
import Snackbar from '@material-ui/core/Snackbar';
import Certificates from './ProfileDashboard/Certificates';
import Children from './ProfileDashboard/Children';
import Grid from '@material-ui/core/Grid';
import FaceIcon from '@material-ui/icons/Face';
import ChatIcon from '@material-ui/icons/Chat';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import FoundationShow from './FoundationShow';
import CoursesPanel from './ManagerDashboard/CoursesPanel';
import VideoCallIcon from '@material-ui/icons/VideoCall'
import ProfileCalls from './ProfileDashboard/ProfileCalls'
import QuizContainer from './QuizContainer';
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


class ProfileDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_user: this.props.current_user,
      typeUser: this.props.typeUser,
      point: <Profile
        foundationImage={this.props.foundationImage}
        levels={this.props.levels}
        courses={this.props.courses}
        level={this.props.level}
        group={this.props.group}
        profile={this.props.profile}
        foundation={this.props.foundation}
        current_user={this.props.current_user}
        typeUser={this.props.typeUser}
      />,
      alertOpen: false,
      alertMessage: '',
      chatMessage: '',
      alertMessage: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.changePoint = this.changePoint.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.renderListStudent = this.renderListStudent.bind(this)
  }

  componentWillMount() {
    this.createSocket();
  }

  componentWillUnmount() {
    App.cable.disconnect()
  }

  createSocket() {
    App.notifications = App.cable.subscriptions.create({
      channel: 'NotificationsChannel',
      id: this.state.current_user.id
    }, {
      connected: () => { },
      received: (data) => {
        console.log(data)
        this.setState({
          chatMessage: ' Message: ' + data.message + ' By: ' + data.by_user.email,
          alertMessage: true
        })
      },
    });
  }


  changePoint = (value) => {
    this.setState({
      point: value
    })
  }


  handleClose = (event) => {
    this.setState({
      alertMessage: false
    })
  };

  renderListStudent() {
    if (!this.props.group) {
      return (
        <h1>
          You haven't a group. Please contact to Support.
        </h1>
      );
    }
    return (
      <div style={{ marginTop: 20, marginLeft: 100 }}>
        <h3>{this.props.group.name} of {this.props.level.name}:</h3>
        <List>
          {this.props.students.map(student => (
            <ListItem key={student.id}>
              <ListItemAvatar>
                <Avatar>
                  <FaceIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={student.profile.last_name + " " + student.profile.first_name}
              />
            </ListItem>
          ))}
        </List>
      </div>
    )
  }

  handleSelect(e) {
    e.preventDefault();
    e.stopPropagation();
    const id = e.target.offsetParent.id
    console.log(id);
    switch (id) {
      case 'myProfile':
        this.setState({
          point: <Profile
            courses={this.props.courses}
            level={this.props.level}
            group={this.props.group}
            current_user={this.props.current_user}
            profile={this.props.profile}
            typeUser={this.props.typeUser}
            foundation={this.props.foundation}
          />,
        });
        break;
      case 'myChat':
        this.setState({
          point: <Chat foundation={this.props.foundation} />
        });
        break;
      case 'myCertificates':
        this.setState({
          point: <Certificates
            current_user={this.props.current_user}
            profile={this.props.profile}
            certificates={this.props.certificates}
          />
        });
        break;
      case 'myGroup':
        this.setState({
          point: this.renderListStudent()
        });
        break;
      case 'myChildren':
        this.setState({
          point: <Children
            current_user={this.props.current_user}
            children={this.props.children}
          />
        });
        break;
      case 'myFoundation':
        this.setState({
          point: <FoundationShow
            foundationImage={this.props.foundationImage}
            levels={this.props.levels}
            current_user={this.props.current_user}
            foundation={this.props.foundation}
            studentsCount={this.props.students_count}
            managersCount={this.props.managers_count}
          />
        });
        break;
      case 'myCourses':
        this.setState({
          point: <CoursesPanel
            student={true}
            courses={this.props.courses}
            imageNotFound={this.props.imageNotFound}
            levels={this.props.levels}
            current_user={this.props.current_user}
            foundation={this.props.foundation}
            studentsCount={this.props.students_count}
            managersCount={this.props.managers_count}
          />
        });
        break;
      case 'quiz':
        this.setState({
          point: <QuizContainer quizzes={this.props.quizzes}
            currentUser={this.props.current_user}
          />
        });
        break;
      case 'calls':
        this.setState({
          point: <ProfileCalls currentUser={this.props.current_user}
            channels={this.props.channels || []} />
        });
        break;
    }
  };


  ListItemComposition() {
    const { classes, typeUser } = this.props;
    var menu;
    if (typeUser == 'parent') {
      menu = <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='myChildren'>
        <ListItemIcon className={classes.icon}>
          <StatisticIcon />
        </ListItemIcon>
        <ListItemText classes={{ primary: classes.primary }} inset primary="My Children" />
      </MenuItem>
    }
    if (typeUser == 'student') {
      menu = <div>
        <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='myFoundation'>
          <ListItemIcon className={classes.icon}>
            <DomainIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="My Foundation" />
        </MenuItem>

        <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='myGroup'>
          <ListItemIcon className={classes.icon}>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="My Group" />
        </MenuItem>

        <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='myCertificates'>
          <ListItemIcon className={classes.icon}>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="My Certificates" />
        </MenuItem>

        <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='myChat'>
          <ListItemIcon className={classes.icon}>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Chat" />
        </MenuItem>

        <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='myCourses'>
          <ListItemIcon className={classes.icon}>
            <BookIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="My Courses" />
        </MenuItem>

        <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='calls'>
          <ListItemIcon className={classes.icon}>
            <VideoCallIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Calls" />
        </MenuItem>

        <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='quiz'>
          <ListItemIcon className={classes.icon}>
            <BookmarkIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Quiz" />
        </MenuItem>

      </div>;
    }

    return (
      <div>
        <MenuList onSelect={this.handleSelect}>
          <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='myProfile'>
            <ListItemIcon className={classes.icon}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="My Profile" />
          </MenuItem>
          {menu}
        </MenuList>
      </div>
    );
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route>
            <div className='form-row ManagerDashboard'>
              <div>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={this.state.alertMessage}
                  autoHideDuration={2000}
                  onClose={this.handleClose}
                  message={<span id="message-id">{this.state.chatMessage}</span>}
                />
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2 MenuList">
                {this.ListItemComposition()}
              </div>
              <div className="col-12 col-sm-12  col-md-7 col-lg-9 col-xs-12 col-xl-9">
                {this.state.point}
              </div>
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

ProfileDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileDashboard);
