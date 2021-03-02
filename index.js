'use strict';

import * as Lang from './modules/lang.js';
import * as Settings from './modules/settings.js'
import * as CSSHelper from './modules/css.js';

// PLAYER VARIABLES
// These are the interchangeable variables
// for the player, namely the player's
// score and highscore.

let score = Settings.DEFAULT_SCORE;
let highScore = Settings.DEFAULT_HIGH_SCORE;

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
    return getRandom(Settings.LOWER_BOUND, Settings.UPPER_BOUND);
}

const getReward = () => {
    return getRandom(Settings.LOWER_BOUND_REWARD, Settings.UPPER_BOUND_REWARD);
}

const reset = () => {
    updateMessage(Lang.LANG_PICK_NUMBER);
    setScore(Settings.DEFAULT_SCORE);
    updateNumber(Lang.LANG_DEFAULT_NUMBER_SYMBOL);
    updateScore(getScore());
    setBackgroundColor(CSSHelper.COLOR_GREY);
    update_h1(Lang.LANG_GAME_TITLE);
}

const displayLose = (showScoreReset) => {
    const message = computeRandomMessage(Lang.LOSS_MESSAGES);
    update_h1(message);

    updateScore(Settings.LOSE_SCORE);
    setBackgroundColor(CSSHelper.COLOR_RED);

    if (showScoreReset) {
        updateScore(getScore());
    }
}

const play = () => {
    const userInput = Number(getFieldValue("guess"));
    if (!(userInput)) {
        updateMessage(Lang.LANG_NAN);
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
    update_h1(Lang.LANG_GAME_TITLE);
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
    const message = computeRandomMessage(Lang.GUESS_MESSAGES);

    updateMessage(`${message} (+${receivedPoints}p)`);
    updateScore(finalScore);

    setScore(finalScore);
    setBackgroundColor(CSSHelper.COLOR_GREEN);
}

function updateScoreOnFail() {
    const message = computeRandomMessage(Lang.FAIL_MESSAGES);

    updateMessage(`${message} (-1p)`);
    setBackgroundColor(CSSHelper.COLOR_GREY);

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
