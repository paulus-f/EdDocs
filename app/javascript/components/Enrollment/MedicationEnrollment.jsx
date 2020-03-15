import 'date-fns';
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab'
import TextField from '@material-ui/core/TextField'


const styles = theme => ({
  grid: {
    width: '60%',
  },
});

class MedicationEnrollment extends React.Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = { 
      model: 'MedicationContact',
      checking:false,
      medicationAmount: 1,
      timeSel: [ new Date() ],
      name: [''],
      time: new Date(),
      dose: [0],
    }
  };

  addTime = () => {
    const key = "TimePicker" + (this.state.medicationAmount);
    var selectedTime = this.state.selectedTime
    var {name, dose, timeSel} = this.state
    name.push('')
    dose.push(0)
    timeSel.push(new Date())
    this.setState({
      timeSel: timeSel,
      name: name,
      dose: dose,
      medicationAmount: this.state.medicationAmount + 1,
    });
    this.props.updateState(this.state);
    console.log(this.state)
  };

  handleChange = (index, name) => event => {
    console.log(event.target.name)
    console.log(index)
    var ind = Number(index);
    if(name == 'name'){
      var names = this.state.name;
      names[ind] = event.target.value
      this.setState({
        name: names
      })
    }
    if(name == 'dose'){
      var doses = this.state.dose;
      doses[ind] = event.target.value
      this.setState({
        dose: doses
      })
      this.props.updateState(this.state);
    };  
  }

  handleDateChange = index => event => {
    var timeSel = this.state.timeSel;
    var ind = Number(index);
    timeSel[ind] = event;
    this.setState({
      timeSel: timeSel
    })
  };  

  render() {
    const medication = [];
    const { classes } = this.props;
    const { selectedTime } = this.state;

    for (var i = 0; i < this.state.medicationAmount; i += 1) {
      medication.push(
        <MuiPickersUtilsProvider key={i} utils={DateFnsUtils}>
          <Grid container className={classes.grid} justify="space-around">
            <TimePicker
              margin="normal"
              label="Time picker"
              name="time"
              required
              onChange = {this.handleDateChange(i)}
              value={this.state.timeSel[Number(i)]}
              />
            <TextField
              required
              name="name"
              label="Pills name"
              margin="normal"
              onChange={this.handleChange(i, 'name')}
            />
            <TextField
              required
              name="dose"
              label="Dose"
              margin="normal"
              onChange={this.handleChange(i, 'dose')}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        );
    };

    return (
      <div className="medication-form">
        <h3>Medication:</h3>
        {medication}
        <Fab onClick={ this.addTime } size="small" color="primary" aria-label="Add" >
          <AddIcon />
        </Fab>
      </div> 
    );
  }
}

MedicationEnrollment.propTypes = {
  classes: PropTypes.object.isRequired,
};  

export default withStyles(styles)(MedicationEnrollment);