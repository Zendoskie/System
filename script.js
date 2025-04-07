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

let currentQuestionIndex = 0;
let score = 0;
let timer;
const timePerQuestion = 15;

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
    {
        question: "An operating system manages hardware and software resources.",
        correct: true
    },
    {
        question: "The kernel is the outermost layer of an operating system.",
        correct: false
    },
    {
        question: "Multitasking allows a user to perform only one task at a time.",
        correct: false
    },
    {
        question: "A device driver enables the operating system to communicate with hardware.",
        correct: true
    },
    {
        question: "Linux is an open-source operating system.",
        correct: true
    },
    {
        question: "Virtual memory uses the hard drive to simulate RAM.",
        correct: true
    },
    {
        question: "A file system organizes files and directories on a storage device.",
        correct: true
    },
    {
        question: "The BIOS is loaded before the operating system during boot.",
        correct: true
    },
    {
        question: "A GUI uses only command-line interactions.",
        correct: false
    },
    {
        question: "Windows is an example of a real-time operating system.",
        correct: false
    },
    {
        question: "A process and a thread are the same thing.",
        correct: false
    }
];

startQuizButton.addEventListener('click', startGame);

function startGame() {
    const userName = userNameInput.value.trim();
    const userYear = userYearInput.value.trim();

    if (userName && userYear) {
        userDetails.innerHTML = `Name: ${userName}, Year: ${userYear}`;
        userInfo.style.display = 'none';
        currentQuestionIndex = 0;
        score = 0;
        scoreContainer.style.display = 'none';
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
        showScore();
        return;
    }

    questionElement.innerHTML = question.question;
    answerButtonsElement.innerHTML = '';
    timerElement.innerHTML = `Time left: ${timePerQuestion} seconds`;

    startTimer(timePerQuestion);

    if (!isTrueFalse) {
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = answer;
            button.classList.add('btn');
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    } else {
        const trueButton = document.createElement('button');
        trueButton.innerHTML = "True";
        trueButton.classList.add('btn');
        trueButton.addEventListener('click', () => selectTrueFalseAnswer(true));
        answerButtonsElement.appendChild(trueButton);

        const falseButton = document.createElement('button');
        falseButton.innerHTML = "False";
        falseButton.classList.add('btn');
        falseButton.addEventListener('click', () => selectTrueFalseAnswer(false));
        answerButtonsElement.appendChild(falseButton);
    }
}

function startTimer(duration) {
    clearInterval(timer);
    let timeLeft = duration;
    timerElement.style.display = 'block';

    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `Time left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < multipleChoiceQuestions.length + trueFalseQuestions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }, 1000);
}

function selectAnswer(e) {
    clearInterval(timer);
    const selectedButton = e.target;
    const correct = multipleChoiceQuestions[currentQuestionIndex].correct;
    const isCorrect = selectedButton.innerHTML === correct;

    if (isCorrect) {
        score += 10;
        selectedButton.classList.add('correct');
    } else {
        selectedButton.classList.add('incorrect');
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1000);
}

function selectTrueFalseAnswer(answer) {
    clearInterval(timer);
    const questionIndex = currentQuestionIndex - multipleChoiceQuestions.length;
    const correctAnswer = trueFalseQuestions[questionIndex].correct;
    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
        score += 10;
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        if ((button.innerHTML === "True" && correctAnswer) || (button.innerHTML === "False" && !correctAnswer)) {
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
        }
    });

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1000);
}

function showScore() {
    questionElement.style.display = 'none';
    answerButtonsElement.style.display = 'none';
    timerElement.style.display = 'none';
    scoreContainer.style.display = 'block';
    scoreElement.innerText = `Your score is ${score}/${(multipleChoiceQuestions.length + trueFalseQuestions.length) * 10}`;
    restartButton.style.display = 'inline-block';
}

restartButton.addEventListener('click', () => {
    scoreContainer.style.display = 'none';
    restartButton.style.display = 'none';
    userInfo.style.display = 'block';
    userNameInput.value = '';
    userYearInput.value = '';
    userDetails.innerHTML = '';
});
