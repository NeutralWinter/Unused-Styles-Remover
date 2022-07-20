export default class Effects {
  constructor(style) {
    const x = style.effects[0].offset ? style.effects[0].offset.x : false,
      y = style.effects[0].offset ? style.effects[0].offset.y : false;
    this.type = x === 0 && y === 0 ? 'SHADOW' : style.effects[0].type;

    this.angle = 0;
    if (x === 0 && y > 0) this.angle = 0;
    if (x < 0 && y > 0) this.angle = 45;
    if (x < 0 && y === 0) this.angle = 90;
    if (x < 0 && y < 0) this.angle = 135;
    if (x === 0 && y < 0) this.angle = 180;
    if (x > 0 && y < 0) this.angle = -135;
    if (x > 0 && y === 0) this.angle = -90;
    if (x > 0 && y > 0) this.angle = -45;
  }
}
