import React from "react"
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from "prop-types"
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

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

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={['(', '+', /\d/, /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};


class ProfileData extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.DataValid = this.DataValid.bind(this);

    this.state = {
      first_name: props.Profile.first_name,
      last_name: props.Profile.last_name,
      position: '',
      phone: '(+375)   -  -  ',
    };
  }
  

  DataValid() {
    return (this.state.first_name && this.state.last_name && this.state.position && this.state.phone)
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

  render() {
    const { classes } = this.props;
    const { phone } = this.state;
    return (
      <form className={classes.container} autoComplete="off" >
          <FormControl component="fieldset" className={classes.formControl}> 
            <InputLabel htmlFor="work-phone">Work phone</InputLabel>
            <Input
            value={phone}
            onChange={this.handleChange}
            id="work-phone"
            name='phone'
            inputComponent={TextMaskCustom}
            />  
            <TextField
              id="outlined-first-name"
              label="First name"
              required
              name="first_name"
              className={classes.textField}
              margin="normal"
              value={this.state.first_name}
              variant="outlined"
              onChange={this.handleChange}
            />
             <TextField
              id="outlined-last-name"
              label="Last name"
              required
              name="last_name"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={this.state.last_name}
              onChange={this.handleChange}
            />
             <TextField
              id="outlined-position"
              label="Position"
              required
              name="position"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={this.handleChange}
            />
          </FormControl>
      </form>
    );
  }
}

ProfileData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileData);