import React from "react"
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';


const styles = theme => ({
  childForm: {
    marginTop: 75,
    marginBottom: 50,
  },
  fieldset: {
    width: '100%',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class AllergyEnrollment extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    };

    state = {
      model: 'Allergy',
      params : {
          cause: this.props.data.cause,
          source: this.props.data.source,
      }
    }

    handleChange = name => event => {
      if(name == 'cause') {
        this.setState({
          params : {
            [name]: event.target.value,
            source: this.state.params.source, 
            },
        });
      } else {
      this.setState({
          params : {
            cause: this.state.params.cause, 
            [name]: event.target.value
          },
        });
      }
      this.props.updateState(this.state);
      console.log(this.state)
    };


    render() {
      const { classes } = this.props;
        
      return (
        <div id="child-form" className={classes.childForm}>
          <h3>Allergy:</h3>
              <FormControl component="fieldset" className={classes.formControl +' '+ classes.fieldset}>
                <InputLabel htmlFor="allergy-select">Cause</InputLabel>
                <Select
                    value={this.state.params.cause}
                    onChange={this.handleChange('cause')}
                >
                    <MenuItem value={'Foods'}>Foods</MenuItem>
                    <MenuItem value={'Latex'}>Latex</MenuItem>
                    <MenuItem value={'Medications'}>Medications</MenuItem>
                    <MenuItem value={'Hygiene hypothesis'}>Hygiene hypothesis</MenuItem>
                    <MenuItem value={'Other environmental factors'}>Other environmental factors</MenuItem>
                </Select>
            </FormControl> 
            <FormControl component="fieldset" className={classes.formControl +' '+ classes.fieldset}>
              <TextField
               label="Source"
               name="source"
               margin="normal"
               onChange={this.handleChange('source')}
               value={this.state.params.source}
              />
            </FormControl>
        </div>
      );
    }
}

export default withStyles(styles)(AllergyEnrollment);