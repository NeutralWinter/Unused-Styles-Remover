/// /================================ Imports ======================================
// scss
import '../../scss/index.scss';
// js
import './__DOM-mods';
import './_ripple-settings';
import Toggles from './_toggles';
import Constructor from './_constructor';

/// / ================================ Code ======================================

const body = document.body;

const loader = document.querySelector('.m-loader'),
  scanningCount = loader.querySelector('.m-loader__scanningCount'),
  progress = loader.querySelector('.b-progressBar__progress');

const report = document.querySelector('.m-report'),
  error = report.querySelector('.c-error');

const result = document.querySelector('.m-result');

const toggles = new Toggles(),
  cancel = document.querySelectorAll('.js-cancel'),
  done = document.querySelector('.js-confirm');

onmessage = (msg) => {
  const message = msg.data.pluginMessage;

  if (message.settings) toggles.settings(message);

  if (message.loader) loader.classList.changeLastOn(`--${message.state}`);

  if (message.progress) {
    if (message.queue == 1) progress.classList.remove('--animation');
    else if (!progress.classList.contains('--animation')) progress.classList.add('--animation');
    progress.style.width = message.progress;
    scanningCount.textContent = `${message.queue} of ${message.length}`;
  }

  if (message.report) {
    parent.postMessage({ pluginMessage: { resize: 'xl' } }, '*');
    body.classList.changeLastOn('--report');
    setTimeout(() => loader.classList.changeLastOn('--preparing'), 300);
    output(message.report);
    setItemsEvents();
  }

  if (message.done) result.classList.changeLastOn('--done');

  if (message.nothing) body.classList.changeLastOn('--result');
};

function output(obj) {
  let list = document.getElementById('template__list');
  console.log(obj);
  for (const key in obj) {
    let clone = list.content.cloneNode(true),
      child = clone.querySelector('.c-removeItem'),
      parent = child.parentElement;

    child.classList.add(`--${key}`);

    report.appendChild(clone);

    for (const props of obj[key]) {
      let item = parent.querySelector('#template__item');
      clone = item.content.cloneNode(true).querySelector('.c-removeItem');
      let text = clone.querySelector('.c-removeItem__text');

      setStyleProps(key, clone, props);

      clone.classList.add(`--${key}`);
      text.textContent = props.name;
      clone.styleId = props.id;
      clone.styleType = key;
      parent.appendChild(clone);
    }
  }
}

function setStyleProps(key, node, props) {
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
      let background = getBackground(props);
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

function getBackground(props) {
  let background = '';
  for (let i = props.colors.length - 1; i >= 0; i--) {
    const color = props.colors[i];

    if (!color.gradientType) {
      background += `linear-gradient(0deg, rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}), rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}))`;
      if (i > 0) background += ', ';
    } else {
      background += i === props.colors.length - 1 ? `${color.gradientType}(${color.degrees}deg,` : `,${color.gradientType}(${color.degrees}deg,`;
      for (let j = 0; j < color.stops.length; j++) {
        const stop = color.stops[j];
        background += `rgba(${stop.r}, ${stop.g}, ${stop.b}, ${stop.a}) ${stop.position}%`;
        if (j < color.stops.length) background += ', ';
      }
      background += ')';
    }
  }

  return background;
}

function setItemsEvents() {
  let titles = report.querySelectorAll('.js-title'),
    items = report.querySelectorAll('.js-item');

  titles.onRemoveEvent((title, childs) => {
    childs.forEach((child) => {
      let titleClass = title.classList.contains('--onRemove'),
        childClass = child.classList.contains('--onRemove');

      if (titleClass && !childClass) child.classList.add('--onRemove');
      if (!titleClass) child.classList.remove('--onRemove');
    });
  });

  items.onRemoveEvent((title, childs) => {
    let allRemoved = [...childs].every((item) => item.classList.contains('--onRemove'));

    if (allRemoved) title.classList.add('--onRemove');
    if (!allRemoved) title.classList.remove('--onRemove');
  });
}

toggles.run.onclick = () => {
  parent.postMessage({ pluginMessage: { preparing: true } }, '*');
  body.classList.changeLastOn('--loader');
};

cancel.forEach((button) => {
  button.onclick = () => {
    body.classList.changeLastOn('--options');
    setTimeout(() => {
      loader.classList.changeLastOn('--preparing');
      result.classList.remove('--done');
      progress.style.width = 0;
    }, 300);
    parent.postMessage({ pluginMessage: { resize: 'xs' } }, '*');
    parent.postMessage({ pluginMessage: { cancel: true } }, '*');

    const lists = report.querySelectorAll('.c-removeList');
    setTimeout(() => lists.forEach((list) => list.remove()), 300);
  };
});

let alert;
done.onclick = () => {
  const items = report.querySelectorAll('.js-item');

  let output = new Constructor(items);

  if (Object.keys(output).length == 0) {
    if (!alert) {
      alert = true;
      error.classList.toggle('--alert');
      setTimeout(() => {
        error.classList.toggle('--alert');
        alert = false;
      }, 3300);
    }
  } else {
    parent.postMessage({ pluginMessage: { resize: 'xs' } }, '*');
    result.classList.add('--removing');
    body.classList.changeLastOn('--result');
    parent.postMessage({ pluginMessage: { remove: output } }, '*');
  }
};
