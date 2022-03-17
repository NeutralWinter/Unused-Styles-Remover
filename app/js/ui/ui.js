/// /================================ Imports ======================================
// scss
import '../../scss/index.scss';
// js
import './_ripple-settings';

/// / ================================ Code ======================================
let load = document.querySelector('.m-loadingScreen'),
  searchText = load.querySelector('.m-loadingScreen__text'),
  report = document.querySelector('.m-report'),
  counts = report.querySelectorAll('.c-counter');

let toggles = {
  fonts: document.getElementById('fonts'),
  colors: document.getElementById('colors'),
  effects: document.getElementById('effects'),
  grids: document.getElementById('grids'),
};

let settings;

onmessage = (msg) => {
  let message = msg.data.pluginMessage;

  //============================== Set Settings

  if ((typeof message === 'object' && message.type == undefined) || message == undefined) {
    console.log(message);
    let setSettings = message;
    settings =
      setSettings != undefined
        ? setSettings
        : {
            fonts: true,
            colors: true,
            effects: true,
            grids: true,
          };

    for (let key in settings) {
      if (settings[key]) {
        toggles[key].classList.add('--active');
        toggles[key].querySelector('.b-toggle__checkbox').checked = true;
      }
      toggleClick(key);
    }
    checkToggles(toggles);

    //============================== Set Count Of Removed Styles
  } else if (typeof message === 'object' && message.type != undefined) {
    let typeInfo = document.getElementById(`${message.type}-info`),
      child = typeInfo.querySelector('.c-counter__count');

    message.size !== 'NaN' ? (child.textContent = message.size) : (typeInfo.style.display = 'none');
  }

  //============================== Searching Screen

  switch (message) {
    case 'fadeIn':
      load.style.display = 'flex';

      setTimeout(() => {
        load.style.opacity = 1;
      }, 10);
      break;

    case 'fadeOut':
      report.style.display = 'block';
      report.style.opacity = 1;
      load.style.opacity = 0;

      setTimeout(() => {
        load.style.display = 'none';
      }, 400);
      break;

    case 'fonts' || 'colors' || 'effects' || 'grids':
      searchText.textContent = `Searching and removing unused ${message}...`;
      break;

    case 'done':
      setTimeout(() => {
        searchText.textContent = '';
      }, 400);
      break;
  }
};

function checkToggles(obj) {
  let check = Object.values(obj).some((element) => element.classList.contains('--active'));
  run.disabled = !check;
}

//============================== Click Events ==============================

function toggleClick(key) {
  document.getElementById(`${key}`).onclick = () => {
    if (toggles[key].querySelector('.b-toggle__checkbox').checked) {
      toggles[key].classList.add('--active');
      settings[key] = true;
    } else {
      toggles[key].classList.remove('--active');
      settings[key] = false;
    }

    checkToggles(toggles);

    parent.postMessage({ pluginMessage: { removeSettings: settings } }, '*');
  };
}

let run = document.querySelector('.b-removeButton');
run.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'remove', removeSettings: settings } }, '*');
};

let back = document.querySelector('.b-back');
back.onclick = () => {
  report.style.opacity = 0;
  setTimeout(() => {
    report.style.display = 'none';
    counts.forEach((item) => {
      item.style.display = 'flex';
    });
  }, 300);
};
