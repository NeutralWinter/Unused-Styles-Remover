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

function setInfo(item, count) {
  let child = item.querySelector('.c-counter__count');
  count !== 'NaN' ? (child.textContent = count) : (item.style.display = 'none');
}

function setParams(settings) {
  let toggles = {
    fonts: document.getElementById('fonts'),
    colors: document.getElementById('colors'),
    effects: document.getElementById('effects'),
    grids: document.getElementById('grids'),
  };
  let run = document.querySelector('.b-removeButton');

  function checkToggles(obj) {
    let check = Object.values(obj).some((element) => element.classList.contains('--active'));
    run.disabled = !check;
  }

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

  for (let key in settings) {
    if (settings[key]) {
      toggles[key].classList.add('--active');
      toggles[key].querySelector('.b-toggle__checkbox').checked = true;
    }

    toggleClick(key);
  }

  checkToggles(toggles);

  run.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'remove', removeSettings: settings } }, '*');
  };
}

onmessage = (msg) => {
  let message = msg.data.pluginMessage;

  if ((typeof message === 'object' && !message.type) || !message) {
    let settings;
    let setSettings = message;
    settings = !setSettings
      ? setSettings
      : {
          fonts: true,
          colors: true,
          effects: true,
          grids: true,
        };

    setParams(settings);
  } else if (typeof message === 'object' && message.type) {
    switch (message.type) {
      case 'fonts':
        setInfo(document.getElementById('fonts-info'), message.size);
        break;
      case 'colors':
        setInfo(document.getElementById('colors-info'), message.size);
        break;
      case 'effects':
        setInfo(document.getElementById('effects-info'), message.size);
        break;
      case 'grids':
        setInfo(document.getElementById('grids-info'), message.size);
        break;
    }
  }

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
    case 'fonts':
      searchText.textContent = 'Searching and removing unused fonts...';
      break;
    case 'colors':
      searchText.textContent = 'Searching and removing unused colors...';
      break;
    case 'effects':
      searchText.textContent = 'Searching and removing unused effects...';
      break;
    case 'grids':
      searchText.textContent = 'Searching and removing unused grids...';
      break;
    case 'done':
      setTimeout(() => {
        searchText.textContent = '';
      }, 400);
      break;
  }
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
