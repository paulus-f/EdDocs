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
      typeUser: 'Administrator'
    }
  }


  render() {
    const { classes } = this.props;
    const { current_user, typeUser } = this.state

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
                    <ListItemText inset primary={ 'Email: ' + current_user.email } />
                  </ListItem>
                  <ListItem button>
                    <ListItemText inset primary={ 'Role: ' +  typeUser} />
                  </ListItem>
                  <ListItem button>
                    <ListItemText inset primary={ 'Sign Up date: ' + new Intl.DateTimeFormat('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                      }).format(new Date(current_user.created_at)) } />
                  </ListItem>
                </List>
                {
                  // TODO: will add
                  /* <ul className="nav justify-content-start">
                  <li className="nav-item">
                    <a className="nav-link" href="/users/password/edit"> Change Password</a>
                  </li>
                </ul> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Profile.defaultProps = {
    ava: 'http://i.ru-phone.org/userfiles/walls/106/1067937/fhctkbyx.jpg'
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
