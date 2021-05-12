import React from 'react';
import Chip from '@material-ui/core/Chip';
import { withRouter, Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    minWidth: 275,
  },
});

class QuizContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      quizzes: props.quizzes || [],
      quizResults: props.quizResults || []
    };

    this.renderResults = this.renderResults.bind(this);
  }

  renderResults = () => {
    const { classes } = this.props;
    const { quizResults } = this.state;

    return quizResults.map((result) => {
      return <Grid key={result.id} xs item>
        <Card className={classes.card}>
          <CardContent>
            <Typography component="h2">
              User: {result.user.email}
            </Typography>
            <Typography variant='h6' component="h3">
              Result: {result.result}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    });
  }

  render() {
    const { quizzes } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <h1> Your quizzes </h1>
        <br />
        {quizzes.map((quiz) => {
          return (
            <Link target={"_blank"}
              to={`/quizzes/${quiz.id}`}
              activeClassName='active'>
              <Chip key={quiz.id}
                label={quiz.name}
                clickable
                color='primary' />
            </Link>
          );
        })}

        <Grid container spacing={3}>
          {this.renderResults()}
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(QuizContainer));