"use strict";
import PopUp from "./popup.js";
import { GameBuilder, Reason } from "./game.js";
import * as sound from "./sound.js";

// 게임 팝업 클래스
const gamePopUpBanner = new PopUp();

// 게임 클래스
const game = new GameBuilder()
  .gameDuration(5)
  .carrotCount(15)
  .bugCount(5)
  .carrotSize(80)
  .build();
game.setGameStopListener(reason => {
  let message;
  switch (reason) {
    case Reason.pause:
      message = "Replay❓";
      sound.playAlert();
      break;
    case Reason.win:
      message = "You Won 🎉";
      sound.playWin();
      break;
    case Reason.lose:
      message = "You Lost 💀";
      sound.playBug();
      break;
    default:
      throw new Error("not valued reason");
  }
  gamePopUpBanner.showPopUp(message);
});

gamePopUpBanner.setOnClickListener(() => {
  game.reStart();
});

game.setHidePopUpListener(() => {
  gamePopUpBanner.hidePopUp();
});
