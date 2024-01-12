class Figure {
  constructor({
    map,
    cellOffset,
    cellSize,
    ctx,
    type,
    color,
    setMapCell,
    checkFigureColission,
  }) {
    this.ctx = ctx;
    this.color = color;
    this.type = type;
    this.map = map;
    this.cellOffset = cellOffset;
    this.cellSize = cellSize;
    this.setMapCell = setMapCell;
    this.checkFigureColission = checkFigureColission;
    this.rotation = 0;

    this.shapes = {
      leftL: [
        [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
        [
          [1, 1, 1],
          [0, 0, 1],
        ],
        [
          [1, 1],
          [1, 0],
          [1, 0],
        ],

        [
          [1, 0, 0],
          [1, 1, 1],
        ],
      ],
      rightL: [
        [
          [1, 1],
          [0, 1],
          [0, 1],
        ],
        [
          [1, 1, 1],
          [1, 0, 0],
        ],
        [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
        [
          [0, 0, 1],
          [1, 1, 1],
        ],
      ],
      leftZ: [
        [
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        [
          [1, 1, 0],
          [0, 1, 1],
        ],
        [
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        [
          [1, 1, 0],
          [0, 1, 1],
        ],
      ],
      rightZ: [
        [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        [
          [0, 1, 1],
          [1, 1, 0],
        ],
        [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        [
          [0, 1, 1],
          [1, 1, 0],
        ],
      ],
      t: [
        [
          [0, 1],
          [1, 1],
          [0, 1],
        ],
        [
          [0, 1, 0],
          [1, 1, 1],
        ],
        [
          [1, 0],
          [1, 1],
          [1, 0],
        ],
        [
          [1, 1, 1],
          [0, 1, 0],
        ],
      ],
      cube: [
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
      ],
      line: [
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]],
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]],
      ],
    };

    this.shape = this.shapes[this.type][this.rotation];

    this.x = Math.floor((this.map.length - this.shape.length) / 2);
    this.y = -(this.shape[0].length + 1);
  }

  setX(x) {
    if (x < 0) {
      this.x = 0;

      return;
    }

    if (x + (this.shape.length - 1) > this.map.length - 1) {
      this.x = this.map.length - (this.shape.length - 1) - 1;

      return;
    }

    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  rotate() {
    const newRotation = (this.rotation + 1) % 4;
    const newShape = this.shapes[this.type][newRotation];
    const newFigure = {
      x: this.x,
      y: this.y,
      shape: newShape,
    };

    if (this.x + (newShape.length - 1) > this.map.length - 1) {
      this.x = this.map.length - (newShape.length - 1) - 1;
    }

    if (this.checkFigureColission(newFigure, "x", 1) || this.checkFigureColission(newFigure, "y", 1)) {
      return;
    }

    this.rotation = newRotation;
    this.shape = newShape;
  }

  attachToMap() {
    for (let shapeX = 0; shapeX < this.shape.length; shapeX++) {
      for (let shapeY = 0; shapeY < this.shape[0].length; shapeY++) {
        if (this.shape[shapeX][shapeY]) {
          this.setMapCell(this.x + shapeX, this.y + shapeY, this.color);
        }
      }
    }
  }

  render() {
    for (let shapeX = 0; shapeX < this.shape.length; shapeX++) {
      for (let shapeY = 0; shapeY < this.shape[0].length; shapeY++) {
        if (this.shape[shapeX][shapeY]) {
          this.ctx.save();

          this.ctx.fillStyle = this.color;

          const x = this.x + shapeX;
          const y = this.y + shapeY;

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
}
