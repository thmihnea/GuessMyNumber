'use strict';

// SETTINGS
// General settings used for the game.
// Includes stuff such as settings, colors for
// background-chaning and messages.

const LOWER_BOUND = 1;
const UPPER_BOUND = 21;

const LOWER_BOUND_REWARD = 1;
const UPPER_BOUND_REWARD = 10;

const DEFAULT_SCORE = 20;
const DEFAULT_HIGH_SCORE = 20;

const LOSE_SCORE = 0;

const LANG_GAME_TITLE = "Guess My Number!";
const LANG_PICK_NUMBER = "Pick a number!";
const LANG_NAN = "This is not a number, silly!";
const LANG_DEFAULT_NUMBER_SYMBOL = "?";

const COLOR_RED = '#CC0000';
const COLOR_GREY = '#222';
const COLOR_GREEN = '#60b347';

const GUESS_MESSAGES = ["You guessed it!", "How did he do it?", "He's insane, but he's right!",
"Here he comes with a guess!", "But how good are you to guess it?", "Sheesh man, you're insane!",
"A wild guess has appeared!"];
const FAIL_MESSAGES = ["You're garbage!", "Try harder!", "It feels like you're a bot, maybe try a CAPTCHA?",
"You're horrendous to watch!", "You're horrible!", "Are you sure you're okay?", "You have no idea what you're doing!"];
const LOSS_MESSAGES = ["You lost!", "Imagine losing this game.", "AHAHAHAHAHAHA!", "LOL UR SO BAD"];

// END SETTINGS.

// PLAYER VARIABLES
// These are the interchangeable variables
// for the player, namely the player's
// score and highscore.

let score = DEFAULT_SCORE;
let highScore = DEFAULT_HIGH_SCORE;

// END VARIABLES.

// CONSTANT FUNCTIONS

const select = (htmlClass) => {
    return document.querySelector("." + htmlClass);
}

const addListener = (htmlClass, eventType, callback) => {
    select(htmlClass).addEventListener(eventType, e => {
        callback();
    });
};

const getFieldValue = (htmlClass) => {
    return select(htmlClass).value;
};

const setFieldValue = (htmlClass, newValue) => {
    select(htmlClass).value = newValue;
};

const setTextContent = (htmlClass, newTextContent) => {
    select(htmlClass).textContent = newTextContent;
}

const getTextContent = (htmlClass) => {
    return select(htmlClass).textContent;
}

const getRandom = (lowerBound, upperBound) => {
    if (lowerBound > upperBound) {
        let aux = upperBound;
        upperBound = lowerBound;
        lowerBound = aux;
    }
    lowerBound = Math.ceil(lowerBound);
    upperBound = Math.floor(upperBound);
    return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
}

const updateHTML = (HTML, newValue) => {
    document.querySelector(HTML).textContent = newValue;
}

const update_h1 = (newValue) => {
    updateHTML("h1", newValue);
}

const updateMessage = (newValue) => {
    setTextContent("message", newValue);
}

const updateNumber = (newValue) => {
    setTextContent("number", newValue);
}

const updateScore = (newValue) => {
    setTextContent("score", newValue);
}

const updateHighScore = (newValue) => {
    setTextContent("highscore", newValue);
}

const getHash = () => {
    return getRandom(LOWER_BOUND, UPPER_BOUND);
}

const getReward = () => {
    return getRandom(LOWER_BOUND_REWARD, UPPER_BOUND_REWARD);
}

const reset = () => {
    updateMessage(LANG_PICK_NUMBER);
    setScore(DEFAULT_SCORE);
    updateNumber(LANG_DEFAULT_NUMBER_SYMBOL);
    updateScore(getScore());
    setBackgroundColor(COLOR_GREY);
    update_h1(LANG_GAME_TITLE);
}

const displayLose = (showScoreReset) => {
    const message = computeRandomMessage(LOSS_MESSAGES);
    update_h1(message);

    updateScore(LOSE_SCORE);
    setBackgroundColor(COLOR_RED);

    if (showScoreReset) {
        updateScore(getScore());
    }
}

const play = () => {
    const userInput = Number(getFieldValue("guess"));
    if (!(userInput)) {
        updateMessage(LANG_NAN);
        return;
    }
    const hash = getHash();
    if (userInput === hash) {
        const reward = getReward();
        const finalScore = reward + getScore();
        if (getHighScore() < finalScore) {
            updateHighScoreVisually(finalScore);
        } 
        updateScoreOnGuess(finalScore);
    } else {
        updateScoreOnFail();
        if (!(getScore())) {
            reset();
            displayLose(true);
            return;
        }
    }
    updateNumber(hash);
    update_h1(LANG_GAME_TITLE);
}

// END CONSTANT FUNCTIONS.

// FUNCTIONS

function setScore(newScore) {
    score = newScore;
}

function getScore() {
    return score;
}

function getHighScore() {
    return highScore;
}

function setHighScore(newHighScore) {
    highScore = newHighScore;
}

function setBackgroundColor(color) {
    let style = document.querySelector("body").style;
    style.backgroundColor = color;
}

function computeRandomMessage(array) {
    const index = getRandom(0, array.length);
    return array[index];
}

function updateHighScoreVisually(newHighScore) {
    setHighScore(newHighScore);
    updateHighScore(newHighScore);
}

function updateScoreOnGuess(finalScore) {
    const receivedPoints = finalScore - getScore();
    const message = computeRandomMessage(GUESS_MESSAGES);

    updateMessage(`${message} (+${receivedPoints}p)`);
    updateScore(finalScore);

    setScore(finalScore);
    setBackgroundColor(COLOR_GREEN);
}

function updateScoreOnFail() {
    const message = computeRandomMessage(FAIL_MESSAGES);

    updateMessage(`${message} (-1p)`);
    setBackgroundColor(COLOR_GREY);

    setScore(getScore() - 1);
    updateScore(getScore());
}

// END FUNCTIONS.

// LISTENERS
// These methods are used for giving
// functionality to page buttons.

addListener("check", "click", play);
addListener("again", "click", reset);

// END LISTENERS.
