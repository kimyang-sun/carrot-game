"use strict";
import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  pause: "pause",
});

// 빌더패턴
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  carrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  carrotSize(size) {
    this.carrotSize = size;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration,
      this.carrotCount,
      this.bugCount,
      this.carrotSize
    );
  }
}

// 게임 클래스
class Game {
  constructor(gameDuration, carrotCount, bugCount, carrotSize) {
    this.GAME_DURATION = gameDuration;
    this.gameDuration = gameDuration;

    this.gameBtn = document.querySelector(".game-btn");
    this.timer = document.querySelector(".timer");
    this.count = document.querySelector(".count");

    this.started = false;
    this.timerValue = undefined;
    this.countValue = 0;

    this.gameField = new Field(
      carrotCount,
      bugCount,
      carrotSize,
      () => this.started
    );
    this.gameField.setOnClickListener(this.onItemClick);

    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop(Reason.pause);
      } else {
        this.start();
        this.started = true;
      }
    });
  }

  onItemClick = item => {
    if (!this.started) {
      return;
    }

    if (item === ItemType.carrot) {
      this.countValue++;
      this.startCount();
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  setHidePopUpListener(onHidePopUp) {
    this.onHidePopUp = onHidePopUp;
  }

  // 게임 시작
  start() {
    if (this.gameField.gameField.innerHTML === "") {
      this.gameField.initImage();
    }
    this.showStopBtn();
    this.showTimerAndCount();
    this.startTimer();
    this.startCount();
    this.onHidePopUp();
    sound.playBackground();
  }

  showStopBtn() {
    const icon = this.gameBtn.querySelector(".fa-play");
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  }

  showTimerAndCount() {
    this.timer.classList.add("on");
    this.count.classList.add("on");
  }

  startTimer() {
    this.updateTimerText(this.gameDuration);
    this.timerValue = setInterval(() => {
      this.updateTimerText(--this.gameDuration);
      if (this.gameDuration <= 0) {
        this.stop(
          this.countValue === this.gameField.carrotCount
            ? Reason.win
            : Reason.lose
        );
        clearInterval(this.timerValue);
        return;
      }
    }, 1000);
  }

  updateTimerText(time) {
    const minute = Math.floor(time / 60);
    const second = Math.floor(time % 60);
    const minuteTime = `0${minute}`.substr(-2);
    const secondTime = `0${second}`.substr(-2);
    this.timer.innerHTML = `${minuteTime}:${secondTime}`;
  }

  startCount() {
    this.count.innerHTML = this.gameField.carrotCount - this.countValue;
    if (this.countValue === this.gameField.carrotCount) {
      this.stop(Reason.win);
    }
  }

  // 게임 정지
  stop(reason) {
    this.started = false;
    this.stopTimer();
    this.onGameStop && this.onGameStop(reason);
    sound.stopBackground();
    if (reason === Reason.pause) {
      this.showGameBtn();
    } else {
      this.hideGameBtn();
    }
  }

  stopTimer() {
    clearInterval(this.timerValue);
  }

  showGameBtn() {
    const icon = this.gameBtn.querySelector(".fa-pause");
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }

  hideGameBtn() {
    this.showGameBtn();
    this.gameBtn.style.visibility = "hidden";
  }

  // 게임 새로시작
  reStart() {
    this.gameDuration = this.GAME_DURATION;
    this.started = true;
    this.countValue = 0;
    this.gameBtn.style.visibility = "visible";
    this.gameField.initImage();
    this.start();
  }
}
