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


let currentWord = '';
let timeRemaining = 99;
let score = 0;

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
}

let gameLoopTimeoutId = null;

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

inputField.addEventListener('keypress', function (event) {
    if (!/^[a-zA-Z]+$/.test(event.key)) {
        event.preventDefault();
    }
});

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

    // Create a new score element
    const newScoreElement = document.createElement('p');
    newScoreElement.textContent = scoreObject.toString();

    // Append the new score element to the score board
    lastScores.appendChild(newScoreElement);
}

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

/*
!------------------------------------------
!              TIME COUNTDOWN             |
!------------------------------------------
*/

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
        wordDisplay.textContent = currentWord;
}

