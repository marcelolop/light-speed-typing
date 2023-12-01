'use strict';


import { onEvent, getElement, select, selectAll } from './util/general.js';
import  Score  from './classes/Score.js';

/*
!------------------------------------------
!              DOM ELEMENTS              |
!------------------------------------------
*/

const startButton = getElement('start-btn');
const wordDisplay = getElement('output');
const timeDisplay = getElement('time');
const scoreDisplay = getElement('score');
const inputField = getElement('input');
const lastScores = select('.last-score');
const startIcon = select('.start-icon');
const titleSpans = selectAll('.title span');


let currentWord = '';
let timeRemaining = 99;
let score = 0;
let gameLoopTimeoutId = null;

/*
!------------------------------------------
!              SOUNDS                     |
!------------------------------------------
*/

const backgroundMusic = new Audio();
backgroundMusic.src = './assets/media/sounds/background-music.mp3';
backgroundMusic.loop = true;
backgroundMusic.volume = 0.05;
backgroundMusic.preload = 'auto';

const typingSound = new Audio();
typingSound.src = './assets/media/sounds/typing-sound.mp3';
typingSound.volume = 0.05;
typingSound.playbackRate = 5;
typingSound.preload = 'auto';

const timesUpSound = new Audio();
timesUpSound.src = './assets/media/sounds/times-up.mp3';
timesUpSound.volume = 0.1;
timesUpSound.preload = 'auto';

onEvent('input', inputField, () => {
    typingSound.play();
});


/*
!------------------------------------------
!              GAME LOGIC                |
!------------------------------------------
*/

function startGame() {
    startButton.textContent = 'Reset';
    startIcon.classList.remove('fa-play');
    startIcon.classList.add('fa-redo');
    words.sort(() => Math.random() - 0.5);
    currentWord = '';
    timeRemaining = 99;
    score = 0;
    backgroundMusic.play();
    generateWords();
    if (gameLoopTimeoutId !== null) {
        clearTimeout(gameLoopTimeoutId);
    }
    inputField.placeholder = '';
    gameLoop();
    setTimeout(function() {
        timesUpSound.play();
    }, 79000);
}


function gameLoop() {
    timeDisplay.textContent = `${timeRemaining} s`;
    
    if (timeRemaining <= 0) {
        endGame();
        return;
    }

    if (currentWord && inputField.value === currentWord) {
        score++;
        scoreDisplay.textContent = score;
        currentWord = '';
        inputField.value = '';
        generateWords();
    }

    timeRemaining--;
    gameLoopTimeoutId = setTimeout(gameLoop, 1000);
}

function validateInput(event) {
    if (!/^[a-zA-Z]+$/.test(event.key)) {
        event.preventDefault();
    }
}

onEvent('keypress', inputField, validateInput);

function endGame() {
    startButton.textContent = 'Reset';
    inputField.value = '';
    wordDisplay.textContent = '';
    timeDisplay.textContent = '';
    backgroundMusic.pause();
    
    const scoreObject = new Score(
        new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
        score,
        (score / 120 * 100).toFixed(2)
    );

    // Update the high score
    updateHighScore();

    // Create a new score element
    const newScoreElement = document.createElement('p');
    newScoreElement.textContent = scoreObject.toString();

    // Append the new score element to the score board
    lastScores.appendChild(newScoreElement);

    let message;

    if (score === 120) {
        message = "Flawless Victory";
    } else {
        message = "Game Over";
    }

    for (let i = 0; i < titleSpans.length; i++) {
        if (message[i]) {
            titleSpans[i].textContent = message[i];
            titleSpans[i].style.color = message === "Flawless Victory" ? 'green' : 'red';
        } else {
            titleSpans[i].textContent = '';
        }
    }
}

function resetTitle() {
    let originalTitle = "Light Speed Typing";

    for (let i = 0; i < titleSpans.length; i++) {
        if (originalTitle[i]) {
            titleSpans[i].textContent = originalTitle[i];
            titleSpans[i].style.color = '#ffe100'; // Reset to original color
        } else {
            titleSpans[i].textContent = '';
        }
    }
}

onEvent('click', startButton, resetTitle);

function handleButtonClick() {
    if (startButton.textContent === 'Reset') {
        resetGame();
    }
    startGame();
}

function resetGame() {
    currentWord = '';
    timeRemaining = 99;
    score = 0;
    wordDisplay.textContent = '';
    timeDisplay.textContent = '';
    scoreDisplay.textContent = '';
    inputField.value = '';
}


onEvent('click', startButton, handleButtonClick);

function updateHighScore() {
    // get the high score from local storage
    let highScore = localStorage.getItem('highScore');

    // if there is no high score in local storage or the current score is higher
    if (!highScore || score > highScore) {
        // update the high score in local storage
        localStorage.setItem('highScore', score);
        highScore = score;
    }

    // update the high score display
    const highScoreDisplay = document.getElementById('high-score');
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
    wordDisplay.textContent = ''; // clear the word display

    // create a span for each letter in the word
    for (let letter of currentWord) {
        let span = document.createElement('span');
        span.textContent = letter;
        wordDisplay.appendChild(span);
    }
}

function handleInput() {
    // get the spans in the word display
    let spans = wordDisplay.querySelectorAll('span');
    // get the input value
    let inputValue = inputField.value;

    // iterate over each span
    for (let i = 0; i < spans.length; i++) {
        // if the input has a letter at this position
        if (inputValue[i]) {
            // if the letter is correct
            if (inputValue[i] === spans[i].textContent) {
                // add the green class to the span
                spans[i].classList.add('valid');
                // remove the red class from the span
                spans[i].classList.remove('invalid');
            } else {
                // otherwise, add the red class to the span
                spans[i].classList.add('invalid');
                // remove the green class from the span
                spans[i].classList.remove('valid');
            }
        } else {
            // if there is no input for this position, remove both classes
            spans[i].classList.remove('valid');
            spans[i].classList.remove('invalid');
        }
    }
}

onEvent('input', inputField, handleInput);
