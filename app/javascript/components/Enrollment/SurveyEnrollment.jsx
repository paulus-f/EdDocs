import React from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";


import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Checkbox from '@material-ui/core/Checkbox';  
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

const styles = theme => ({

});

class SurveyEnrollment extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      model: 'Survey',
      params : { 
        sportF: this.props.data.sportF,
        glasses: this.props.data.glasses,
        hearing: this.props.data.hearing
      },
    }
  };

  handleChange = name => event => {
    var { params } = this.state;
    params[name] = event.target.checked;
    this.setState({
      params : params
    })
    this.props.updateState(this.state);
  }; 

  render() {
    const { classes } = this.props;

    return (
      <div>
        <FormGroup>
          <FormLabel component="legend">Short Survey</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.params.sportF}
                onChange={this.handleChange('sportF')}
                value = "sportF"
                name="sportF"
                color="primary"
              />
            }
            label="Is sport forbbiden?"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.params.glasses}
                onChange={this.handleChange('glasses')}
                value="glasses"
                name="glasses"
                color="primary"
              />
            }
            label="Does he wear glasses?"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.params.hearing}
                onChange={this.handleChange('hearing')}
                value="hearing"
                name="hearing"
                color="primary"
              />
            }
            label="Any hearing disfunction?"
          />
        </FormGroup>
      </div>
    );
  }
}

export default SurveyEnrollment;