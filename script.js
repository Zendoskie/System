// ===== DOM Elements =====
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const userInfo = document.getElementById('user-info');
const userNameInput = document.getElementById('user-name');
const userYearInput = document.getElementById('user-year');
const startQuizButton = document.getElementById('start-quiz');
const userDetails = document.getElementById('user-details');
const timerElement = document.getElementById('timer');
const quizContainer = document.getElementById('quiz-container');
const resultDetails = document.getElementById('result-details');


// ===== State Variables =====
let currentQuestionIndex = 0;
let score = 0;
let timer;
const timePerQuestion = 15;

// ===== Questions =====
const multipleChoiceQuestions = [
  {
    question: "Which of the following is a programming language?",
    answers: ["HTML", "CSS", "JavaScript", "All of the above"],
    correct: "JavaScript"
  },
  {
    question: "What does CSS stand for?",
    answers: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
    correct: "Cascading Style Sheets"
  },
  {
    question: "Which language is primarily used for web development?",
    answers: ["Python", "Java", "JavaScript", "C++"],
    correct: "JavaScript"
  },
  {
    question: "Which of the following is a back-end programming language?",
    answers: ["HTML", "JavaScript", "PHP", "CSS"],
    correct: "PHP"
  },
  {
    question: "Which of the following is not a programming language?",
    answers: ["Python", "Java", "HTML", "C#"],
    correct: "HTML"
  },
  {
    question: "What is the main purpose of JavaScript?",
    answers: ["To style web pages", "To structure web pages", "To add interactivity to web pages", "To create databases"],
    correct: "To add interactivity to web pages"
  },
  {
    question: "Which of the following is a popular JavaScript framework?",
    answers: ["Django", "Flask", "React", "Ruby on Rails"],
    correct: "React"
  },
  {
    question: "Which programming language is known for its use in data science?",
    answers: ["Java", "C++", "Python", "Swift"],
    correct: "Python"
  },
  {
    question: "What does SQL stand for?",
    answers: ["Structured Query Language", "Stylish Question Language", "Structured Question Language", "Style Query Language"],
    correct: "Structured Query Language"
  },
  {
    question: "Which of the following is a statically typed language?",
    answers: ["JavaScript", "Python", "Java", "Ruby"],
    correct: "Java"
  },
  {
    question: "Which of the following is a popular version control system?",
    answers: ["Git", "SVN", "Mercurial", "All of the above"],
    correct: "All of the above"
  }
];

const trueFalseQuestions = [
  { question: "An operating system manages hardware and software resources.", correct: true },
  { question: "The kernel is the outermost layer of an operating system.", correct: false },
  { question: "Multitasking allows a user to perform only one task at a time.", correct: false },
  { question: "A device driver enables the operating system to communicate with hardware.", correct: true },
  { question: "Linux is an open-source operating system.", correct: true },
  { question: "Virtual memory uses the hard drive to simulate RAM.", correct: true },
  { question: "A file system organizes files and directories on a storage device.", correct: true },
  { question: "The BIOS is loaded before the operating system during boot.", correct: true },
  { question: "A GUI uses only command-line interactions.", correct: false },
  { question: "Windows is an example of a real-time operating system.", correct: false },
  { question: "A process and a thread are the same thing.", correct: false }
];

// ===== Event Listeners =====
startQuizButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', () => {
    // Reset values
    currentQuestionIndex = 0;
    score = 0;
    clearInterval(timer);

    // Hide end-of-quiz elements
    scoreContainer.style.display = 'none';
    resultDetails.style.display = 'none';
    resultDetails.innerHTML = '';
    restartButton.style.display = 'none';

    // Show the initial user input section
    userInfo.style.display = 'block';
    userNameInput.value = '';
    userYearInput.value = '';
    userDetails.innerHTML = '';

    // Hide quiz-related sections
    document.getElementById('quiz-container').style.display = 'none';
    questionElement.innerHTML = '';
    answerButtonsElement.innerHTML = '';
    timerElement.style.display = 'none';
});


// ===== Quiz Flow =====
function startQuiz() {
    const userName = userNameInput.value.trim();
    const userYear = userYearInput.value.trim();

    if (userName && userYear) {
        userDetails.innerHTML = `Name: ${userName}, Year: ${userYear}`;
        userInfo.style.display = 'none';
        scoreContainer.style.display = 'none';
        resultDetails.style.display = 'none';
        restartButton.style.display = 'none';

        currentQuestionIndex = 0;
        score = 0;

        document.getElementById('quiz-container').style.display = 'block';
        questionElement.style.display = 'block';
        answerButtonsElement.style.display = 'flex';

        showQuestion();
    } else {
        alert("Please enter your name and year.");
    }
}


function showQuestion() {
  let question;
  let isTrueFalse = false;

  if (currentQuestionIndex < multipleChoiceQuestions.length) {
    question = multipleChoiceQuestions[currentQuestionIndex];
  } else if (currentQuestionIndex < multipleChoiceQuestions.length + trueFalseQuestions.length) {
    question = trueFalseQuestions[currentQuestionIndex - multipleChoiceQuestions.length];
    isTrueFalse = true;
  } else {
    return showScore();
  }

  questionElement.textContent = question.question;
  answerButtonsElement.innerHTML = '';
  timerElement.textContent = `Time left: ${timePerQuestion} seconds`;

  startTimer(timePerQuestion);

  if (!isTrueFalse) {
    question.answers.forEach(answer => {
      const button = document.createElement('button');
      button.textContent = answer;
      button.classList.add('btn');
      button.setAttribute('tabindex', '0');
      button.addEventListener('click', selectAnswer);
      answerButtonsElement.appendChild(button);
    });
  } else {
    ['True', 'False'].forEach(text => {
      const button = document.createElement('button');
      button.textContent = text;
      button.classList.add('btn');
      button.setAttribute('tabindex', '0');
      button.addEventListener('click', () => selectTrueFalseAnswer(text === 'True'));
      answerButtonsElement.appendChild(button);
    });
  }
}

function selectAnswer(e) {
  clearInterval(timer);

  const selectedButton = e.target;
  const correct = multipleChoiceQuestions[currentQuestionIndex].correct;
  const isCorrect = selectedButton.textContent === correct;

  selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
  if (isCorrect) score += 10;

  disableButtons();
  setTimeout(nextQuestion, 1000);
}

function selectTrueFalseAnswer(answer) {
  clearInterval(timer);

  const index = currentQuestionIndex - multipleChoiceQuestions.length;
  const correctAnswer = trueFalseQuestions[index].correct;

  Array.from(answerButtonsElement.children).forEach(button => {
    const isCorrect = (button.textContent === 'True' && correctAnswer) ||
                      (button.textContent === 'False' && !correctAnswer);

    button.classList.add(isCorrect ? 'correct' : 'incorrect');
    button.disabled = true;
  });

  if (answer === correctAnswer) score += 10;

  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

function startTimer(duration) {
  clearInterval(timer);

  let timeLeft = duration;
  timerElement.style.display = 'block';

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time left: ${timeLeft} seconds`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  disableButtons();
  setTimeout(nextQuestion, 1000);
}

function disableButtons() {
  Array.from(answerButtonsElement.children).forEach(button => {
    button.disabled = true;
  });
}

function showScore() {
    questionElement.style.display = 'none';
    answerButtonsElement.style.display = 'none';
    timerElement.style.display = 'none';
    scoreContainer.style.display = 'block';
    resultDetails.style.display = 'block';
    scoreElement.innerText = `Your score is ${score}/${(multipleChoiceQuestions.length + trueFalseQuestions.length) * 10}`;

    const userName = userNameInput.value.trim();
    const userYear = userYearInput.value.trim();
    let resultHTML = `<h3>Quiz Review for ${userName} (Year: ${userYear})</h3>`;
    resultHTML += "<ul>";

    multipleChoiceQuestions.forEach((q, i) => {
        resultHTML += `<li><strong>Q${i + 1}:</strong> ${q.question}<br>Correct Answer: ${q.correct}</li>`;
    });

    trueFalseQuestions.forEach((q, i) => {
        const index = i + multipleChoiceQuestions.length;
        resultHTML += `<li><strong>Q${index + 1}:</strong> ${q.question}<br>Correct Answer: ${q.correct ? 'True' : 'False'}</li>`;
    });

    resultHTML += "</ul>";
    resultDetails.innerHTML = resultHTML;

    restartButton.style.display = 'inline-block';
}

function restartQuiz() {
  scoreContainer.style.display = 'none';
  userInfo.style.display = 'block';

  userNameInput.value = '';
  userYearInput.value = '';
  userDetails.textContent = '';
}
