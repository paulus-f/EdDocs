import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Functions from '../../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import Snackbar from '@material-ui/core/Snackbar';

var foundationTypes = ['school', 'college', 'university', 'kindergarten'] // then remove, when will models

class EnrollChild extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      child: '', 
      parent: this.props.parent,
      foundationType: '',
      foundationName: '',
      foundationLvl: '',
      foundationGroup: '',
      levels: [],
      schools: [],
      universities: [],
      colleges: [],
      kindergartens: [],
      children: this.props.children,
      open: false,
      message: ''
    }
    this.handleClick = this.handleClick.bind(this) 
    this.handleChange = this.handleChange.bind(this) 
    this.getLevels = this.getLevels.bind(this) 
  }


  componentDidMount(){
    axios.get('/list_foundations')
      .then( res => {
          this.setState({
            schools: this.state.schools.concat(res.data.schools),
            universities: this.state.universities.concat(res.data.universities),
            colleges: this.state.colleges.concat(res.data.colleges),
            kindergartens: this.state.kindergartens.concat(res.data.kindergartens),
        })
        console.log(res.data)
      })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if(name == 'foundationName'){
      this.getLevels(event.target.value.id)
    }
  }
  

  getLevels = (foundationId) => {
    axios.get('/get_levels', {
      params:{
        id: foundationId
      }
    })
    .then( res => {
        this.setState({
          levels: res.data.levels
      })
      console.log(res.data)
    })
  }

  handleClose = (event) => {
    this.setState({
      open: false
    })
  }


  handleClick = (event) => {
    event.preventDefault()
    axios.post('/enroll_child', {
      parent_id: this.state.parent.id,
      foundation_id: this.state.foundationName.id,
      student_id: this.state.child.id,
      level_id: this.state.foundationLvl.id,
      group_id: this.state.foundationGroup.id,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then( res => {
      this.setState({
        open: true,
        message: 'Request sent succesfully! Wait answer to your email soon.'
      }
      )})
  }

  
  render() {
    const {schools, universities, colleges, kindergartens, levels, foundationLvl, children} = this.state
    var fndts = [];
    let groups
    foundationLvl ? groups = foundationLvl.groups : groups = [];
    switch(this.state.foundationType)
    {
      case 'school':
        fndts = schools;
        break;
      case 'college': 
        fndts = colleges;
        break;
      case 'university': 
        fndts = universities;
        break; 
      case 'kindergarten': 
        fndts = kindergartens;
        break; 
    }
    return (
      <div style={{marginTop: 15}}>
      <form onSubmit={this.handleClick}>
        <FormControl component="fieldset" >
        <TextField
            select
            label="Select"
            value={this.state.child}
            onChange={this.handleChange('child')}
            helperText="Please select your child"
            margin="normal"
            required
            variant="outlined"
          >
            {children.map(option => (
              <MenuItem key={option.id} value={option}>
                {option.email}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select"
            value={this.state.foundationType}
            onChange={this.handleChange('foundationType')}
            helperText="Please select your type of foundation"
            margin="normal"
            required
            variant="outlined"
          >
            {foundationTypes.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select"
            value={this.state.foundationName}
            onChange={this.handleChange('foundationName')}
            helperText="Please select your name of foundation"
            margin="normal"
            required
            variant="outlined"
          >
            {fndts.map(option => (
              <MenuItem key={option.id} value={option}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select"
            value={this.state.foundationLvl}
            onChange={this.handleChange('foundationLvl')}
            helperText="Please select your level of foundation"
            margin="normal"
            required
            variant="outlined"
          >
            {levels.map(option => (
              <MenuItem key={option.id} value={option}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select"
            disabled={!foundationLvl}
            value={this.state.foundationGroup}
            onChange={this.handleChange('foundationGroup')}
            helperText="Please select group of level"
            margin="normal"
            required
            variant="outlined"
          >
            {groups.map(option => (
              <MenuItem key={option.id} value={option}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={this.handleClose}
          open={this.state.open}
          autoHideDuration={3000}
          message={<span id="message-id">{this.state.message}</span>}
        />
        <Button type='submit' style= {{marginLeft: 20, marginRight: 20}} variant="contained" color="primary">
          Send
        </Button>
      </form>
      </div>
    );
  }
}

export default EnrollChild
