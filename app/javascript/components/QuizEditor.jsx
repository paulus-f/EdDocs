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
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '80%'
  },
  textField: {
    width: '160%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  card: {
    minWidth: 275,
  },
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
      selectedCourse: '',
      quizQuestions: null,
      quizResults: null,
      quizNewQuestion: {
        prompt: '',
        a: '',
        b: '',
        c: '',
        d: '',
        asnwer: ''
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateCourse = this.updateCourse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChipClick = this.handleChipClick.bind(this);
    this.handleQuizSubmit = this.handleQuizSubmit.bind(this);
    this.handleQuizChange = this.handleQuizChange.bind(this);
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
          quizQuestions: res.data.quiz_questions,
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

  handleQuizSubmit = event => {
    event.preventDefault();
    const { quizNewQuestion, selectedQuizId } = this.state;

    axios.post(`/quizzes/${selectedQuizId}/add_question`, {
      quizNewQuestion,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
      .then(res => {
        this.setState((prevState, props) => {
          return { quizQuestions: [...prevState.quizQuestions, res.data.quiz_question] }
        })
        console.log(res)
      })
  }

  handleQuizChange = name => event => {
    const { quizNewQuestion } = this.state;
    quizNewQuestion[name] = event.target.value;
    this.setState({
      quizNewQuestion: quizNewQuestion,
    });
  }

  renderNewQuestion = () => {
    const { quizNewQuestion, } = this.state;
    const { classes } = this.props;

    return <Grid container>
      <form autoComplete="off" onSubmit={this.handleQuizSubmit} >
        <FormControl component="fieldset" className={classes.formControl}>
          <TextField
            id="outlined-foundation-name"
            label="Prompt"
            required
            fullWidth
            name="prompt"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            value={quizNewQuestion.prompt}
            onChange={this.handleQuizChange('prompt')}
          />
          <TextField
            id="outlined-foundation-address"
            label="Option A"
            required
            value={quizNewQuestion.a}
            name="A"
            className={classes.textField}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={this.handleQuizChange('a')}
          />
          <TextField
            id="outlined-foundation-address"
            label="Option B"
            required
            value={quizNewQuestion.b}
            name="B"
            className={classes.textField}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={this.handleQuizChange('b')}
          />
          <TextField
            id="outlined-foundation-address"
            label="Option C"
            required
            value={quizNewQuestion.c}
            name="C"
            className={classes.textField}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={this.handleQuizChange('c')}
          />
          <TextField
            id="outlined-foundation-address"
            label="Option D"
            required
            value={quizNewQuestion.d}
            name="D"
            className={classes.textField}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={this.handleQuizChange('d')}
          />
          <TextField
            id="outlined-foundation-address"
            label="Answer"
            required
            value={quizNewQuestion.asnwer}
            name="Asnwer"
            className={classes.textField}
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={this.handleQuizChange('asnwer')}
          />
          <Button type={"submit"} color="primary" aria-label="Add">
            Add <AddIcon />
          </Button>
        </FormControl>
      </form>
    </Grid>
  }

  renderQuestions = () => {
    const { classes } = this.props;
    const { quizQuestions } = this.state;

    return quizQuestions.map((question) => {
      return <Grid key={question.id} xs item>
        <Card className={classes.card}>
          <CardContent>
            <Typography component="h2">
              Prompt: {question.prompt}
            </Typography>
            <Typography variant='h6' component="h4">
              A: {question.a}
            </Typography>
            <Typography variant='h6' component="h4">
              B: {question.b}
            </Typography>
            <Typography variant='h6' component="h4">
              C: {question.c}
            </Typography>
            <Typography variant='h6' component="h4">
              D: {question.d}
            </Typography>
            <Typography component="h3">
              Answer: {question.asnwer}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    });
  }

  render() {
    const { quizzes, quizName, courses, selectedQuiz, selectedQuizId, quizQuestions, quizResults } = this.state;
    const { classes } = this.props;

    return (
      <div id='quizEditor' className={classes.container}>
        <div className={classes.container} >
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
        </div>
        <Grid container spacing={3}>
          {quizzes.map((quiz) => {
            return (
              <Grid key={quiz.id} xs item>
                <Chip label={quiz.name}
                  clickable
                  onClick={(e) => this.handleChipClick(quiz.id)}
                  color='primary' />
              </Grid>
            );
          })}
        </Grid>
        <Grid container spacing={3}>
          {selectedQuiz && this.renderNewQuestion()}
          {selectedQuiz && this.renderQuestions()}
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(QuizEditor));