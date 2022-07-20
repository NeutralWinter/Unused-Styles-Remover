import { degrees } from '../utils';

export default class Colors {
  constructor(style) {
    this.colors = [];

    for (const paint of style.paints) {
      if (paint.visible === true) {
        let color = { type: paint.type };

        if (color.type == 'SOLID') Object.assign(color, this._getSolid(paint));
        if (color.type.indexOf('GRADIENT_') != -1) Object.assign(color, this._getGradient(paint, color.type.replace(/\w+_/, '')));
        if (color.type === 'IMAGE');

        this.colors.push(color);
      }
    }
  }

  _getSolid(paint) {
    return {
      r: paint.color.r * 255,
      g: paint.color.r * 255,
      b: paint.color.r * 255,
      a: paint.opacity,
    };
  }

  _getGradient(paint, type) {
    let color = { stops: [] };

    if (type === 'DIAMOND') type = 'RADIAL';
    else if (type === 'ANGULAR') type = 'CONIC';
    color.gradientType = `${type.toLowerCase()}-gradient`;
    if (type === 'LINEAR' || type === 'CONIC') color.degrees = this._getGradientDeg(paint.gradientTransform);

    const lastStop = paint.gradientStops[paint.gradientStops.length - 1].position;
    for (const stop of paint.gradientStops) {
      const set = {
        r: stop.color.r * 255,
        g: stop.color.g * 255,
        b: stop.color.b * 255,
        a: stop.color.a,
      };
      set.position = type === 'CONIC' ? this._getStopDeg(stop.position, lastStop) : stop.position * 100;
      color.stops.push(set);
    }

    return color;
  }

  _getGradientDeg(transform) {
    const side = Math.atan2(-transform[1][0], transform[0][0]);

    let angle;
    if (side > 0) angle = degrees(Math.atan2(-transform[1][1], -transform[1][0]));
    else angle = degrees(Math.atan2(transform[1][1], transform[1][0]));

    return angle < 0 ? angle + 360 : angle;
  }

  _getStopDeg(currentStop, lastStop) {
    return (currentStop * 360) / lastStop;
  }
}
