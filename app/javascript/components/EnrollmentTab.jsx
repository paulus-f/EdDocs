import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import ParentForm from './Enrollment/ParentEnrollment';
import ChildForm from './Enrollment/ChildEnrollment';
import AllergyEnrollment from './Enrollment/AllergyEnrollment';
import MedicationEnrollment from './Enrollment/MedicationEnrollment';
import SurveyEnrollment from './Enrollment/SurveyEnrollment';
import EmergencyEnrollment from './Enrollment/EmergencyEnrollment';
import SignatureEnrollment from './Enrollment/SignatureEnrollment';
import Snackbar from '@material-ui/core/Snackbar';

import axios from 'axios';
import Functions from '../utils/Functions'



function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const initialState = {
  /* etc */
};

class EnrollmentBar extends React.Component {
 
  constructor(props) {
    super(props);
    this.saveData = this.saveData.bind(this);
    this.handleClose = this.handleClose.bind(this)
  }


  state = {
    value: 0,
    open: false,
    message: '',
    student_id: this.props.student_id,
    questionnaire: this.props.questionnaire,
    parent_contact: this.props.parent_contact,
    general_info: this.props.general_info,
    medication: this.props.medication,
    emergency: this.props.emergency,
    signature: this.props.signature,
    allergy: this.props.allergy
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClose = (event) => {
    this.setState({
      open: false
    })
  }

  saveData = (value) => {
    
  }

  updateState = (value) => {
    console.log(value);
    
    this.setState ({
      data: value
    }) 
  }

  handleSave = (event, value) => {  
    if(this.state.value == 6) {
      console.log('final')
      this.setState ({
        value: 0
      });
    } else {
      this.setState (prevState => ({
        value: prevState.value + 1
      }));
    }
    var data = this.state.data;
    var stud_id = this.state.student_id;
    if(data) {
    axios.post(`/enrollment/save`, { 
      data, 
      student_id: stud_id,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then(res => {
      this.setState(initialState);
      
      if(res.data.message) {
        this.setState({
          open: true,
          message: res.data.message,
        })
      }
    })
    console.log(data);
  }
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    const { defclass } = {
      'col-10'   : true,
      'col-sm-12': true,
      'd-flex'   : true,
      'justify-content-center': true,
    }
    console.log(this.state.student_id);

    return (
      <div className={classes.root} >
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Child" />
            <Tab label="Parents" />
            <Tab label="Allergy" />
            <Tab label="Medication" />
            <Tab label="Survey" />
            <Tab label="Emergency" />
            <Tab label="Signature" />
          </Tabs>
        </AppBar>
        <div className="col-12 col-xs-8 col-lg-6 col-md-8">
          {value === 0 && <TabContainer style={{flex: 0.8}}>
            <ChildForm data={this.state.general_info} updateState={this.updateState} />
          </TabContainer>}
          {value === 1 && <TabContainer style={{flex: 0.8}}> 
            <ParentForm data={this.state.parent_contact} updateState={this.updateState} />
          </TabContainer>}
          {value === 2 && <TabContainer style={{flex: 0.8}}>
            <AllergyEnrollment data = {this.state.allergy} updateState={this.updateState} />
          </TabContainer>}
          {value === 3 && <TabContainer style={{flex: 0.8}}>
            <MedicationEnrollment data = {this.state.medication}  data={this.state.medication} updateState={this.updateState} />
          </TabContainer>}
          {value === 4 && <TabContainer style={{flex: 0.8}}>
            <SurveyEnrollment data={this.state.questionnaire} updateState={this.updateState} />
          </TabContainer>}
          {value === 5 && <TabContainer style={{flex: 0.8}}>
            <EmergencyEnrollment data={this.state.emergency} updateState={this.updateState} />
          </TabContainer>}
          {value === 6 && <TabContainer style={{flex: 0.8}}>
            <SignatureEnrollment student_id={this.props.student_id} signature = {this.state.signature} updateState={this.updateState} />
          </TabContainer>}

          <Button variant="contained" color="primary" className={classes.button} onClick={ this.handleSave }>
            SAVE & NEXT
          </Button>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  }
}

EnrollmentBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnrollmentBar);
