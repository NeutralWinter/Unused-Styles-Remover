/// /================================ Imports ======================================
// scss
import '../../scss/index.scss';
// js
import './_ripple-settings';
import Toggles from './toggles';
import Constructor from './constructor';

/// / ================================ Code ======================================

DOMTokenList.prototype.changeLastOn = function (target) {
  this.remove(this[this.length - 1]);
  this.add(target);
};

NodeList.prototype.onRemove = function (callback) {
  this.forEach((element) => {
    let button = element.querySelector('.b-iconButton');
    button.onclick = function () {
      element.classList.toggle('--onRemove');

      callback(element);
    };
  });
};

const body = document.body;

const loader = document.querySelector('.m-loader'),
  scanningCount = loader.querySelector('.m-loader__scanningCount'),
  progress = loader.querySelector('.b-progressBar__progress');

const report = document.querySelector('.m-report'),
  error = report.querySelector('.c-error');

// const result = document.querySelector('.m-result');

const toggles = new Toggles(),
  cancel = document.querySelectorAll('.js-cancel'),
  done = document.querySelector('.js-confirm');

onmessage = (msg) => {
  const message = msg.data.pluginMessage;

  if (message.settings) toggles.settings(message);

  if (message.loader) loader.classList.changeLastOn(`--${message.state}`);
  if (message.progress) {
    progress.style.width = message.progress.percent;
    scanningCount.textContent = `${message.progress.queue} of ${message.progress.length}`;
  }

  if (message.report) {
    parent.postMessage({ pluginMessage: { resize: 'xl' } }, '*');
    body.classList.changeLastOn('--report');
    setTimeout(() => loader.classList.changeLastOn('--preparing'), 300);

    output(message.report);

    let titles = report.querySelectorAll('.js-title'),
      items = report.querySelectorAll('.js-item');

    titles.onRemove((element) => {
      let title = element.parentElement.querySelector('.js-title'),
        childs = element.parentElement.querySelectorAll('.js-item');

      childs.forEach((child) => {
        let titleClass = title.classList.contains('--onRemove'),
          childClass = child.classList.contains('--onRemove');

        if (titleClass && !childClass) child.classList.add('--onRemove');
        if (!titleClass) child.classList.remove('--onRemove');
      });
    });

    items.onRemove((element) => {
      let title = element.parentElement.querySelector('.js-title'),
        childs = element.parentElement.querySelectorAll('.js-item');

      let allRemoved = [...childs].every((item) => item.classList.contains('--onRemove'));

      if (allRemoved) title.classList.add('--onRemove');
      if (!allRemoved) title.classList.remove('--onRemove');
    });

    console.log(message.report);
  }
  if (message.nothing) body.classList.changeLastOn('--result');
};

function output(obj) {
  let list = document.getElementById('template__list');

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

      text.textContent = props.name;
      clone.styleId = props.id;
      clone.styleType = key;
      parent.appendChild(clone);
    }
  }
}

toggles.run.onclick = () => {
  parent.postMessage({ pluginMessage: { preparing: true } }, '*');
  body.classList.add('--loader');
};

cancel.forEach((button) => {
  button.onclick = () => {
    body.classList.changeLastOn('--options');
    setTimeout(() => {
      loader.classList.changeLastOn('--preparing');
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
  }
  // else
};
