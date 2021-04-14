import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import { Button } from "@material-ui/core";
import Functions from '../utils/Functions';
import Chip from '@material-ui/core/Chip';
import { withRouter, Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '160%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

class QuizEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: props.quizzes,
      courses: props.courses,
      quizName: '',
      selectedQuizId: null,
      selectedQuiz: null,
      selectedCourse: null,
      quizQuistions: null,
      quizResults: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateCourse = this.updateCourse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChipClick = this.handleChipClick.bind(this);
  }

  updateCourse = (value) => {
    this.setState({ selectedCourse: value });
  };

  updateName = (value) => {
    this.setState({ quizName: value });
  }

  handleChange = name => event => {
    switch (name) {
      case 'course':
        this.updateCourse(event.target.value)
        break;
      case 'name':
        this.updateName(event.target.value)
        break;
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    axios.post('/quizzes/', {
      name: this.state.quizName,
      course_id: this.state.selectedCourse,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
      .then(res => {
        const { quizzes } = this.state
        this.setState({
          quizzes: [...quizzes, res.data.quiz],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChipClick = id => {
    axios.post(`/quizzes/${id}/quiz_editor_data`, {
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
      .then(res => {
        this.setState({
          selectedQuizId: res.data.quiz.id,
          selectedQuiz: res.data.quiz,
          quizQuistions: res.data.quiz_questions,
          quizResults: res.data.quiz_results,
        });
      })
      .catch(err => {
        this.setState({
          selectedQuizId: null,
          selectedQuiz: null
        });
        console.log(err);
      });
  }

  renderNewQuestion = () => {

  }

  renderQuestions = () => {

  }

  render() {
    const { quizzes, quizName, courses, selectedQuiz, selectedQuizId, quizQuistions, quizResults } = this.state;
    const { classes } = this.props;

    return (
      <div id='managerCalls'>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <FormControl>
            <TextField
              autoFocus
              id="outlined-group-name-input"
              className={classes.textField}
              value={this.state.quizName}
              name="name"
              required
              label='Quiz Name'
              margin="normal"
              onChange={this.handleChange('name')} />
            <TextField
              select
              label="Select"
              className={classes.textField}
              value={this.state.selectedCourse}
              onChange={this.handleChange('course')}
              margin="normal"
              required
              variant="outlined"
            >
              {courses.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" color="primary" aria-label="Add">
              <AddIcon />
            </Button>
          </FormControl>
        </form>
        <br />
        <div>
          {quizzes.map((quiz) => {
            return (
              <Chip key={quiz.id}
                label={quiz.name}
                clickable
                onClick={(e) => this.handleChipClick(quiz.id)}
                color='primary' />
            );
          })}
        </div>
        <br />
        <Grid item xs={12} container justify="center" spacing={24}>
          {selectedQuiz && this.renderNewQuestion()}
          {selectedQuiz && this.renderQuestions()}
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(QuizEditor));