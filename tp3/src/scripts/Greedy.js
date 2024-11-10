import Actor from './Actor.js';
import GreedyImgSrc from './assets/images/greedy.png';

export default class Greedy extends Actor {
  constructor(x, y, lifepoints = 3, width = 64, height = 64) {
    super(x, y, GreedyImgSrc, lifepoints);
    this.deltaX = 0;
    this.deltaY = 0;
    this.width = width;
    this.height = height;
    this.points = 0;
  }

  moveLeft() {
    this.deltaX = -5;   // le déplacement se fera vers la gauche, par pas de 10px
  }

  moveRight() {
    this.deltaX = 5;   // le déplacement se fera vers la droite, par pas de 10px
  }

  moveUp() {
    this.deltaY = -5;
  }

  moveDown() {
    this.deltaY = 5;
  }

  handleMoveKeys(keyManager) {
    this.deltaY = 0;
    this.deltaX = 0;
    if (keyManager.left) {
      this.moveLeft();
    } else if (keyManager.right) {
      this.moveRight();
    } else if (keyManager.up) {
      this.moveUp();
    } else if (keyManager.down) {
      this.moveDown();
    }
  }

  move(box) {
    const nextY = this.y + this.deltaY;
    const nextX = this.x + this.deltaX;
    if (nextX >= 0 && nextX + this.width <= box.width && nextY >= 0 && nextY + this.height <= box.height) {
      this.x = nextX;
      this.y = nextY;
    }
  }
}
