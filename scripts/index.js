//section list
var quizSections= document.querySelectorAll(".quiz-section");

//targeting start section
var startSection = document.getElementById("start");
var startBtm = document.getElementById("start-button");

//quiz questions sections
var quizSection = document.getElementById("quiz-sections");
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