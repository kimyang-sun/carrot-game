"use strict";
const CARROT_SIZE = 80;
const CARROT_COUNT = 15;
const BUG_COUNT = 5;
const GAME_DURATION = 5;

const gameField = document.querySelector(".game-field");
const gameBtn = document.querySelector(".game-btn");
const regameBtn = document.querySelector(".regame-btn");
const timer = document.querySelector(".timer");
const count = document.querySelector(".count");

const gamePopUp = document.querySelector(".game-popup");
const popUpText = document.querySelector(".popup-text");

const carrotSound = new Audio("sound/carrot_pull.mp3");
const bugSound = new Audio("sound/bug_pull.mp3");
const alertSound = new Audio("sound/alert.wav");
const winSound = new Audio("sound/game_win.mp3");
const bgSound = new Audio("sound/bg.mp3");

let started = false;
let timerValue = undefined;
let countValue = 0;
let gameDuration = GAME_DURATION;

gameBtn.addEventListener("click", () => {
  if (started) {
    pauseGame();
  } else {
    startGame();
  }
  started = !started;
});

// 게임 시작
function startGame() {
  if (gameField.innerHTML === "") {
    initImage();
  }
  showStopBtn();
  showTimerAndCount();
  startTimer();
  startCount();
  hidePopUp();
  playSound(bgSound);
}

function showStopBtn() {
  const icon = gameBtn.querySelector(".fa-play");
  icon.classList.remove("fa-play");
  icon.classList.add("fa-pause");
}

function showTimerAndCount() {
  timer.classList.add("on");
  count.classList.add("on");
}

function startTimer() {
  updateTimerText(gameDuration);
  timerValue = setInterval(() => {
    updateTimerText(--gameDuration);
    if (gameDuration <= 0) {
      finishGame(countValue === CARROT_COUNT);
      clearInterval(timerValue);
      return;
    }
  }, 1000);
}

function updateTimerText(time) {
  const minute = Math.floor(time / 60);
  const second = Math.floor(time % 60);
  const minuteTime = `0${minute}`.substr(-2);
  const secondTime = `0${second}`.substr(-2);
  timer.innerHTML = `${minuteTime}:${secondTime}`;
}

function startCount() {
  count.innerHTML = CARROT_COUNT - countValue;
  if (countValue === CARROT_COUNT) {
    finishGame(true);
  }
}

function hidePopUp() {
  gamePopUp.classList.remove("on");
}

// 게임 일시정지
function pauseGame() {
  showgameBtn();
  pauseTimer();
  showPopUp("Replay❓");
  playSound(alertSound);
  stopSound(bgSound);
}

function showgameBtn() {
  const icon = gameBtn.querySelector(".fa-pause");
  icon.classList.remove("fa-pause");
  icon.classList.add("fa-play");
}

function pauseTimer() {
  clearInterval(timerValue);
}

function showPopUp(text) {
  popUpText.innerHTML = text;
  gamePopUp.classList.add("on");
}

// 게임 새로시작
regameBtn.addEventListener("click", () => {
  reStartGame();
});

function reStartGame() {
  gameDuration = GAME_DURATION;
  started = true;
  countValue = 0;
  gameBtn.style.visibility = "visible";
  initImage();
  startGame();
}

// 이미지 생성
function initImage() {
  gameField.innerHTML = "";
  addImage("carrot", CARROT_COUNT, "img/carrot.png");
  addImage("bug", BUG_COUNT, "img/bug.png");
}

function addImage(imgName, count, imgSrc) {
  const fieldWidth = gameField.offsetWidth;
  const fieldHeight = gameField.offsetHeight;
  const rangeX = fieldWidth - CARROT_SIZE;
  const rangeY = fieldHeight - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const image = document.createElement("img");
    image.setAttribute("class", imgName);
    image.setAttribute("alt", imgName);
    image.setAttribute("src", imgSrc);

    const x = Math.floor(Math.random() * rangeX);
    const y = Math.floor(Math.random() * rangeY);

    image.style.left = `${x}px`;
    image.style.top = `${y}px`;

    gameField.appendChild(image);
  }
}

// 당근 or 벌레 클릭
gameField.addEventListener("click", onFieldClick);

function onFieldClick(event) {
  const target = event.target;
  if (!started || target.tagName !== "IMG") {
    return;
  }
  if (target.classList.contains("carrot")) {
    target.remove();
    countValue++;
    startCount();
    playSound(carrotSound);
  } else if (target.classList.contains("bug")) {
    finishGame(false);
    playSound(bugSound);
  }
}

function hideGameBtn() {
  showgameBtn();
  gameBtn.style.visibility = "hidden";
}

function finishGame(win) {
  started = false;
  pauseTimer();
  hideGameBtn();
  showPopUp(win ? "You Won 🎉" : "You Lost 💀");
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopSound(bgSound);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
