//// ================================ Imports ======================================
import Settings from './_settings';
import Styles from './styles/styles';
import { preparingToScan, removeStyles, resizeUI, cancelScaning } from './_commands';

///// ================================ Code ======================================
console.clear();

let loaded;
(async function start() {
  let command = figma.command ? 'run' : 'ui';
  const settings = new Settings('usr-settings');

  figma.root.setRelaunchData({ run: 'Starts with you custom properties, that you set in UI' });

  figma.showUI(__html__, { themeColors: true });
  resizeUI('xs');
  figma.ui.postMessage({ settings: await settings.get() });
  figma.ui.onmessage = async (msg) => {
    if (msg.onLoad) loaded = true;

    if (loaded && command === 'ui') {
      if (msg.onLoad) figma.ui.postMessage({ settingsScreen: true });
      runCommand(msg, settings);
    } else if (loaded && command === 'run') {
      runCommand({ preparing: true }, settings);
      command = 'ui';
    }
  };
})();

let styles;
async function runCommand(command, settings) {
  if (command.settings) await settings.set(command.settings);
  if (command.preparing) {
    styles = new Styles(await settings.get());
    preparingToScan(styles);
  }
  if (command.remove) removeStyles(command.remove, styles);
  if (command.resize) resizeUI(command.resize);
  if (command.cancel) cancelScaning(styles);
}
