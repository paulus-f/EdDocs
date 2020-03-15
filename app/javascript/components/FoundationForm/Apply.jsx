import React from "react"
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from "prop-types"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button } from "@material-ui/core";

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
});

class Apply extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  state = {
    message: '',
    agree: '',
  };
  
  handleApply(){
    this.props.applyData(this.state.message)
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value })
  };

  handleChecked() {
    this.setState({ agree: !this.state.agree})
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} autoComplete="off" >
          <FormControl component="fieldset" className={classes.formControl}>
            <TextField
              id="outlined-message"
              label="Message"
              placeholder="Send a message to admin with request"
              multiline
              rows='4'
              rowsMax='10'
              name="message"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={this.handleChange}
            />
             <FormControlLabel control={<Checkbox id='agree' 
                                                  color="primary"
                                                  checked={this.state.agree}
                                                  onChange={this.handleChecked.bind(this)}/>} label="I agree with the rules of site use (link to rules should be here)" />
            <Button variant="outlined" color="primary" className={classes.button} disabled={!this.state.agree} onClick={this.handleApply.bind(this)}>
              Apply
            </Button>
          </FormControl>
      </form>
    );
  }
}

Apply.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Apply);