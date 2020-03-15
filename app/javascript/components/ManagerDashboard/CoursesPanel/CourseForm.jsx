import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Functions from '../../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from 'axios';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  imageStyle: {
    width: '100%',
    height: '80%', 
  }
});



function DatePickers(props) {
  const { classes } = props;

  return (
      <TextField
        id={props.lebel + 'date'}
        label={props.label}
        type="date"
        style={{width:'150px'}}
        name={props.name}
        value={props.value}
        required
        min={props.min}
        max={props.max}
        margin='normal'
        className={classes.textField}
        onChange={props.handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
  );
}

DatePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

DatePickers =  withStyles(styles)(DatePickers);
class CourseForm extends React.Component {
  constructor(props) {
    super(props);
    const level = this.props.levels[this.props.levels.findIndex((level) => {if (level.id == this.props.course.level_id) return true})]
    if (this.props.course)
      this.state = {
        name: this.props.course.name,
        level: level,
        hours: this.props.course.hours,
        startData: this.props.course.start,
        finishData: this.props.course.finish,
        description: this.props.course.description,
        imageUrl: this.props.course.image_url,
        imageNotFound: this.props.imageNotFound,
      };
    else
      this.state = {
        level: '',
        name: '',
        hours: '',
        startData: this.props.startTerm,
        finishData: this.props.finishTerm,
        description: '',
        imageUrl: '',
        imageNotFound: this.props.imageNotFound,
      }
    this.renderImage = this.renderImage.bind(this)
    this.deleteImage = this.deleteImage.bind(this)
    this.handleChangeImage = this.handleChangeImage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  };
  
  handleChange = e => {
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  }

  renderImage() {
    const { classes} = this.props;
    if (this.state.imageUrl)
      return <img src={this.state.imageUrl } className={classes.imageStyle} style={{height: '300px'}}/>
    else  
     return <img src={this.state.imageNotFound} className={classes.imageStyle} style={{height: '300px'}}/>
  }
  
  handleChangeImage = event => {
    event.preventDefault();
    var file = event.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        this.setState({imageUrl: reader.result, image: file})
    }
  }

  handleSubmit(event) {
    event.preventDefault()
      axios.post(`/levels/`+ this.state.level.id + '/courses', {
        course: {name: this.state.name,
                 start: this.state.startData,
                 finish: this.state.finishData,
                 description: this.state.description,
                 hours: this.state.hours,
                 photo: this.state.imageUrl},
        image: this.state.imageUrl,
        authenticity_token: Functions.getMetaContent("csrf-token")
      })
        .then(res => {
          this.props.addNewCourse(res.data, this.state.level)
          this.props.openCloseForm()
        }
      )
    }

  handleUpdate(event) {
    event.preventDefault()
      axios.put(`/levels/`+ this.state.level.id + '/courses/'+ this.props.course.id, {
        course: {name: this.state.name,
                 start: this.state.startData,
                 finish: this.state.finishData,
                 description: this.state.description,
                 hours: this.state.hours
                },
        image: this.state.imageUrl,
        authenticity_token: Functions.getMetaContent("csrf-token")
      })
        .then(res => {
          this.props.updateCourse(res.data, this.state.level, this.props.level)
          this.props.openCloseForm()
      })
  }

  deleteImage() {
    this.setState({imageUrl: ''})
  }
 
  render() {
    const { classes, theme } = this.props;
    let buttonUnderImage;
    if (this.state.imageUrl && this.state.imageUrl != this.state.imageNotFound)
      buttonUnderImage = <Button variant='outlined' color="secondary" aria-label="DeleteImage" className='Delete' onClick={this.deleteImage}>
                            <CloseIcon color='error'/>
                          </Button>
    else
      buttonUnderImage = <Button variant='contained' component='label' color="default" aria-label="Dowload" className='Dowload'>
                            <input type="file" accept='image/*' onChange={this.handleChangeImage} style={{ display: "none" }}/>
                            Dowload
                        </Button>
    return (
      <div className='CourseForm'>
      <h3>Course form</h3>
      <Paper>
      <form className={classes.container} autoComplete="off" onSubmit={this.props.course ? this.handleUpdate : this.handleSubmit}>
        <FormControl component="fieldset" style={{width:'100%'}} required className={classes.formControl}>
          <div className='form-row' style={{width: '750px'}}>
            <div className='col-md-6'>
              {this.renderImage()}
              <div className='form-group ImageButtons'>
                {buttonUnderImage}
              </div>
            </div>
            <div className='form-group col-md-6 FirstGroup'>   
                <TextField
                  autoFocus
                  id="outlined-group-name-input"
                  className={classes.textField}
                  value={this.state.name}
                  name="name"
                  required
                  label='Name'
                  margin="normal"
                  onChange={this.handleChange}/>
                <FormControl required className={classes.textField}>
                  <InputLabel htmlFor="level-select">Level</InputLabel>
                  <Select
                    className=''
                    value={this.state.level}
                    onChange={this.handleChange}
                    color='primary'
                    required
                    placeholder='All'
                    inputProps={{
                      name: 'level',
                      id: 'level-select',
                    }}>
                    {this.props.levels.map(level => (
                      <MenuItem key={-level.id} value={level}>{level.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </div>
          </div>
          <div className='form-row Shedule'>
          <div className='col-md-4'>
            <DatePickers handleChange={this.handleChange}
                         value={this.state.startData}
                         name='startData'
                         label='Course start' 
                         min={this.props.startTerm}
                         max={this.props.finishTerm}/>
          </div>
          <div className='col-md-4'>
            <DatePickers handleChange={this.handleChange}
                         value={this.state.finishData}
                         name='finishData'
                         label = 'Course finish'
                         min={this.props.startTerm}
                         max={this.props.finishTerm}/>
          </div>
          <div className='col-md-4'>
            <TextField
                id="outlined-number"
                label="Hours"
                style={{width: '100px'}}
                value={this.state.hours}
                onChange={this.handleChange}
                type="number"
                name='hours'
                required
                className={classes.textField + " NumberField"}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
          </div>
         </div>
            <TextField
              id="outlined-desc"
              label="Description"
              placeholder="Short description (maximum 200 symbols)"
              multiline
              value={this.state.description}
              style={{width:'85%', marginTop: '5%', marginBottom: '5%'}}
              required
              rows='4'
              rowsMax='5'
              name="description"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              onChange={this.handleChange}
            />
          <Button color="primary" aria-label="Save" type='submit'>
            Save
          </Button>
          <Button color="primary" aria-label="Cancel" onClick={this.props.openCloseForm}>
            Cancel
          </Button>
      </FormControl>
    </form>
    </Paper>
  </div>
    );
  }
}
  
  
  CourseForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CourseForm);
