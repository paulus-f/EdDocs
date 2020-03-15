import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ProfileData from './FoundationForm/ProfileData';
import FoundationData from './FoundationForm/FoundationData';
import Apply from './FoundationForm/Apply';


function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
});

class FoundationForm extends React.Component {
  constructor(props) {
    super(props);
    this.FoundationChange = this.FoundationChange.bind(this);
    this.ProfileChange = this.ProfileChange.bind(this);
    this.Apply = this.Apply.bind(this);
    this.DataValid = this.DataValid.bind(this);
    this.getBeginDate = this.getBeginDate.bind(this)
    this.getEndDate = this.getEndDate.bind(this)


    this.state = {
      value: 0,
      foundation_data: props.foundation,
      profile_data: props.profile,
      end_academic_year: new Date(),
      begin_acedemic_year: new Date(),
      message: ''
    };
  }
  

  getBeginDate = value => {
    this.setState({
      begin_acedemic_year: value,
    })
  }

  getEndDate = value => {
    this.setState({
      end_academic_year: value,
    })
  }

  FoundationChange(foundation) {
    this.setState({ foundation_data: foundation })
  }

  ProfileChange(profile) {
    this.setState({ profile_data: profile })
  }

  Apply(message) {
    this.setState({ message: message })
    if (this.DataValid())
      console.log('request done');
    else 
      console.log('data invalid');
  }

  DataValid() {
    return (this.state.foundation_data && this.state.profile_data)
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Foundation data"/>
            <Tab label="Profile data" />
            <Tab label="Apply" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <FoundationData 
              endAcademicYear = {this.getEndDate}
              beginAcademicYear = {this.getBeginDate}
              Foundation={this.props.foundation} 
              handleData={this.FoundationChange}
            />
          </TabContainer>
          <TabContainer dir={theme.direction}><ProfileData Profile={this.props.profile} handleData={this.ProfileChange}/></TabContainer>
          <TabContainer dir={theme.direction}><Apply applyData={this.Apply}/></TabContainer>
        </SwipeableViews>
      </div> 
    );
  }
}

FoundationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FoundationForm);
