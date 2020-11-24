import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Functions from '../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import FormLabel from '@material-ui/core/FormLabel';
import CourseForm from './CoursesPanel/CourseForm';
import Course from './CoursesPanel/Course';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Pagination from "material-ui-flat-pagination";
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  root: {
    width: '100%',
  },
  fab: {
    margin: theme.spacing.unit,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class CoursesPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundation: this.props.foundation,
      levels: this.props.levels,
      form: false,
      level: 'all',
      course: '',
      levelupdate: '',
      courses: this.props.courses,
      pagecourses: this.props.courses,
      offset: 0,
      total: this.props.courses.length,
      selectOnly: 'all'
    };
    this.openCloseForm = this.openCloseForm.bind(this)
    this.renderCourseForm = this.renderCourseForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.deleteCourse = this.deleteCourse.bind(this)
    this.addNewCourse = this.addNewCourse.bind(this)
    this.updateCourse = this.updateCourse.bind(this)
    this.renderCourseFormForUpdate = this.renderCourseFormForUpdate.bind(this)
  }

  handleClick(offset) {
    this.setState({ offset});
  }
 

  openCloseForm() {
    this.setState({form: !this.state.form, course: '', levelupdate:''})
  }

  addNewCourse(course, level) {
    const fakeEvent = {target: {name: 'selectOnly', value: this.state.selectOnly}}
    const courses = this.state.courses
    const levels = this.state.levels
    const index = levels.indexOf(level)
    level.courses.push(course)
    levels.splice(index, 1, level)
    courses.push(course)
    this.setState({levels: levels, courses: courses})
    this.props.newCourse(course)
    this.handleChange(fakeEvent)
    this.props.SetMessageAlert('New course successfully created!')
    this.props.SetTypeAlert('success')
    this.props.OpenCloseAlert()
  }

  updateCourse(course, level, oldLevelName) {
    const fakeEvent = {target: {name: 'selectOnly', value: this.state.selectOnly}}
    const oldLevelIndex = this.state.levels.findIndex((level) => {if (level.name == oldLevelName) return true})
    const oldLevel = this.state.levels[oldLevelIndex]
    const courses = this.state.courses
    const levels = this.state.levels
    const indexLevel = levels.findIndex((level) => {if (level.id == course.level_id) return true})
    const indexCourse = courses.findIndex((Course) => {if (Course.id == course.id) return true})
    const indexLevelCourse = level.courses.findIndex((Course) => {if (Course.id == course.id) return true})
    if (level.id != oldLevel.id) {
      const indexOldLevelCourse = oldLevel.courses.findIndex((Course) => {if (Course.id == course.id) return true})
      oldLevel.courses.splice(indexOldLevelCourse, 1)
      levels.splice(oldLevelIndex, 1, oldLevel)
    }
    level.courses.splice(indexLevelCourse, 1, course)
    levels.splice(indexLevel, 1, level)
    courses.splice(indexCourse, 1, course)
    this.setState({courses: courses, levels: levels})
    this.setState({course: '', form: true})
    this.props.updateCourse(course)
    this.handleChange(fakeEvent)
    this.props.SetMessageAlert('Course successfully updated!')
    this.props.SetTypeAlert('success')
    this.props.OpenCloseAlert()
  }

  deleteCourse(course) {
    axios.delete('/levels/'+ course.level_id + '/courses/' + course.id, {
      data: 
      {
        authenticity_token: Functions.getMetaContent("csrf-token")
      }}).then( res => {
        const fakeEvent = {target: {name: 'selectOnly', value: this.state.selectOnly}}
        const courses = this.state.courses
        const levels = this.state.levels
        const indexLevel = levels.findIndex((level) => {if (level.id == course.level_id) return true})
        const level = levels[indexLevel]
        const indexCourse = courses.findIndex((Course) => {if (Course.id == course.id) return true})
        const indexLevelCourse = level.courses.findIndex((Course) => {if (Course.id == course.id) return true})
        level.courses.splice(indexLevelCourse, 1)
        levels.splice(indexLevel, 1, level)
        courses.splice(indexCourse, 1)
        this.setState({courses: courses, levels: levels})
        this.props.deleteCourse(course)
        this.handleChange(fakeEvent)
        this.props.SetTypeAlert('success')
        this.props.SetMessageAlert('Deleted successfully!')
        this.props.OpenCloseAlert()
        })
  }

  renderCourseForm() {
    if (this.state.form)
      return (
        <CourseForm startTerm={this.state.foundation.begin_academic_year}
                    finishTerm={this.state.foundation.end_academic_year}
                    imageNotFound={this.props.imageNotFound}
                    openCloseForm={this.openCloseForm}
                    addNewCourse={this.addNewCourse}
                    updateCourse={this.updateCourse}
                    levels={this.state.levels}
                    foundation={this.props.foundation}                             
                    course={this.state.course}
                    level={this.state.levelupdate}/>)
  }

  renderCourseFormForUpdate(course, level){
    this.setState({course: course, form: true, levelupdate: level})
  }

  handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    let filter
    this.setState({[name]: e.target.value, offset: 0})
    let pagecourses
    if (name == 'level') {
      value == 'all' ? pagecourses = this.state.courses : pagecourses = value.courses
    }
    else if (this.state.level != 'all'){
      pagecourses = this.state.level.courses
    }
    else {
      pagecourses = this.state.courses
    }
    name == 'selectOnly' ? filter = value : filter = this.state.selectOnly
    this.filterCourses(filter, pagecourses)
  }

  filterCourses(value, pagecourses) {
    const keys = pagecourses.map(course => (course.id))
    let courses = this.state.courses.filter(course => {if (keys.indexOf(course.id) != -1) return true})
    const now = new Date()
    switch(value) {
      case 'pending':
        courses = courses.filter(course => 
          {
            const start = new Date(course.start)
            if (now <  start)
              return true
          })
        break
      case 'inprogress':
        courses = courses.filter(course => 
          {
            const start = new Date(course.start)
            const finish = new Date(course.finish)
            if (now >=  start && now < finish)
              return true
         })
         break
      case 'finished':
        courses = courses.filter(course => 
          {
            const finish = new Date(course.finish)
            if (now > finish)
              return true
          })
    }
    this.setState({pagecourses: courses, offset: 0, total: courses.length})
  }

  render() {
    const { classes, student } = this.props;
    if (this.state.form && !student)
      return(
        this.renderCourseForm())
    else
    return(
      <Paper className='CoursesPanel md-10 col'>
        <div className='courses-header form-row'>
            <div className='col Course-title'>
              <h3>Courses</h3>
            </div>
            { !student &&
                <div className='col AddButton'>
                  <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.openCloseForm}>
                    <AddIcon />
                  </Fab>
                </div>
            }
            {
              !student &&
                <div className='col'>
                  <FormControl className={classes.formControl}> 
                    <InputLabel htmlFor="level-select">Level</InputLabel>
                    <Select
                      className='Levels-select'
                      value={this.state.level}
                      onChange={this.handleChange}
                      color='primary'
                      placeholder='All'
                      inputProps={{
                        name: 'level',
                        id: 'level-select',
                      }}
                    >
                      <MenuItem value="all">
                        All
                      </MenuItem>
                      {this.state.levels.map(level => (
                        <MenuItem key={-level.id} value={level}>{level.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
            }
          <div className='col-md-4 FilterSet'>
          <FormControl component="fieldset">
            <FormLabel component="h4">Select</FormLabel>
              <RadioGroup
                aria-label="select only"
                name="selectOnly"
                value={this.state.selectOnly}
                onChange={this.handleChange}
                row
              >
                <FormControlLabel
                  value="all"
                  control={<Radio color="primary" />}
                  label="All"
                  labelPlacement="end"
                />
                 <FormControlLabel
                  value="pending"
                  control={<Radio color="primary" />}
                  label="Pending"
                  labelPlacement="end"
                />
                 <FormControlLabel
                  value="inprogress"
                  control={<Radio color="primary" />}
                  label="In progress"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="finished"
                  control={<Radio color="primary" />}
                  label="Finished"
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='col Pagination'>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              <Pagination
                limit={12}
                offset={this.state.offset}
                total={this.state.total}
                onClick={(e, offset) => this.handleClick(offset)}
              />
            </MuiThemeProvider>
          </div>
        </div>
        <Divider variant='middle'/>
        <div className="Levels-courses card-deck">
          {
            this.state.pagecourses.slice(this.state.offset, this.state.offset + 12).map(course =>  
              <Course renderCourseFormForUpdate={this.renderCourseFormForUpdate}
                      level={this.state.levels.find((level) => { return level.id == course.level_id}).name}
                      deleteCourse={this.deleteCourse}
                      key={course.id}
                      course={course}
                      student={student}
              />)
          }
        </div>
      </Paper>)
  }
}
CoursesPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CoursesPanel);