import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Level from './LevelsPanel/Level'
import Button from '@material-ui/core/Button';
import Functions from '../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import Select from '@material-ui/core/Select';
import axios from 'axios';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

const ListStyles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

let StudentsList = props => {
  const { classes } = props;
  let level;
  props.LevelEnroll ? level = props.LevelEnroll.groups : level = [];
  return (
    <div>
      <form className={classes.container} autoComplete="off">
        <div className='form-group EnrollSelectForm'>
          <FormControl required className={classes.formControl  + " EnrollSelect"}> 
            <InputLabel htmlFor="level-select">Level</InputLabel>
            <Select
              value={props.LevelEnroll}
              onChange={props.handleChange}
              required
              color='primary'
              inputProps={{
                name: 'LevelEnroll',
                id: 'level-select',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {props.levels.map(level => (
              <MenuItem key={level.id} value={level}>{level.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl required className={classes.formControl + " EnrollSelect"} disabled={!props.LevelEnroll}> 
          <InputLabel htmlFor="group-select">Group</InputLabel>
            <Select
              value={props.GroupEnroll}
              onChange={props.handleChange}
              color='primary'
              inputProps={{
                name: 'GroupEnroll',
                id: 'group-select',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {level.map(group => (
              <MenuItem key={group.id} value={group}>{group.name}</MenuItem>
              ))}
            </Select>
            </FormControl>
          <FormControl className={classes.formControl  + " EnrollButton"}> 
            <Button onClick={props.Enroll} color='primary' variant='contained' aria-label="Enroll" disabled={props.checked.length == 0}>
              Enroll
          </Button>
          </FormControl>
         </div>
      </form>
    <Paper style={{maxHeight: 550, overflow: 'auto'}}>
      <List dense className={classes.root}>
       <ListItem key='selectAll' button onClick={props.onSelectAllClick}>
        <h6>Students without group</h6>
         <ListItemSecondaryAction>
           <Checkbox
             onChange={props.onSelectAllClick}
             checked={props.checked.length === props.students.length}
           />
         </ListItemSecondaryAction>
       </ListItem>
      {props.students.map(student => ( 
        <ListItem key={student.id} button onClick={props.handleToggle(student.id)}>
          <ListItemAvatar>
          <Avatar>
            <PersonIcon/>
          </Avatar>
          </ListItemAvatar>
          <ListItemText primary={student.profile.last_name + ' ' + student.profile.first_name}/>
          <ListItemSecondaryAction>
            <Checkbox
              onChange={props.handleToggle(student.id)}
              checked={props.checked.indexOf(student.id) !== -1}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Paper>
  </div>
  );
};

StudentsList.propTypes = {
  classes: PropTypes.object.isRequired,
};

StudentsList = withStyles(ListStyles)(StudentsList);

class LevelsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundation: this.props.foundation,
      levels: this.props.levels,
      studentsWithoutGroup: this.props.studentsWithoutGroup,
      newlevel: false,
      newlevelname: '',
      commonlevelname: '',
      commongroupname: '',
      levelsnumber: 0,
      groupsnumber: 0,
      checked: [],
      LevelEnroll: "",
      GroupEnroll: "",
    };
    this.InsertNewGroup = this.InsertNewGroup.bind(this)
    this.InsertNewLevel = this.InsertNewLevel.bind(this)
    this.OpenLevelForm = this.OpenLevelForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderFormLevel = this.renderFormLevel.bind(this)
    this.DeleteLevel = this.DeleteLevel.bind(this)
    this.GenerateByTemplate = this.GenerateByTemplate.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.Enroll = this.Enroll.bind(this)
    this.onSelectAllClick = this.onSelectAllClick.bind(this)
    this.ReloadStudentsWithoutGroup = this.ReloadStudentsWithoutGroup.bind(this)
    this.AddToStudentsList = this.AddToStudentsList.bind(this)
  }

  Enroll() {
    if (this.state.LevelEnroll && this.state.GroupEnroll && this.state.checked != []) {
      let levels = this.state.levels
      let level = this.state.LevelEnroll
      const indexLevel = levels.indexOf(level)
      let group = this.state.GroupEnroll
      const indexGroup = level.groups.indexOf(group)
      axios.post( '/levels/' + this.state.LevelEnroll.id + '/groups/' + this.state.GroupEnroll.id + '/students/enroll', {
        students: this.state.checked, 
        authenticity_token: Functions.getMetaContent("csrf-token")
      }).then( res => {
        group.students = res.data.enrollStudents
        level.groups.splice(indexGroup, 1, group)
        levels.splice(indexLevel, 1, level)
        this.setState({levels: levels})
        this.setState({checked: [],
                      studentsWithoutGroup: res.data.studentsWithoutGroup})
        this.props.SetTypeAlert('success')
        this.props.SetMessageAlert('The students has been enroll successfully!')
        this.props.OpenCloseAlert()
      })
      }
    else {
      this.props.SetTypeAlert('warning')
      this.props.SetMessageAlert('Choose Level and Group please')
      this.props.OpenCloseAlert()
    }
  }
  onSelectAllClick() {
    if (this.state.checked.length == this.state.studentsWithoutGroup.length)
      this.setState({checked: []})
    else {
      const checked = this.state.studentsWithoutGroup.map(student => ( student.id ))
      this.setState({checked: checked})
    }
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  EnrollSelect = e => {
    const name = e.target.name;
    if (name == 'LevelEnroll')
    {
      this.setState({LevelEnroll: e.target.value,
                     GroupEnroll: ""})
    }
    else
    this.setState({GroupEnroll: e.target.value})
  }

  handleChange = e => {
    const name = e.target.name;
    let value = e.target.value;
    if ((name == 'groupsnumber' || name == 'levelsnumber') && (value < 0 || value > 20))
      value = 0;
    this.setState({ [name]: value })
  }

  InsertNewLevel(level) {
    const levels = this.state.levels
    levels.push(level);
    this.setState({levels: levels})
  }


  handleSubmit = event => {
    event.preventDefault();
    axios.post('/levels', {
        name: this.state.newlevelname,
        foundation_id: this.state.foundation.id,
        authenticity_token: Functions.getMetaContent("csrf-token")
      }).then(res => {
      if(res.data)
       this.InsertNewLevel(res.data)
    })
  }

  OpenLevelForm() {
    this.setState({newlevel: !this.state.newlevel})
  }

  GenerateByTemplate = event => {
    event.preventDefault();
    axios.post('/levels/generate_by_template', {
        level_name: this.state.commonlevelname,
        group_name: this.state.commongroupname,
        levels_number: this.state.levelsnumber,
        groups_number: this.state.groupsnumber,
        foundation_id: this.state.foundation.id,
        authenticity_token: Functions.getMetaContent("csrf-token")
      }).then(res => {
       this.setState({levels: res.data.levels,
                      commonlevelname: '',
                      commongroupname: '',
                      levelsnumber: 0,
                      groupsnumber: 0})
       this.props.SetMessageAlert("Levels and groups generated successfully!")
       this.props.SetTypeAlert('success')
       this.props.OpenCloseAlert()
    })
  }

  renderFormLevel() {
    const { classes } = this.props;
    if (this.state.newlevel) 
      return (
      <div className='form-row NewGroupForm'>
      <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
        <FormControl className={classes.formControl}> 
          <TextField
            autoFocus
            id="outlined-group-name-input"
            label="Name of level"
            className={classes.textField}
            value={this.state.newlevelname}
            name="newlevelname"
            required
            margin="dense"
            variant="outlined"
            onChange={this.handleChange}/>
          <Button  type="submit" color="primary" aria-label="Add">
            Add
          </Button>
          <Button color="primary" aria-label="cancel" onClick={this.OpenLevelForm}>
            Cancel
          </Button> 
        </FormControl>
      </form>
      </div>  
      ) 
    else
      return(
      <div className='NewGroupForm'>
      {<Button size="medium" color="primary" className={classes.margin} onClick={this.OpenLevelForm}>
        Add level
     </Button>}
     </div>
      )
  }

  renderTemplateForm() {
    const { classes } = this.props;
    return(
      <form className={classes.container} autoComplete="off" onSubmit={this.GenerateByTemplate}>
        <div className='TemplateForm form-row'>
          <h5>Generate levels and groups by template</h5>
          <FormControl className={classes.formControl}> 
            <div className='TemplateGroup'>
              <TextField
                id="outlined-level-name-input"
                label="Common level name"
                className={classes.textField}
                value={this.state.commonlevelname}
                name="commonlevelname"
                required
                margin="normal"
                variant="outlined"
                onChange={this.handleChange}/>
              <TextField
                id="outlined-number"
                label="Number of levels"
                value={this.state.levelsnumber}
                onChange={this.handleChange}
                type="number"
                name="levelsnumber"
                className={classes.textField + " NumberField"}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"/>
            </div>
            <div className='TemplateGroup'>
               <TextField
                id="outlined-group-name-input"
                label="Common group name"
                className={classes.textField}
                value={this.state.commongroupname}
                name="commongroupname"
                required
                margin="normal"
                variant="outlined"
                onChange={this.handleChange}/>
              <TextField
                id="outlined-number"
                label="Number of groups"
                value={this.state.groupsnumber}
                onChange={this.handleChange}
                type="number"
                name='groupsnumber'
                className={classes.textField + " NumberField"}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
              />
            </div>
            <Button  type="submit" color="primary" aria-label="Add">
              Generate
            </Button>
          </FormControl>
        </div> 
      </form>
      )
  }

  InsertNewGroup(level, group) {
    const newlevel = level;
    newlevel.groups.push(group);
    const index = this.state.levels.indexOf(level);
    const levels = this.state.levels;
    levels.splice(index, 1, newlevel);
    this.setState({levels: levels});
  }

  ReloadStudentsWithoutGroup(students) {
    this.setState({studentsWithoutGroup: students})
  }

  AddToStudentsList(student) {
    const studentsWithoutGroup= this.state.studentsWithoutGroup;
    studentsWithoutGroup.push(student)
    this.setState({studentsWithoutGroup: studentsWithoutGroup})
  }

  DeleteLevel(level){
    axios.delete('/levels/' + level.id, {
      data: 
      {
        authenticity_token: Functions.getMetaContent("csrf-token")
      }
    }).then(res => {
    this.ReloadStudentsWithoutGroup(res.data)
    const levels = this.state.levels
    const index = levels.indexOf(level)
    levels.splice(index, 1)
    this.setState({levels: levels})
  })
  }

  render() {
    let students;
    this.state.studentsWithoutGroup ? ( students = this.state.studentsWithoutGroup) : (students = [])
    return(
      <div className='form-row col md-10' style={{marginRight: 0}}>
        <Paper className='LevelsPanel col'>
          <div className="Levels">
            {this.state.levels.map(level => (
              <Level key={level.id} level={level} 
                     InsertNewGroup={this.InsertNewGroup}
                     ReloadStudentsWithoutGroup={this.ReloadStudentsWithoutGroup}
                     AddToStudentsList={this.AddToStudentsList}
                     OpenCloseAlert={this.props.OpenCloseAlert}
                     SetMessageAlert={this.props.SetMessageAlert}
                     SetTypeAlert={this.props.SetTypeAlert}
                     DeleteLevel={this.DeleteLevel}/>
            ))}
            {this.renderFormLevel()}
          </div>  
        </Paper>
        <div className='col RightPanel'>
          {this.renderTemplateForm()}
          <div className='StudentsWithoutGroupsList'>
              <StudentsList checked={this.state.checked} 
                            handleToggle={this.handleToggle}
                            students={students}
                            levels={this.state.levels}
                            LevelEnroll={this.state.LevelEnroll}
                            GroupEnroll={this.state.GroupEnroll}
                            onSelectAllClick={this.onSelectAllClick}
                            handleChange = {this.EnrollSelect}
                            Enroll={this.Enroll}/>
          </div>
        </div>
      </div>)
  }
}

LevelsPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LevelsPanel);