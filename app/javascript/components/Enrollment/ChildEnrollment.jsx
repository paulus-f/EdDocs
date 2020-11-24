import React from "react"
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab'
import PropTypes from "prop-types"
import axios from 'axios';
import { Button } from "@material-ui/core";
import Functions from '../../utils/Functions'
import RadioButtons from './../RadioButtonsGroup' 
import NavigationIcon from '@material-ui/icons/Navigation';


const styles = theme => ({
  childForm: {
    marginBottom: 50,
  },
  fieldset: {
    width: '100%',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class ChildForm extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        model: 'GeneralInfo',
        params : {
          first_name: this.props.data.first_name,
          second_name: this.props.data.second_name,
          third_name: this.props.data.third_name,
          birth_date: new Date(props.data.birth_date).toISOString().slice(0,10) ,
          hobbie: this.props.data.hobbie
        }
      }
    }

    handleChange = event => {
      var field_name = event.target.name;
      var field_value = event.target.value; 
      this.setState(prevState => ({
        params : {...prevState.params, [field_name]: field_value },
      }))
      this.props.updateState(this.state);
    };  

    render() {
      const { classes } = this.props;
      return (
        <div id="child-form" className={classes.childForm}>
          <form className="form-group" autoComplete="off" id="" onSubmit={this.handleSubmit}>
            <FormControl component="fieldset" className={classes.formControl, classes.fieldset}>
              <TextField 
               label="First Name"
               name="first_name"
               required
               margin="normal"
               onChange={ this.handleChange }
               value={ this.state.params.first_name }
              />
              <TextField
               label="Last Name"
               name="second_name"
               required
               margin="normal"
               onChange={ this.handleChange }
               value={ this.state.params.second_name }
              />
              <TextField
               label="Third Name(optional)"
               name="third_name"
               margin="normal"
               onChange={ this.handleChange }
               value={ this.state.params.third_name }
              />
              <TextField
               type="date"
               margin="normal"
               name="birth_date"
               label="Birth date"
               defaultValue="2009-05-24"
               onChange={ this.handleChange }
               value={ this.state.params.birth_date }
              />
              <TextField
               label="hobbies(optional)"
               name="hobbie"
               margin="normal"
               onChange={ this.handleChange }
               value={ this.state.params.hobbie }
              />
            </FormControl>
          </form>
        </div>
      );
    }
}

export default withStyles(styles)(ChildForm);
