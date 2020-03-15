import React from "react"
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import Snackbar from '@material-ui/core/Snackbar';
import FormGroup from '@material-ui/core/FormGroup'
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from  '@material-ui/icons/Delete'
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab'
import PropTypes from "prop-types"
import axios from 'axios';
import { Button } from "@material-ui/core";
import Functions from '../utils/Functions'
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers'

const styles = theme => ({ 
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 600
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


let DatePicker = (props) => {
  const { classes } = props;

  return (
      <TextField
        id={props.id}
        style={{margin:30}}
        label={props.label}
        type="date"
        min={props.min}
        max={props.max}
        value={props.value}
        className={classes.textField}
        onChange={props.handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
  );
}

DatePicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

DatePicker =  withStyles(styles)(DatePicker);

class FoundationEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundation: this.props.foundation, 
      nameFoundation: this.props.foundation.name,
      addressFoundation: this.props.foundation.address,
      image: null,
      image_url: this.props.image_url, 
      description: this.props.foundation.description,
      end_year: this.props.foundation.end_academic_year,
      begin_year: this.props.foundation.begin_academic_year,
      isHovered: false
    };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeImage = this.handleChangeImage.bind(this)
    this.handleDeleteImg = this.handleDeleteImg.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.handleLeave = this.handleLeave.bind(this)
  }

  handleEnter() {
    this.setState({
      isHovered: true 
    });
  }

  handleLeave() {
    this.setState({
      isHovered: false 
    });
  }

  componentDidUpdate() {
  }

  handleChangeImage = event => {
    event.preventDefault();
    var file = event.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        axios.post(`/foundation/preload`, {
          id: this.state.foundation.id,
          image: [reader.result],
          authenticity_token: Functions.getMetaContent("csrf-token")
        })
        .then(res => {
          console.log(res)
          this.setState({
            image_url: reader.result
          })  
        })
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    axios({
      method: 'put',
      url: '/foundations/' + this.state.foundation.id,
      data: {
        name: event.target.name.value,
        description: event.target.description.value,
        end_academic_year: this.state.end_year,
        begin_academic_year: this.state.begin_year,
        address:this.state.addressFoundation,
        authenticity_token: Functions.getMetaContent("csrf-token")
      }
    })
    .then(res => {
      this.props.closeForm()
      this.props.reload(res.data)
      this.props.SetMessageAlert('Foundation successfully updated!')
      this.props.SetTypeAlert('success')
      this.props.OpenCloseAlert()
    })  
  }

  handleDeleteImg = event => {
    axios.post(`/foundation/purge`, {
      id: this.state.foundation.id,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then(res => {
      console.log(res.data.message)
      this.setState({
        image_url: ''
      })  
    })  
  }

  render() {
    const { classes } = this.props;
    const { image_url, end_year, begin_year } = this.state;
    let srcImage =  <div className='col-md-6'>
                    <img src={image_url ? image_url : this.props.image_not_found }
                         style={{width:'100%', height: 300}} 
                         onMouseEnter = {this.handleEnter.bind(this)}
                         onMouseLeave = {this.handleLeave.bind(this)} 
                    />
                     {this.state.isHovered && image_url ? (
                        <Button variant='outlined'
                                color='secondary'
                                onMouseEnter = {this.handleEnter.bind(this)}
                                onMouseLeave = {this.handleLeave.bind(this)} 
                                onClick={this.handleDeleteImg}
                                style={{width:'100%'}}>
                          Delete Image <DeleteIcon color='secondary'/>
                        </Button>

                      ) : (
                        <div />
                      )}
                       <Button variant="contained" component="label" style={{width:'100%'}}>
                        Upload File
                        <input
                          type="file"
                          name="image"
                          onChange={this.handleChangeImage}
                          style={{ display: "none" }}
                        />
                      </Button>
                  </div>
    return (
      <div style={{marginTop: 20}}>
        <form className={classes.root} const autoComplete="off" onSubmit={this.handleSubmit}>
        <div className='form-row'>
            <div className='col-md-6'>
             <DatePicker
              label='Begin year'
              id='beginYear'
              min = {begin_year}
              max={end_year}
              value={this.state.begin_year} 
              handleChange={this.handleChange('begin_year')}
            />
            <DatePicker
              label = 'End year'
              id='endYear'
              min = {begin_year}
              max={end_year}
              value = {this.state.end_year} 
              handleChange = {this.handleChange('end_year')}
            />
            </div>
            {srcImage}
           </div>
          <FormControl fullWidth  component="fieldset" >         
              <TextField
                label="Name foundation"
                name="name"
                margin="normal"
                value={this.state.nameFoundation}
                variant="outlined"
                onChange={this.handleChange('nameFoundation')}
              />
               <TextField
                label="Foundation address"
                name="address"
                margin="normal"
                value={this.state.addressFoundation}
                variant="outlined"
                onChange={this.handleChange('addressFoundation')}
              />
              <TextField
                label="Description"
                name="description"
                placeholder="Placeholder"
                multiline
                value={this.state.description}
                margin="normal"
                variant="outlined"
                onChange={this.handleChange('description')}
              />
              <Button style={{marginTop: 20}} type={"submit"} color="primary">
                Edit <AddIcon/>
              </Button>
            </FormControl>
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(FoundationEditForm);
