import React, { useState, useContext, useEffect } from "react";
import { TestStateContext } from "../context/context";
const Questions = [
  {
    prompt: "What is my name?",
    optionA: "John",
    optionB: "Jake",
    optionC: "Josh",
    optionD: "Pedro",
    asnwer: "optionD",
  },
  {
    prompt: "Which of this is not a programming language?",
    optionA: "Python",
    optionB: "JavaScript",
    optionC: "MC-03",
    optionD: "Java",
    asnwer: "optionC",
  },
  {
    prompt: "Which of this is not a javascript framework?",
    optionA: "React",
    optionB: "Angular",
    optionC: "Vue",
    optionD: "Java",
    asnwer: "optionD",
  },
];

const EndScreen = (props) => {
  const { score, setScore, setTestState, userName } = useContext(
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
        {score} / {Questions.length}
      </h1>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};


const Menu = (props) => {
  const { testState, setTestState, userName, setUserName } = useContext(
    TestStateContext
  );
  return (
    <div className="Menu">
      <label>Enter Your Name:</label>
      <input
        type="text"
        placeholder="Ex. John Smith"
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
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

  const { score, setScore, testState, setTestState } = useContext(
    TestStateContext
  );

  const chooseOption = (option) => {
    setOptionChosen(option);
  };

  const nextQuestion = () => {
    if (Questions[currentQuestion].asnwer == optionChosen) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  const finishQuiz = () => {
    if (Questions[currentQuestion].asnwer == optionChosen) {
      setScore(score + 1);
    }
    setTestState("finished");
  };

  return (
    <div className="Quiz">
      <h1>{Questions[currentQuestion].prompt}</h1>
      <div className="questions">
        <button
          onClick={() => {
            chooseOption("optionA");
          }}
        >
          {Questions[currentQuestion].optionA}
        </button>
        <button
          onClick={() => {
            chooseOption("optionB");
          }}
        >
          {Questions[currentQuestion].optionB}
        </button>
        <button
          onClick={() => {
            chooseOption("optionC");
          }}
        >
          {Questions[currentQuestion].optionC}
        </button>
        <button
          onClick={() => {
            chooseOption("optionD");
          }}
        >
          {Questions[currentQuestion].optionD}
        </button>
      </div>

      {currentQuestion == Questions.length - 1 ? (
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
  const [userName, setUserName] = useState("");
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
