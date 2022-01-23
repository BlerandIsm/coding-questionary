//section list
var quizSections= document.querySelectorAll(".quiz-section");

//targeting start section
var startSection = document.getElementById("start");
var startBtm = document.getElementById("start-button");

//quiz questions sections
var quizSection = document.getElementById("quiz-questions");
var timeRemaining = document.getElementById("time-remaining");
var question = document.getElementById("question");
var choices = document.getElementById("choices");
var choicesStatus = document.querySelectorAll(".choice-status");
var correct = document.getElementById("correct");
var wrong = document.getElementById("wrong");

// end of quiz
var endSection = document.getElementById("end");
var endTitle = document.getElementById("end-title");
var score = document.getElementById ("score");
var initialsInput = document.getElementById("initials");
var submitScore= document.getElementById("submit-score");
var errorMessage = document.getElementById("error-message");

class Question {
    constructor(question, choices, indexOfCorrectChoice) {
      this.question = question;
      this.choices = choices;
      this.indexOfCorrectChoice = indexOfCorrectChoice;
    }
}
// building the questions and the alternatives 
var question1 = new Question("Inside which HTML element do we put the JavaScript? ", 
  ["<js>", "<scripting>", "<javascript>", "<script>"], 3);
var question2 = new Question("How do you write 'Hello World' in an alert box?.", 
  ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"], 2);
var question3 = new Question("How to write an IF statement in JavaScript?", 
  ["if (i == 5)", "if i = 5", "if i == 5 then", "if i = 5 then"], 0);
var question4 = new Question("How do you round the number 7.25, to the nearest integer?", 
  ["Math.rnd(7.25)", "Math.round(7.25)", "round(7.25)", "rnd(7.25)"], 1);
var question5 = new Question("Which event occurs when the user clicks on an HTML element? ", 
  ["onchange ", "onmouseover", "onclick", "onmouseclick"], 2);
var questionList = [question1,question2,question3,question4,question5];

var currentQuestion = 0;

var totalTime = 75;
var totalTimeInterval;
var choiceStatusTimeout; 

//after qustions we need to activate the event lister 

startBtm.addEventListener('click', startQuiz);
choices.addEventListener("click", processChoice);
submitScore.addEventListener('submit', processInput);

function startQuiz(){
    showElement(quizSections, quizSection);
    displayTime();
    displayQuestion();
    startTimer();
}
function showElement(siblingList, showElement) {
    for (element of siblingList) {
      hideElement(element);
    }
    showElement.classList.remove("hidden");
  } 
  function hideElement(element) {
    if (!element.classList.contains("hidden")) {
      element.classList.add("hidden");
    }
  }


  function displayTime() {
    timeRemaining.textContent = totalTime;
  }
  function startTimer() {
    totalTimeInterval = setInterval(function() {
      totalTime--;
      displayTime();
      checkTime();
  
    }, 1000);
  }
  function checkTime() {
    if (totalTime <= 0) {
      totalTime = 0;
      endGame();
    }
  }

  function displayQuestion() {
    question.textContent = questionList[currentQuestion].question;
  
    displayChoiceList();
  }

  function displayChoiceList() {
    choices.innerHTML = "";
  
    questionList[currentQuestion].choices.forEach(function(answer, index) {
      var li = document.createElement("li");
      li.dataset.index = index;
      var button = document.createElement("button");
      button.textContent = (index + 1) + ". " + answer;
      li.appendChild(button);
      choices.appendChild(li);
    });
  }

function processChoice(event) {
  var userChoice = parseInt(event.target.parentElement.dataset.index);

  resetChoiceStatusEffects();
  checkChoice(userChoice);
  getNextQuestion();
}

function resetChoiceStatusEffects() {
    clearTimeout(choiceStatusTimeout);
    styleTimeRemainingDefault();
  }

  function styleTimeRemainingDefault() {
    timeRemaining.style.color = "#4616E8";
  }
  
  function styleTimeRemainingWrong() {
    timeRemaining.style.color = "#E81648";
  }

  function checkChoice(userChoice) {
    if (isChoiceCorrect(userChoice)) {
      displayCorrectChoiceEffects();
    } else {
      displayWrongChoiceEffects();
    }
    
  }

  function isChoiceCorrect(choice) {
    return choice === questionList[currentQuestion].indexOfCorrectChoice;
  }

  function displayWrongChoiceEffects() {
    deductTimeBy(10);
  
    styleTimeRemainingWrong();
    showElement(choicesStatus, wrong);
  
    choiceStatusTimeout = setTimeout(function() {
      hideElement(wrong);
      styleTimeRemainingDefault();
    }, 1000);
  }

  function deductTimeBy(seconds) {
    totalTime -= seconds;
    checkTime();
    displayTime();
  }

  function displayCorrectChoiceEffects() {
    showElement(choicesStatus, correct);
  
    choiceStatusTimeout = setTimeout(function() {
      hideElement(correct);
    }, 1000);
  }

  function getNextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questionList.length) {
      endGame();
    } else {
      displayQuestion();
    }
  }

  function endGame() {
    clearInterval(totalTimeInterval);
    
    showElement(quizSections, endSection);
    displayScore();
    setEndHeading();
  }

  function displayScore() {
    score.textContent = totalTime;
  }
  
  function setEndHeading() {
    if (totalTime === 0) {
      endTitle.textContent = "Sorry! time out!";
    } else {
      endTitle.textContent = "Congrats! Your done!";
    }
  }
  
  function processInput(event) {
    event.preventDefault();
  
    const initials = initialsInput.value.toUpperCase();
  
    if (isInputValid(initials)) {
      var score = totalTime;
      var highscoreEntry = getNewHighscoreEntry(initials, score);
      saveHighscoreEntry(highscoreEntry);
      window.location.href= "./highscores.html";
    }
  }

  function getNewHighscoreEntry(initials, score) {
    const entry = {
      initials: initials,
      score: score,
    }
    return entry;
  }
  
  function isInputValid(initials) {
    let errorMessage = "";
    if (initials === "") {
      errorMessage = "You can't submit empty initials!";
      displayFormError(errorMessage);
      return false;
    } else if (initials.match(/[^a-z]/ig)) {
      errorMessage = "Initials may only include letters."
      displayFormError(errorMessage);
      return false;
    } else {
      return true;
    }
  }

  function displayFormError(errorMessage) {
    errorMessage.textContent = errorMessage;
    if (!initialsInput.classList.contains("error")) {
      initialsInput.classList.add("error");
    }
  }
  
  function saveHighscoreEntry(highscoreEntry) {
    var currentScores = getScoreList();
    placeEntryInHighscoreList(highscoreEntry, currentScores);
    localStorage.setItem('scoreList', JSON.stringify(currentScores));
  }

  function getScoreList() {
    var currentScores = localStorage.getItem('scoreList');
    if (currentScores) {
      return JSON.parse(currentScores);
    } else {
      return [];
    }
  }
  
  function placeEntryInHighscoreList(newEntry, scoreList) {
    var newScoreIndex = getNewScoreIndex(newEntry, scoreList);
    scoreList.splice(newScoreIndex, 0, newEntry);
  }
  
  function getNewScoreIndex(newEntry, scoreList) {
    if (scoreList.length > 0) {
      for (let i = 0; i < scoreList.length; i++) {
        if (scoreList[i].score <= newEntry.score) {
          return i;
        }
      } 
    }
    return scoreList.length;
  }