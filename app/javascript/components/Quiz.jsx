import React, { useState, useContext, useEffect } from "react";
import { TestStateContext } from "../context/context";
import axios from 'axios';
import Functions from '../utils/Functions';

const EndScreen = (props) => {
  const { score, setScore, setTestState, userName, questions } = useContext(
    TestStateContext
  );

  const restartQuiz = () => {
    setScore(0);
    setTestState("menu");
  };
  return (
    <div className="EndScreen">
      <h1>Quiz Finished</h1>
      <h3>{userName}</h3>
      <h1>
        {score} / {questions.length}
      </h1>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};


const Menu = (props) => {
  const { testState, setTestState, userName, setUserName, quiz } = useContext(
    TestStateContext
  );
  return (
    <div className="Menu">
      <h2> {quiz.name} </h2>
      <h3>Your: {userName} </h3>
      <button
        onClick={() => {
          setTestState("playing");
        }}
      >
        Start Test
      </button>
    </div>
  );
}

const Test = (props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [optionChosen, setOptionChosen] = useState("");

  const { score, setScore, setTestState, questions, quiz } = useContext(
    TestStateContext
  );

  const chooseOption = (option) => {
    setOptionChosen(option);
  };

  const nextQuestion = () => {
    if (questions[currentQuestion].asnwer == optionChosen) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const finishQuiz = () => {
    if (questions[currentQuestion].asnwer == optionChosen) {
      setScore(score + 1);
    }
    axios.post(`/quizzes/${quiz.id}/save_result`, {
      result: (score + 1 / questions.length) * 100,
      authenticity_token: Functions.getMetaContent("csrf-token")
    }).then(res => console.log(res))
      .catch(err => console.log(err));
    setTestState("finished");
  };

  return (
    <div className="Quiz">
      <h1>{questions[currentQuestion].prompt}</h1>
      <div className="questions">
        <button
          onClick={() => {
            chooseOption("a");
          }}
        >
          {questions[currentQuestion].a}
        </button>
        <button
          onClick={() => {
            chooseOption("b");
          }}
        >
          {questions[currentQuestion].b}
        </button>
        <button
          onClick={() => {
            chooseOption("c");
          }}
        >
          {questions[currentQuestion].c}
        </button>
        <button
          onClick={() => {
            chooseOption("d");
          }}
        >
          {questions[currentQuestion].d}
        </button>
      </div>

      {currentQuestion == questions.length - 1 ? (
        <button onClick={finishQuiz} id="nextQuestion">
          Finish Quiz
        </button>
      ) : (
        <button onClick={nextQuestion} id="nextQuestion">
          Next Question
        </button>
      )}
    </div>
  );
}

const Quiz = (props) => {
  const [testState, setTestState] = useState("menu");
  const [userName, setUserName] = useState(props.currentUser.email);
  const [questions, setQuestions] = useState(props.quizQuestions);
  const [quiz, setQuiz] = useState(props.quiz);

  const [score, setScore] = useState(0);

  return (
    <div className="App">
      <h1>Test</h1>
      <TestStateContext.Provider
        value={{
          testState,
          setTestState,
          userName,
          setUserName,
          score,
          setScore,
          questions,
          quiz
        }}
      >
        {testState === "menu" && <Menu />}
        {testState === "playing" && <Test />}
        {testState === "finished" && <EndScreen />}
      </TestStateContext.Provider>
    </div>
  );
}

export default Quiz;
