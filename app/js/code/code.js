//// ================================ Imports ======================================
import Settings from './settings';
import Styles from './styles';

///// ================================ Code ======================================
console.clear();

const xl = [456, 556],
  xs = [278, 350];

let styles;

(async function start(command) {
  const settings = new Settings('gfjh3352352sds532523lisd');
  switch (command) {
    case 'ui':
      figma.showUI(__html__, { themeColors: true });
      figma.ui.resize(...xs);
      figma.ui.postMessage({ settings: await settings.get() });
      figma.ui.onmessage = async (msg) => run(msg, settings);
      break;
  }
})(figma.command);

async function run(msg, settings) {
  if (msg.settings) await settings.set(msg.settings);
  if (msg.preparing) {
    styles = new Styles(await settings.get());
    preparing();
  }
  if (msg.remove) remove(msg.remove);

  if (msg.resize) resize(msg.resize);
  if (msg.cancel) styles.cancel();
}

async function preparing() {
  setTimeout(() => {
    const collection = styles.filterNodes(figma.root);
    setTimeout(() => styles.scanNodes(collection), 350);
  }, 350);
}

function remove(msg) {
  setTimeout(() => {
    styles.remove(msg);
    figma.ui.postMessage({ done: true });
  }, 350);
}

function resize(msg) {
  if (msg == 'xl') figma.ui.resize(...xl);
  else figma.ui.resize(...xs);
}

