import React from "react"
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '25%',
    marginRight: '10%',
  },
  textField: {
    width: '150%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  picker: {
    height: '120%'
  },
});

class FoundationData extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.DataValid = this.DataValid.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this)

    this.state = {
      foundation_type: props.Foundation.type_foundation,
      foundation_name: props.Foundation.name,
      selectedBeginDate: new Date(),
      selectedEndDate: new Date(),
      foundation_address: ''
    };
  }
  

  DataValid() {
    return ( this.state.foundation_type 
          && this.state.foundation_name 
          && this.state.foundation_address 
          && this.state.selectedBeginDate < this.selectedEndDate 
          )
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value })
    if (this.DataValid())
      this.props.handleData(this.state)
    else
      this.props.handleData('')
  };

  onChangeDate = name => value => {
    this.setState({
      [name]: value
    })
    if(name == 'selectedEndDate'){
      this.props.endAcademicYear(value)
    } else {
      this.props.beginAcademicYear(value)
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} autoComplete="off" >
          <FormControl component="fieldset" className={classes.formControl}>
            <Select
              value={this.state.foundation_type}
              onChange={this.handleChange}
              name="foundation_type"
              required
              value={this.state.foundation_type}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value="" disabled>
                Foundation type
              </MenuItem>
              <MenuItem value={'school'}>School</MenuItem>
              <MenuItem value={'college'}>College</MenuItem>
              <MenuItem value={'university'}>University</MenuItem>
              <MenuItem value={'kindergarten'}>Kindergarten</MenuItem>
            </Select>
        
            <TextField
              id="outlined-foundation-name"
              label="Foundation name"
              required
              name="foundation_name"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={this.state.foundation_name}
              onChange={this.handleChange}
            />
            <TextField
              id="outlined-foundation-address"
              label="Foundation address"
              required
              name="foundation_address"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={this.handleChange}
            />

            <DateFormatInput
               label='Beginning of the school year'
               name='beginDate' 
               value={this.state.selectedBeginDate} 
               onChange={this.onChangeDate('selectedBeginDate')}
            />

            <DateFormatInput 
               label='End of the school year'
               name='endDate' 
               value={this.state.selectedEndDate} 
               onChange={this.onChangeDate('selectedEndDate')}
            />
          </FormControl>
      </form>
    );
  }
}

FoundationData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FoundationData);