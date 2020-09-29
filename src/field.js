"use strict";
import * as sound from "./sound.js";

export const ItemType = Object.freeze({
  carrot: "carrot",
  bug: "bug",
});

// 필드 클래스
export class Field {
  constructor(carrotCount, bugCount, carrotSize, isGameRunning) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.carrotSize = carrotSize;
    this.isGameRunning = isGameRunning;
    this.gameField = document.querySelector(".game-field");
    this.gameField.addEventListener("click", event => {
      this.onFieldClick(event);
    });
  }

  setOnClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  initImage() {
    this.gameField.innerHTML = "";
    this.addImage("carrot", this.carrotCount, "./img/carrot.png");
    this.addImage("bug", this.bugCount, "./img/bug.png");
  }

  addImage(imgName, count, imgSrc) {
    const fieldWidth = this.gameField.offsetWidth;
    const fieldHeight = this.gameField.offsetHeight;
    const rangeX = fieldWidth - this.carrotSize;
    const rangeY = fieldHeight - this.carrotSize;

    for (let i = 0; i < count; i++) {
      const image = document.createElement("img");
      image.setAttribute("class", imgName);
      image.setAttribute("alt", imgName);
      image.setAttribute("src", imgSrc);

      const x = Math.floor(Math.random() * rangeX);
      const y = Math.floor(Math.random() * rangeY);

      image.style.left = `${x}px`;
      image.style.top = `${y}px`;

      this.gameField.appendChild(image);
    }
  }

  onFieldClick(event) {
    console.log(this.isGameRunning());
    if (!this.isGameRunning()) {
      return;
    }
    const target = event.target;
    if (target.matches(".carrot")) {
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches(".bug")) {
      sound.playBug();
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  }
}
