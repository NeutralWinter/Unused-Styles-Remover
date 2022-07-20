export default class ReportItems {
  outputStyles(obj) {
    let list = document.getElementById('template__list');
    for (const key in obj) {
      let clone = list.content.cloneNode(true),
        child = clone.querySelector('.c-removeItem'),
        parent = child.parentElement;

      const count = clone.querySelector('.js-count');
      count.textContent += `\u00A0(${obj[key].length})`;
      child.classList.add(`--${key}`);

      this.report.appendChild(clone);

      for (const props of obj[key]) {
        let item = parent.querySelector('#template__item');
        clone = item.content.cloneNode(true).querySelector('.c-removeItem');
        let text = clone.querySelector('.c-removeItem__text');

        this._setStyleProps(key, clone, props);

        clone.classList.add(`--${key}`);
        text.textContent = props.name;
        clone.styleId = props.id;
        clone.styleType = key;
        parent.appendChild(clone);
      }
    }

    this._setEvents();
  }

  _setStyleProps(key, node, props) {
    const preview = node.querySelector(`.c-removeItem__${key}`);
    switch (key) {
      case 'fonts':
        preview.style.fontFamily = props.fontFamily;
        preview.style.fontWeight = props.fontWeight;
        preview.style.fontStyle = props.fontStyle;
        preview.style.textDecoration = props.textDecoration;
        preview.style.textTransform = props.textTransform;
        break;
      case 'colors': {
        let background = this.__getBackground(props, preview);
        preview.style.background = background;
        break;
      }
      case 'effects': {
        const svg = preview.querySelector(`.c-removeItem__${props.type}`).children[0];
        preview.classList.add(`--${props.type}`);
        svg.style.transform = `rotate(${props.angle}deg)`;
        break;
      }
      case 'grids':
        preview.classList.add(`--${props.type}`);
        break;
    }
  }

  _setEvents() {
    this.items.titles.onRemoveEvent((title, childs) => {
      childs.forEach((child) => {
        let titleClass = title.classList.contains('--onRemove'),
          childClass = child.classList.contains('--onRemove');

        if (titleClass && !childClass) child.classList.add('--onRemove');
        if (!titleClass) child.classList.remove('--onRemove');
      });
    });

    this.items.items.onRemoveEvent((title, childs) => {
      let allRemoved = [...childs].every((item) => item.classList.contains('--onRemove'));

      if (allRemoved) title.classList.add('--onRemove');
      if (!allRemoved) title.classList.remove('--onRemove');
    });
  }

  __getBackground(props, preview) {
    let background = '';
    for (let i = props.colors.length - 1; i >= 0; i--) {
      const color = props.colors[i];

      if (color.type === 'SOLID') {
        background += `linear-gradient(0deg, rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}), rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}))`;
      } else if (color.type.indexOf('GRADIENT_') != -1) {
        background += `${color.gradientType}(`;

        if (color.gradientType === 'linear-gradient') background += `${color.degrees}deg,`;
        else if (color.gradientType === 'radial-gradient') background += `50% 50% at 50% 50%,`;
        else background += `from ${color.degrees}deg at 50% 50%,`;

        for (let j = 0; j < color.stops.length; j++) {
          const stop = color.stops[j];
          background += `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a}) ${stop.position}`;
          background += color.gradientType !== 'conic-gradient' ? '%' : 'deg';
          if (j < color.stops.length - 1) background += ', ';
        }

        background += ')';
      } else {
        preview.classList.changeLastOn('--image');
      }

      if (i > 0) background += ', ';
    }

    return background;
  }
}
