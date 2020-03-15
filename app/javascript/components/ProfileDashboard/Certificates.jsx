import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  root: {
    marginTop: '3%',
    width: '100%',
  },
});

class Certificates extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      profile: this.props.profile,
      current_user: this.props.current_user,
      certificates: this.props.certificates,
    }
  }
  render() {
    const { classes } = this.props
    if(this.state.certificates.length != 0) {
      return (  
              <div style={{ marginTop: 20}}>
                <div class='container'>
                  <div style={{width: '100%'}} class="alert alert-danger" role="alert">
                    Your Certificates
                  </div>
                </div>
                <List className={classes.root}>
                {this.state.certificates.map(value => (
                  <ListItem borderColor="primary.main" key={value.id} role={undefined} dense button >
                    <ListItemText primary={
                       <div>
                       <p>Certificate of "{value.foundationName}" level "{value.levelName}"</p>
                       <a href={'/certificates/' + value.id + '.pdf' }> Dowload in PDF </a>
                       </div>
                    } >
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </div>
            )
    } else {
      return (
        <div>
          <div class='container' >
            <div class="alert alert-danger" role="alert">
              While you don't have certificates
            </div>
          </div>
        </div>
      );
    }
  }
}

Certificates.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Certificates);
