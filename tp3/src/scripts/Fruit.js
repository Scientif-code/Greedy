import Element from './Element.js';
import PommeImgSrc from './assets/images/pomme.png';
import CitronImgSrc from './assets/images/citron.png';
import AnanasImgSrc from './assets/images/ananas.png';

const FRUIT_IMAGES = [PommeImgSrc, CitronImgSrc, AnanasImgSrc];

const randomImage = ( ) => {
  const randomIndex = Math.floor(Math.random() * FRUIT_IMAGES.length);
  return FRUIT_IMAGES[randomIndex];
}

export default class Fruit extends Element {
  static FRUIT_WIDTH = 64;
  static FRUIT_HEIGHT = 64;

  constructor(x, y, width = Fruit.FRUIT_WIDTH, height = Fruit.FRUIT_HEIGHT) {
    super(x, y, randomImage(), width, height);
  }

}
