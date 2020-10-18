import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PersonAdd from '@material-ui/icons/PersonAdd';
import SignIn from './SignIn';
import SignUp from './SignUp';

const styles = {
  root: {
    marginLeft: '15%',
    marginRight: '50%',
    width: '70%',
  },
};

const links = [{
  label: 'Log In',
  icon: <AccountCircle>access_time</AccountCircle>,
}, {
  label: 'Sign Up',
  icon: <AccountCircle>favorite</AccountCircle>,
}];

class Auth extends React.Component {
  /**
   * @param props - Comes from your rails view.
  */
  constructor(props) {
    super(props);
    this.state = {
      current_user: this.props.current_user,
      value: 0,
      children: <SignIn current_user={this.props.current_user} />,
      title: links[0].label
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
     const title = links[value].label;
    let children;
    switch (value) {
      case 0:
        children = <SignIn current_user={this.state.current_user}  key="SignIn" />;
        break;
      case 1:
        children = <SignUp current_user={this.state.current_user} key="SignUp" />;
        break;
    }
    this.setState({ title, children });
  };

  render() {
    const { classes } = this.props;
    const { value, children} = this.state;
    return (
      <div className={classes.root} >
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          style={{marginRight: 300}}
        >
          <BottomNavigationAction label={links[0].label} icon={<AccountCircle />} />
          <BottomNavigationAction label={links[1].label} icon={<PersonAdd />} />
        </BottomNavigation>
        {children}
      </div>
    );
  }
}

Auth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Auth);

