class NextFigure {
  constructor(canvas, type, color) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.cellSize = 20;
    this.cellOffset = 1;

    this.type = type;
    this.color = color;

    this.shapes = {
      leftL: [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
      rightL: [
        [1, 1],
        [0, 1],
        [0, 1],
      ],
      leftZ: [
        [0, 1],
        [1, 1],
        [1, 0],
      ],
      rightZ: [
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      t: [
        [0, 1],
        [1, 1],
        [0, 1],
      ],
      cube: [
        [1, 1],
        [1, 1],
      ],
      line: [[1, 1, 1, 1]],
    };

    this.shape = this.shapes[this.type];
    this.render();
  }

  set(type, color) {
    this.type = type;
    this.color = color;

    this.shape = this.shapes[this.type];

    this.render();
  }

  render() {
    this.canvas.width = this.shape.length * (this.cellSize + this.cellOffset);
    this.canvas.height = this.shape[0].length * (this.cellSize + this.cellOffset);

    this.ctx.save();

    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'black';

    for (let x = 0; x < this.shape.length; x++) {
      for (let y = 0; y < this.shape[0].length; y++) {
        this.ctx.fillRect(
          this.cellSize * x + this.cellOffset * (x + 1),
          this.cellSize * y + this.cellOffset * (y + 1),
          this.cellSize,
          this.cellSize
        );
      }
    }
  
    for (let x = 0; x < this.shape.length; x++) {
      for (let y = 0; y < this.shape[0].length; y++) {
        if (this.shape[x][y]) {
          this.ctx.save();

          this.ctx.fillStyle = this.color;

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
