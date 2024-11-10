import Actor from './Actor.js';
import Fruit from './Fruit.js';
import Greedy from './Greedy.js';
import HungryImgSrc from './assets/images/hungry.png';


export default class Hungry extends Actor {
  static HUNGRY_WIDTH = 64;
  static HUNGRY_HEIGHT = 57;

  constructor(x, y, lifepoints = 1, width, height) {
    super(x, y, HungryImgSrc, lifepoints);
    this.deltaX = 0;
    this.deltaY = 0;
    this.width = Hungry.HUNGRY_WIDTH;
    this.height = Hungry.HUNGRY_HEIGHT;
    this.speed = 1;
    this.fruitsEaten = 0; // Nombre de fruits mangés
    this.fruitsthreshold = 7; // le seuil a avoir pour que le hungry se dédouble
    this.target = null;
  }

  moveTowards(target) {
      const distanceX = target.x - this.x;
      const distanceY = target.y - this.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance !== 0) {
          this.deltaX = (distanceX / distance) * this.speed;
          this.deltaY = (distanceY / distance) * this.speed;
      } else {
          this.deltaX = 0;
          this.deltaY = 0;
      }

      this.x += this.deltaX;
      this.y += this.deltaY;
  }

}
