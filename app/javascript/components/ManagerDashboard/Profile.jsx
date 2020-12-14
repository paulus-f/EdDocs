import React from 'react';
import Foindation from '../FoundationShow'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import ProfileAdmin from '../AdminDashboard/Profile'

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
      current_user: this.props.current_user,
      typeUser: 'manager',
      foundation: this.props.foundation,
    }
  }


  render() {
    const { classes } = this.props;
    const { profile, current_user } = this.state
    var foundation;
    if (current_user.role == 'admin'){
      return (
        <ProfileAdmin
              current_user = {this.state.current_user}
        />
      )
    }
    return (
       <div className={classes.root}>
        <Grid container spacing={8} className='mt-4'>
          <Grid item xs={12} className='mb-5'>
            <Grid container spacing={8} justify="flex-start">
              <Grid item xs>
                <div className='profile-ava text-center mt-4'>
                  <img src={this.props.ava} style={{ maxWidth: 300 }}/>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <List component="nav" className={classes.root}>
                  <ListItem button>
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                  </ListItem>
                  <ListItem button>
                    <ListItemText inset primary={ 'Email: ' + current_user.email } />
                  </ListItem>
                  <ListItem button>
                    <ListItemText inset primary={ 'Role: ' + current_user.role } />
                  </ListItem>
                  <ListItem button>
                    <ListItemText inset primary={ 'Sing Up date: ' + new Intl.DateTimeFormat('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                      }).format(new Date(current_user.created_at)) } />
                  </ListItem>
                </List>
                { // TODO: will add
                  /* <ul className="nav justify-content-start">
                  <li className="nav-item">
                    <a className="nav-link" href="/users/password/edit"> Change Password</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/users/confirmation"> Confirmation </a>
                  </li>
                </ul> */}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            {foundation}
          </Grid>
        </Grid>
      </div>
    );
  }
}

Profile.defaultProps = {
    ava: 'https://cs4.pikabu.ru/images/previews_comm/2015-01_5/14218560056983.jpg'
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
