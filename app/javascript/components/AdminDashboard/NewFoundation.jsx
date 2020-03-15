import React from 'react';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import { subDays } from 'date-fns';
import Functions from '../../utils/Functions'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '25%',
    marginRight: '10%',
  },
  textField: {
    width: '200%',
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

class NewFoundation extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: '',
      type_foundation: '',
      begin_academic_year: new Date(),
      end_academic_year: new Date(),
      address: '',
      image: '',
      allManegers: [],
      selected_manager: '',
    }

    this.handleChangeImage = this.handleChangeImage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
  }

  componentDidMount(){
    axios.get('/free_managers')
      .then( res => {
        this.setState({
          allManegers: res.data.emails
        })
      })
  }

  handleChangeImage = event => {
    var file = event.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      this.setState({
        image: reader.result
      })
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const foundation = this.state
    axios.post('/foundations', {
      foundation,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
      .then( res => {
        window.location.href = '/'
        console.log(res)
      })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  onChangeDate = name => value => {
    this.setState({
      [name]: value
    })
    if(name == 'selectedEndDate'){
      this.setState({
        end_academic_year: value
      })
    } else {
      this.setState({
        begin_academic_year: value
      })
    }
  }

  render() {
    const { classes } = this.props;
    const { image } = this.state;
    var res;
    if( image != ''){
      res = <img 
              style={{ 
                margin: 30,
                borderColor: '#b30000', 
                borderRadius: 15
              }} 
              src={image}
            />
    }
    return ( 
      <div>
        <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit} >
          <FormControl component="fieldset" className={classes.formControl}>
            <TextField
              select
              required
              fullWidth
              label="Choose Foundation Type"
              className={classes.textField}
              value={this.state.type_foundation}
              onChange={this.handleChange('type_foundation')}
              margin="normal"
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Foundation type
              </MenuItem>
              <MenuItem value={'school'}>School</MenuItem>
              <MenuItem value={'college'}>College</MenuItem>
              <MenuItem value={'university'}>University</MenuItem>
              <MenuItem value={'kindergarten'}>Kindergarten</MenuItem>
            </TextField>
            <TextField
              id="outlined-foundation-name"
              label="Foundation name"
              required
              fullWidth
              name="foundation_name"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={this.state.name}
              onChange={this.handleChange('name')}
            />
            <TextField
              id="outlined-foundation-address"
              label="Foundation address"
              required
              value={this.state.address}
              name="foundation_address"
              className={classes.textField}
              fullWidth
              margin="normal"
              variant="outlined"
              onChange={this.handleChange('address')}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              className={classes.textField}
              placeholder="Placeholder"
              multiline
              value={this.state.description}
              margin="normal"
              variant="outlined"
              onChange={this.handleChange('description')}
            />
            <TextField
            select
            label="Select"
            fullWidth
            className={classes.textField}
            value={this.state.selected_manager}
            onChange={this.handleChange('selected_manager')}
            helperText="Choose manager"
            margin="normal"
            variant="outlined"
            >
            {this.state.allManegers.map(manager => (
              <MenuItem key={manager.id} value={manager.email}>
                {manager.email}
              </MenuItem>
            ))}
            </TextField>
            <Button className={classes.textField} variant="contained" component="label">
                  Upload File
                  <input
                    required
                    type="file"
                    name="image"
                    onChange={this.handleChangeImage}
                    style={{ display: "none" }}
                  />
            </Button>
            {res}
            <DateFormatInput
                label='Beginning of the school year'
                name='beginDate' 
                required
                value={this.state.begin_academic_year} 
                onChange={this.onChangeDate('selectedBeginDate')}
            />
            <DateFormatInput 
              label='End of the school year'
              name='endDate'
              required 
              value={this.state.end_academic_year} 
              onChange={this.onChangeDate('selectedEndDate')}
            />
            <Button type={"submit"} color="primary" aria-label="Add">
              Add <AddIcon />
            </Button>
            </FormControl>
        </form>
      </div>
    );
  }
}

NewFoundation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewFoundation);