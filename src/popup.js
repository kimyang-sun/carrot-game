"use strict";

// 팝업 클래스
export default class PopUp {
  constructor() {
    this.gamePopUp = document.querySelector(".game-popup");
    this.popUpText = document.querySelector(".popup-text");
    this.regameBtn = document.querySelector(".regame-btn");
    this.regameBtn.addEventListener("click", () => {
      this.onClick && this.onClick();
    });
  }

  setOnClickListener(onClick) {
    this.onClick = onClick;
  }

  showPopUp(text) {
    this.popUpText.innerHTML = text;
    this.gamePopUp.classList.add("on");
  }

  hidePopUp() {
    this.gamePopUp.classList.remove("on");
  }
}
