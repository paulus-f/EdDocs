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
import ProfilesTable from './AdminDashboard/ProfilesTable';
import FoundationsTable from './AdminDashboard/FoundationsTable';
import Statistics from './AdminDashboard/Statistics';
import Profile from './AdminDashboard/Profile';
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
 

class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_user: this.props.current_user,
      users: JSON.parse(this.props.users),
      foundations: JSON.parse(this.props.foundations),
      students: props.students,
      point: <ProfilesTable
                current_user={this.props.current_user}
                users={JSON.parse(this.props.users)}
              />,
      alertOpen: false,
      alertType: 'success',
      alertMessage: ''
    };
    this.changePoint = this.changePoint.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  changePoint = (value) => {
    this.setState({
      point: value
    })
  }

  handleSelect(e) {
    e.preventDefault();
    e.stopPropagation();
    const id = e.target.offsetParent.id
    console.log(id);
    switch(id) {
      case 'tableProfiles':
        this.setState({
          point:  <ProfilesTable
                    current_user={this.state.current_user}
                    users={this.state.users}
                  />});
        break;
      case 'tableFoundations':
        this.setState({
          point: <FoundationsTable
                    changePoint={this.changePoint}
                    current_user = {this.state.current_user}
                    foundations = {this.state.foundations}
                  />
        })
        break;
      case 'profile':
        this.setState({
          point: <Profile
              current_user = {this.state.current_user}
          />
        })
        break;
      case 'statistics':
        this.setState({
          point: <Statistics/>
        })
        break;
  }
};

  ListItemComposition() {
    const { classes } = this.props;
    return (
        <div >
          <MenuList onSelect={this.handleSelect}>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='profile'>
              <ListItemIcon className={classes.icon}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="My Profile" />
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='tableFoundations'>
              <ListItemIcon className={classes.icon}>
                <DomainIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Table Foundations"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='tableProfiles'>
              <ListItemIcon className={classes.icon}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Table Users"/>
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={this.handleSelect} id='statistics'>
              <ListItemIcon className={classes.icon}>
                <StatisticIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Statistics"/>
            </MenuItem>
          </MenuList>
        </div>
    );
  }
  render() {
    return (
      <div className='form-row ManagerDashboard'>
        <div className="col-md-2 MenuList">
          {this.ListItemComposition()}
        </div>
          {this.state.point}
      </div>
    )
  }
}

AdminDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminDashboard);