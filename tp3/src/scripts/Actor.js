import Element from './Element.js';

export default class Actor extends Element {
  constructor(x, y, imageSrc, width, height, lifepoints = 3) {
    super(x, y, imageSrc, width, height);
    this.lifepoints = lifepoints;
  }
}
