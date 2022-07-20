/// /================================ Imports ======================================
// scss
import '../../scss/index.scss';
// js
import './__DOM-mods';
import './_ripple-settings';
import SettingsScreen from './screens/settings';
import LoaderScreen from './screens/loader';
import ReportScreen from './screens/report';
import ResultScreen from './screens/result';

/// / ================================ Code ======================================

const settingsScreen = new SettingsScreen(),
  loaderScreen = new LoaderScreen(),
  reportScreen = new ReportScreen(),
  resultScreen = new ResultScreen(),
  cancel = document.querySelectorAll('.js-cancel');

window.onload = () => {
  settingsScreen.setScreen();
  parent.postMessage({ pluginMessage: { onLoad: true } }, '*');

  onmessage = (msg) => {
    const message = msg.data.pluginMessage;

    if (message.settings) settingsScreen.setSettings(message);
    if (message.home) resetUI();

    if (message.preparing) loaderScreen.setScreen();
    if (message.loader) loaderScreen.changeState(message.state);
    if (message.progress) loaderScreen.changeProgress(message);

    if (message.report) {
      reportScreen.setScreen();
      reportScreen.outputStyles(message.report);
    }

    if (message.done) resultScreen.setScreen(message.done);
    if (message.nothing) resultScreen.setScreen();
  };
};

function resetUI() {
  settingsScreen.setScreen();
  setTimeout(() => {
    loaderScreen.loader.classList.changeLastOn('--preparing');
    resultScreen.result.classList.changeLastOn('--removing');
    loaderScreen.progress.style.width = 0;
    loaderScreen.scanningCount.textContent = resultScreen.removedStyles.textContent = '';
  }, 300);

  const lists = reportScreen.report.querySelectorAll('.c-removeList');
  setTimeout(() => lists.forEach((list) => list.remove()), 300);
}

cancel.forEach((button) => {
  button.onclick = () => parent.postMessage({ pluginMessage: { cancel: true, resize: 'xs' } }, '*');
});
