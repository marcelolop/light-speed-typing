"use strict";

import { onEvent, getElement, select, selectAll } from "./util/general.js";
import Score from "./classes/Score.js";

/*
!------------------------------------------
!              DOM ELEMENTS              |
!------------------------------------------
*/

//* GAME ELEMENTS
const startButton = getElement("start-btn");
const wordDisplay = getElement("output");
const timeDisplay = getElement("time");
const scoreDisplay = getElement("score");
const inputField = getElement("input");
const highScoreDisplay = getElement("high-score");
const titleSpans = selectAll(".title span");

//* SCOREBOARD ELEMENTS
const dateScoreContainer = select(".date-score-container");
const scoreScoreContainer = select(".score-score-container");
const percentageScoreContainer = select(".percentage-score-container");

//* TOGGLE BUTTON ELEMENTS
const toggleButton = getElement("toggleButton");
const scoreboard = getElement("scoreboard");
const arrow = getElement("arrow");

/*
!------------------------------------------
!         CONSTANTS AND VARIABLES         |
!------------------------------------------
*/

//* GAME CONSTANTS
const TIMES_UP_DELAY = 69000;
const GAME_LOOP_DELAY = 1000;

//* GAME VARIABLES
let currentWord = "";
let timeRemaining = 99;
let score = 0;
let gameLoopTimeoutId = null;

/*
!------------------------------------------
!              SOUNDS                     |
!------------------------------------------
*/

function createAudio(src, volume, loop = false, playbackRate = 1) {
  const audio = new Audio();
  audio.src = src;
  audio.loop = loop;
  audio.volume = volume;
  audio.playbackRate = playbackRate;
  audio.preload = "auto";
  return audio;
}

const backgroundMusic = createAudio(
  "./assets/media/sounds/background-music.mp3",
  0.1,
  true
);
const typingSound = createAudio(
  "./assets/media/sounds/typing-sound.mp3",
  0.02,
  false,
  1
);
const timesUpSound = createAudio("./assets/media/sounds/times-up.mp3", 0.2);
const gameOverSound = createAudio("./assets/media/sounds/game-over.mp3", 0.2);

onEvent("keydown", inputField, () => {
  const sound = typingSound.cloneNode();
  sound.play();
  sound.volume = 0.1;
});

function playSoundForLimitedTime(audio, duration) {
  audio.play();
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0; // isso é para resetar o som para o início
  }, duration);
}

/*
!------------------------------------------
!              GAME LOGIC                |
!------------------------------------------
*/

function startGame() {
  resetGame();
  backgroundMusic.play();
  generateWords();
  gameLoop();
  setTimeout(
    () => playSoundForLimitedTime(timesUpSound, 30000),
    TIMES_UP_DELAY
  );
}

function updateScore() {
  score++;
  scoreDisplay.textContent = score;
  currentWord = "";
  inputField.value = "";
  generateWords();
}

function gameLoop() {
  timeDisplay.textContent = `${timeRemaining} s`;

  if (timeRemaining <= 0) {
    timeDisplay.textContent = "0 s";
    endGame();
    return;
  }

  if (currentWord && inputField.value === currentWord) {
    updateScore();
  }

  timeRemaining--;
  gameLoopTimeoutId = setTimeout(gameLoop, GAME_LOOP_DELAY);
}

function validateInput(event) {
  if (!/^[a-zA-Z]+$/.test(event.key)) {
    event.preventDefault();
  }
}

onEvent("keypress", inputField, validateInput);

function createScoreObject(finalScore) {
  return new Score(
    new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    finalScore,
    ((finalScore / words.length) * 100).toFixed(2)
  );
}

function updateTitle(message) {
  for (let i = 0; i < titleSpans.length; i++) {
    if (message[i] === " ") {
      titleSpans[i].textContent = "";
      titleSpans[i].className = "space";
    } else if (message[i]) {
      titleSpans[i].textContent = message[i];
      titleSpans[i].style.color =
        message === "Flawless Victory" ? "green" : "red";
      titleSpans[i].className = ""; 
    } else {
      titleSpans[i].textContent = "";
      titleSpans[i].className = ""; 
    }
  }
}

function endGame() {
  const finalScore = score;

  const scoreObject = createScoreObject(finalScore);

  updateHighScore();

  const dateElement = document.createElement("p");
  const scoreElement = document.createElement("p");
  const percentageElement = document.createElement("p");

  dateElement.textContent = `${scoreObject.date}`;
  scoreElement.textContent = `${scoreObject.hits}`;
  percentageElement.textContent = `${scoreObject.percentage}%`;

  dateScoreContainer.appendChild(dateElement);
  scoreScoreContainer.appendChild(scoreElement);
  percentageScoreContainer.appendChild(percentageElement);

  let message = finalScore === 120 ? "Flawless Victory" : "Game Over!";

  updateTitle(message);
  resetGame();

  playSoundForLimitedTime(gameOverSound, 1000);
}

function resetTitle() {
  let originalTitle = "Light Speed Typing";

  for (let [i, span] of titleSpans.entries()) {
    if (originalTitle[i] === " ") {
      span.textContent = "";
      span.className = "space";
    } else if (originalTitle[i]) {
      span.textContent = originalTitle[i];
      span.style.color = "#fff"; // Reset to original color
      span.className = ""; // remove the 'space' class if it was added before
    } else {
      span.textContent = "";
      span.className = ""; // remove the 'space' class if it was added before
    }
  }
}

onEvent("click", startButton, resetTitle);

/*
!------------------------------------------
!              RESET GAME                 |
!------------------------------------------
*/

function resetGame() {
  resetButton();
  shuffleWords();
  resetGameState();
  clearGameLoop();
  clearIO();
  backgroundMusic.currentTime = 0;
}

function resetButton() {
  startButton.textContent = "Reset";
  const resetIcon = document.createElement("i");
  resetIcon.classList.add("fas", "fa-redo-alt");
  startButton.prepend(resetIcon);
}

function shuffleWords() {
  words.sort(() => Math.random() - 0.5);
}

function resetGameState() {
  currentWord = "";
  timeRemaining = 99;
  score = 0;
  inputField.placeholder = "";
  scoreDisplay.textContent = score;
}

function clearGameLoop() {
  if (gameLoopTimeoutId !== null) {
    clearTimeout(gameLoopTimeoutId);
  }
}

function clearIO() {
  inputField.value = "";
  wordDisplay.textContent = "";
  timeDisplay.textContent = "0s";
  backgroundMusic.pause();
}

function handleButtonClick() {
  if (startButton.textContent === "Reset") {
    resetGame();
  }
  startGame();
}

onEvent("click", startButton, handleButtonClick);

function updateHighScore() {
  let highScore = localStorage.getItem("highScore") || 0;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScore = score;
  }

  highScoreDisplay.textContent = highScore;
}

/*
!------------------------------------------
!              WORDS FUNCTIONS            |
!------------------------------------------
*/

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

function generateWords() {
  let index = Math.floor(Math.random() * words.length);
  currentWord = words.splice(index, 1)[0];
  wordDisplay.textContent = ""; 

  for (let letter of currentWord) {
    let span = document.createElement("span");
    span.textContent = letter;
    wordDisplay.appendChild(span);
  }
}

function handleInput() {
  let spans = wordDisplay.querySelectorAll("span");
  let inputValue = inputField.value;

  for (let i = 0; i < spans.length; i++) {
    if (inputValue[i]) {
      if (inputValue[i] === spans[i].textContent) {
        spans[i].classList.add("valid");
        spans[i].classList.remove("invalid");
      } else {
        spans[i].classList.add("invalid");
        spans[i].classList.remove("valid");
      }
    } else {
      spans[i].classList.remove("valid");
      spans[i].classList.remove("invalid");
    }
  }
}

onEvent("input", inputField, handleInput);

function toggleScoreboard() {
  scoreboard.classList.toggle("visible");
  arrow.classList.toggle("fa-arrow-down");
  arrow.classList.toggle("fa-arrow-up");
}

onEvent("click", toggleButton, toggleScoreboard);
