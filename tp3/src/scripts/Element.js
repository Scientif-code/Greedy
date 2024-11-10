export default class Element {
  constructor(x, y, imageSrc, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = this.createImage(imageSrc);
  }

  createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y);
  }

  collisionWith(element) {
    const P1x = Math.max(this.x, element.x);
    const P1y = Math.max(this.y, element.y);
    const P2x = Math.min(this.x + this.width, element.x + element.width);
    const P2y = Math.min(this.y + this.height, element.y + element.height);
    return P1x < P2x && P1y < P2y;
  }

}
