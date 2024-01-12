const canvas = document.querySelector("#canvas");
const nextFigureCanvas = document.querySelector("#nextFigureCanvas");

const Tetris = new Game(canvas);
const nextFigure = new NextFigure(
  nextFigureCanvas,
  Tetris.nextFigureType,
  Tetris.nextFigureColor
);

const timeElem = document.querySelector("#time");
const scoreElem = document.querySelector("#score");

let lastTime = 0;
let lastScore = 0;
let lastType = "";

setInterval(() => {
  if (Tetris.time != lastTime) {
    const minutes = Math.floor(Tetris.time / 60);
    const seconds = Tetris.time % 60;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    timeElem.textContent = formattedMinutes + ":" + formattedSeconds;
  }

  if (Tetris.score != lastScore) {
    scoreElem.textContent = Tetris.score;
  }

  if (lastType != Tetris.nextFigureType) {
    nextFigure.set(Tetris.nextFigureType, Tetris.nextFigureColor);
  }

  lastType = Tetris.nextFigureType;
  lastTime = Tetris.time;
  lastScore = Tetris.score;
}, 1000 / 60);
