"use strict";

import { onEvent, getElement, select, selectAll } from "./util/general.js";

/*
Directions and requirements
* Utilize the typing game created in the previous course.
* Address and fix the issues highlighted in the earlier feedback (this step is crucial).
* Ensure your game lasts between 15 and 20 seconds so that we can easily test it.
* Use regular objects to store hits, percentage and date. Don't use the Score class here.
* Incorporate these objects into an array and store the array using localStorage.
* Employ JSON.stringify() and JSON.parse() for manipulating the data (the array of objects).
* Sort and 'splice' the array of ‘scores’ by hits before storing it, so you can always store the top
* games, not all of them. localStorage is limited.
* Display the top 9 or 10 scores in the scoreboard (see example provided).
* Ensure the scoreboard updates after every game (whenever the player gets a better score).
* Decide whether to automatically display the scoreboard when the game ends or implement a
* button for this purpose, available upon page loading and game completion. Don't show the
* scoreboard midgame.
* Display the scoreboard only when it contains data; otherwise, show a message indicating no
* games have been played.
*/

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

//* SCOREBOARD ELEMENTS
const scoreboard = getElement("scoreboard");
const dateScoreContainer = select(".date-score-container");
const scoreScoreContainer = select(".score-score-container");
const percentageScoreContainer = select(".percentage-score-container");
const scoreboardMessage = select(".scoreboard-message");

//* TOGGLE BUTTON ELEMENTS
const toggleButton = getElement("toggleButton");
const toggleIcon = getElement("toggleIcon");

//* COUNTDOWN DIALOG ELEMENTS
const countdownModal = getElement("countdown-dialog");
const countdown = getElement("countdown");

/*
!------------------------------------------
!         CONSTANTS AND VARIABLES         |
!------------------------------------------
*/


//* GAME VARIABLES
let currentWord = "";
let timeRemaining =20;
let score = 0;
let gameLoopTimeoutId = null;
let wordsInGame = [];
let timesUpSoundTimeoutId = null;

//* GAME CONSTANTS
const TIMES_UP_DELAY = 10000;
const GAME_LOOP_DELAY = 1000;
const finalScore = score;



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
const countdownSound = createAudio(
  "./assets/media/sounds/countdown.mp3",
  0.2, false, 1
);


onEvent("keydown", inputField, () => {
  const sound = typingSound.cloneNode();
  sound.play();
  sound.volume = 0.1;
});

function playSoundForLimitedTime(audio, duration) {
  audio.play();
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, duration);
}

/*
!------------------------------------------
!              GAME LOGIC                |
!------------------------------------------
*/

window.onload = function () {
  inputField.disabled = true;

  let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
  scoreboard.sort((a, b) => b.hits - a.hits);

  scoreboard.forEach(score => {
    dateScoreContainer.appendChild(createParagraphElement(`${score.date}`));
    scoreScoreContainer.appendChild(createParagraphElement(`${score.hits}`));
    percentageScoreContainer.appendChild(createParagraphElement(`${score.percentage}%`));
  });

  detectScoreboard();
}

function startGame() {
  inputField.disabled = false;
  let countdownNumber = 3;
  let countdownElement = countdown;
  countdownModal.showModal();
  countdownSound.play();
  playSoundForLimitedTime(countdownSound, 4000);
  countdownElement.textContent = countdownNumber;
  countdownElement.classList.remove('go-text');
  toggleButton.disabled = true;
  let countdownInterval = setInterval(function() {
    countdownNumber--;
    if (countdownNumber <= 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = 'GO!';
      countdownElement.classList.add('go-text'); 
      setTimeout(function() {
        countdownModal.close();
        resetGame();
        wordsInGame = [...words];
        backgroundMusic.play();
        generateWords();
        gameLoop();
        timesUpSoundTimeoutId = setTimeout(
          () => playSoundForLimitedTime(timesUpSound, 10000),
          TIMES_UP_DELAY
        );
        inputField.disabled = false;
        inputField.focus();
        document.body.classList.add('game-started');
      }, 1000);
    } else {
      countdownElement.textContent = countdownNumber;
    }
  }, 1000);
}

function updateScore() {
  score++;
  scoreDisplay.textContent = score;
  currentWord = "";
  inputField.value = "";
  generateWords();
  if (wordsInGame.length === 0) {
    endGame();
  }
}


function gameLoop() {
  if (wordsInGame.length === 0) {
    return;
  }
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
  const date = new Date().toLocaleString("en-US", {month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  const score = finalScore;
  const percentage = ((finalScore / words.length) * 100).toFixed(2);

  return {
    date: date,
    hits: score,
    percentage: percentage
  };
}

function updateTitle(message) {
  generateTitleSpans(message);
  const titleSpans = document.querySelectorAll('.title span');

  for (let i = 0; i < titleSpans.length; i++) {
    titleSpans[i].style.color = message === "Flawless Victory" ? "green" : "red";
  }
}

function createParagraphElement(textContent) {
  const p = document.createElement("p");
  p.textContent = textContent;
  return p;
}

function getEndGameMessage(finalScore) {
  return finalScore === wordsInGame.length ? "Flawless Victory" : "Game Over!";
}
function endGame() {
  const scoreObject = createScoreObject(finalScore);
  
  updateHighScore();

  dateScoreContainer.appendChild(createParagraphElement(`${scoreObject.date}`));
  scoreScoreContainer.appendChild(createParagraphElement(`${scoreObject.hits}`));
  percentageScoreContainer.appendChild(createParagraphElement(`${scoreObject.percentage}%`));

  const message = getEndGameMessage(finalScore);

  resetGame();
  updateTitle(message);

  playSoundForLimitedTime(gameOverSound, 1000);

  storeScoreValues(scoreObject);
  updateScoreboard();
  toggleButton.disabled = false;
  detectScoreboard();
}

function storeScoreValues(scoreObject) {
  let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
  scoreboard.push(scoreObject); 

  scoreboard.sort((a, b) => b.hits - a.hits);

  if (scoreboard.length > 10) {
    scoreboard.length = 10;
  }

  localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
}

function generateTitleSpans(title) {
  const titleContainer = document.querySelector('.title');
  titleContainer.innerHTML = ''; // Clear the title container

  for (let char of title) {
    let span = document.createElement('span');
    span.textContent = char === " " ? "" : char;
    span.className = char === " " ? "space" : "";
    span.style.color = "#fff";
    titleContainer.appendChild(span);
  }
}

function updateScoreboard() {
  selectAll(".date-score-container p").forEach(el => el.innerHTML = '');
  selectAll(".score-score-container p").forEach(el => el.innerHTML = '');
  selectAll(".percentage-score-container p").forEach(el => el.innerHTML = '');

  let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
  scoreboard.forEach(score => {
    dateScoreContainer.appendChild(createParagraphElement(`${score.date}`));
    scoreScoreContainer.appendChild(createParagraphElement(`${score.hits}`));
    percentageScoreContainer.appendChild(createParagraphElement(`${score.percentage}%`));
  });
}

function resetTitle() {
  let originalTitle = "TypePixel Runner";
  generateTitleSpans(originalTitle);
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
  timesUpSound.currentTime = 0;
  timesUpSound.pause();
  if (timesUpSoundTimeoutId) {
    clearTimeout(timesUpSoundTimeoutId);
    timesUpSoundTimeoutId = null;
  }
  inputField.focus();
  inputField.disabled = true;
  document.body.classList.remove('game-started');
  inputField.value = "";
  resetTitle();
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
  timeRemaining =20;
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
  let highScore = Number(localStorage.getItem("highScore")) || 0;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScore = score;
  }
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
  let index = Math.floor(Math.random() * wordsInGame.length);
  currentWord = wordsInGame.splice(index, 1)[0];
  wordDisplay.textContent = ""; 

  if (currentWord) {
    for (let letter of currentWord) {
      let span = document.createElement("span");
      span.textContent = letter;
      wordDisplay.appendChild(span);
    }
  }
}

  function handleInput() {
    let spans = wordDisplay.querySelectorAll("span");
    let inputValue = inputField.value;
  
    for (let i = 0; i < spans.length; i++) {
      if (inputValue[i] && inputValue[i].toLowerCase() === spans[i].textContent.toLowerCase()) {
        spans[i].classList.add("valid");
      } else {
        spans[i].classList.remove("valid");
      }
    }
    inputField.focus();
  }
  

onEvent("input", inputField, handleInput);

function toggleScoreboard() {
  scoreboard.classList.toggle("visible");
  toggleIcon.classList.toggle("fa-trophy");
  toggleIcon.classList.toggle("fa-times");
}

onEvent("click", toggleButton, toggleScoreboard);

function detectScoreboard() {
  if (localStorage.getItem("highScore") === null) {
    scoreboardMessage.textContent = "No games have been played yet!";
    toggleButton.disabled = true;
  } else {
    scoreboardMessage.textContent = `High Score: ${localStorage.getItem("highScore")}`;
  }
}