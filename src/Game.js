class Game {
  constructor(canvas) {
    // Canvas
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    // Game variablles
    this.cellSize = 20;
    this.cellCountX = 10;
    this.cellCountY = 20;
    this.cellOffset = 1;

    this.score = 0;
    this.time = 0;

    this.gameTickMs = 1000;

    this.map = [];

    this.colors = {
      cyan: "#00ffff",
      yellow: "#ffff00",
      purple: "#800080",
      green: "#00ff00",
      red: "#ff0000",
      blue: "#0000ff",
      orange: "#ff7f00",
      gray: "#7f7f7f",
      black: "#000000",
    };

    this.cellColors = [
      this.colors.cyan,
      this.colors.yellow,
      this.colors.purple,
      this.colors.green,
      this.colors.red,
      this.colors.blue,
      this.colors.orange,
    ];

    this.figureTypes = {
      leftL: "leftL",
      rightL: "rightL",
      leftZ: "leftZ",
      rightZ: "rightZ",
      t: "t",
      cube: "cube",
      line: "line",
    };

    this.nextFigureType = Object.keys(this.figureTypes)[
      Math.round(Math.random() * (Object.keys(this.figureTypes).length - 1))
    ];
    this.nextFigureColor =
      this.cellColors[Math.round(Math.random() * (this.cellColors.length - 1))];

    this.keyCodes = {
      arrowDown: 40,
      arrowUp: 38,
      arrowLeft: 37,
      arrowRight: 39,
    };

    // Flags
    this.isFigureFast = false;
    this.isFinish = false;

    // Canvas setup
    this.canvas.width =
      this.cellSize * this.cellCountX + this.cellOffset * this.cellCountX + 1;
    this.canvas.height =
      this.cellSize * this.cellCountY + this.cellOffset * this.cellCountY + 1;

    // Map setup;
    for (let x = 0; x < this.cellCountX; x++) {
      const row = [];

      for (let y = 0; y < this.cellCountY; y++) {
        row.push(null);
      }

      this.map.push(row);
    }

    this.init();
  }

  setMapCell(x, y, value) {
    if (
      x > this.map.length - 1 ||
      x < 0 ||
      y > this.map[0].length - 1 ||
      y < 0
    ) {
      return;
    }

    this.map[x][y] = value;
  }

  drawCellBorders() {
    this.ctx.save();

    this.ctx.fillStyle = this.colors.gray;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.colors.black;

    for (let x = 0; x < this.cellCountX; x++) {
      for (let y = 0; y < this.cellCountY; y++) {
        this.ctx.fillRect(
          this.cellSize * x + this.cellOffset * (x + 1),
          this.cellSize * y + this.cellOffset * (y + 1),
          this.cellSize,
          this.cellSize
        );
      }
    }
  }

  drawMap() {
    for (let x = 0; x < this.cellCountX; x++) {
      for (let y = 0; y < this.cellCountY; y++) {
        const cell = this.map[x][y];

        if (cell) {
          this.ctx.save();

          this.ctx.fillStyle = cell;

          this.ctx.fillRect(
            this.cellSize * x + this.cellOffset * (x + 1),
            this.cellSize * y + this.cellOffset * (y + 1),
            this.cellSize,
            this.cellSize
          );

          this.ctx.restore();
        }
      }
    }
  }

  fixFigure() {
    this.figure.attachToMap();
    this.addFigure();
    this.gameTick();
  }

  addFigure() {
    const type = this.nextFigureType;
    const color = this.nextFigureColor;

    const { ctx, map, setMapCell, cellSize, cellOffset, checkFigureColission } =
      this;

    this.figure = new Figure({
      ctx,
      map,
      setMapCell,
      type,
      color,
      cellSize,
      cellOffset,
      checkFigureColission,
    });

    this.nextFigureType = Object.keys(this.figureTypes)[
      Math.round(Math.random() * (Object.keys(this.figureTypes).length - 1))
    ];
    this.nextFigureColor =
      this.cellColors[Math.round(Math.random() * (this.cellColors.length - 1))];

    console.log("helolo");
  }

  registerEventListeners() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case this.keyCodes.arrowDown:
          this.gameTick();

          this.isFigureFast = true;

          const onKeyUp = (e) => {
            if (e.keyCode == this.keyCodes.arrowDown) {
              this.isFigureFast = false;

              document.removeEventListener("keyup", onKeyUp);
            }
          };

          document.addEventListener("keyup", onKeyUp);

          break;
        case this.keyCodes.arrowUp:
          this.figure.rotate();

          break;
        case this.keyCodes.arrowLeft:
          if (!this.checkFigureColission(this.figure, "x", -1)) {
            this.figure.setX(this.figure.x - 1);
          }

          break;
        case this.keyCodes.arrowRight:
          if (!this.checkFigureColission(this.figure, "x", 1)) {
            this.figure.setX(this.figure.x + 1);
          }

          break;
      }
    });
  }

  render() {
    this.drawCellBorders();
    this.drawMap();
    this.figure.render();
  }

  checkFigureColission(figure, axis, direction) {
    const { x, y } = figure;

    for (let shapeX = 0; shapeX < figure.shape.length; shapeX++) {
      for (let shapeY = 0; shapeY < figure.shape[0].length; shapeY++) {
        // If colission with down border of game field
        if (y + shapeY + 1 > this.map[0].length - 1) {
          return true;
        }

        let nextCell = null;

        try {
          if (axis === "x") {
            nextCell = this.map[x + shapeX + direction][y + shapeY];
          } else if (axis === "y") {
            nextCell = this.map[x + shapeX][y + shapeY + direction];
          }
        } catch (e) {}

        if (nextCell && figure.shape[shapeX][shapeY]) {
          return true;
        }
      }
    }

    return false;
  }

  getFullRows() {
    const fullRows = [];

    for (let y = 0; y < this.map[0].length; y++) {
      let prevCell = 1;
      let isFull = false;

      for (let x = 0; x < this.map.length; x++) {
        const cell = this.map[x][y];

        if (cell && prevCell) {
          isFull = true;
        } else {
          isFull = false;

          break;
        }

        prevCell = cell;
      }

      if (isFull) {
        fullRows.push(y);
      }
    }

    return fullRows;
  }

  transposeMap(array) {
    const newArray = [];

    for (let y = 0; y < array[0].length; y++) {
      const row = [];

      for (let x = 0; x < array.length; x++) {
        row.push(array[x][y]);
      }

      newArray.push(row);
    }

    return newArray;
  }

  deleteFullRows(rows) {
    const newMap = this.transposeMap(this.map);

    rows.forEach((y) => {
      const newRow = [];
      for (let x = 0; x < 10; x++) {
        newRow.push(null);
      }

      newMap.splice(y, 1);
      newMap.unshift(newRow);
    });

    this.map = this.transposeMap(newMap);
  }

  finishGame() {
    alert("Ты лох. И кенты твои такие же!");

    setTimeout(() => {
      this.resetGame();
    }, 1000);
  }

  resetGame = () => {
    // Map reset;
    this.map = [];

    for (let x = 0; x < this.cellCountX; x++) {
      const row = [];

      for (let y = 0; y < this.cellCountY; y++) {
        row.push(null);
      }

      this.map.push(row);
    }

    // Flags reset
    this.isFinish = false;
    this.isFigureFast = false;

    this.score = 0;
    this.time = 0;

    // Start
    this.addFigure();
  };

  gameTick() {
    // Finish game
    if (this.isFinish) {
      return;
    }

    // Check if finish
    if (this.checkFigureColission(this.figure, "y", 1) && this.figure.y <= 0) {
      this.finishGame();

      this.isFinish = true;

      return;
    }

    // Check colissions
    if (this.checkFigureColission(this.figure, "y", 1)) {
      this.fixFigure();
      this.gameTick();
    }

    // Check if row is full
    const fullRows = this.getFullRows();

    if (fullRows.length) {
      this.score += 5 * fullRows.length + fullRows.length;

      this.deleteFullRows(fullRows);
    }

    if (this.figure) {
      this.figure.y += 1;
    }
  }

  startGame() {
    this.addFigure();

    // TICKS
    // Render tick
    const tick = () => {
      this.render();

      this.renderTickTimeoutId = setTimeout(tick, 1000 / 60);
    };

    tick();

    // Game tick
    const gameTick = () => {
      this.gameTickTimeoutId = setTimeout(gameTick, this.gameTickMs);

      if (!this.isFigureFast) {
        this.gameTick();
      }
    };

    gameTick();

    setInterval(() => {
      if (this.isFinish) {
        return;
      }

      this.time += 1;
    }, 1000);
  }

  init() {
    this.registerEventListeners();

    this.startGame();
  }
}
