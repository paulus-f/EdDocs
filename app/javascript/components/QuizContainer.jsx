import React from 'react';
import Chip from '@material-ui/core/Chip';
import { withRouter, Link } from 'react-router-dom';

class QuizContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      quizzes: props.quizzes,
    };
  }

  render() {
    const { quizzes } = this.state;

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
      </div>
    );
  }
}

export default withRouter(QuizContainer);