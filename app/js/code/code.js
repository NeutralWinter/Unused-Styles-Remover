//// ================================ Imports ======================================
import Settings from './settings';
import Styles from './styles';
import Parser from './parser';

///// ================================ Code ======================================
console.clear();

const xl = [456, 556],
  xs = [278, 350];

const percent = (a, b) => Math.round((a / b) * 100);

let cancel = false;
let finded = {};

start(figma.command);

async function start(command) {
  const settings = new Settings('a');

  switch (command) {
    case 'ui':
      figma.showUI(__html__, { themeColors: true });
      figma.ui.resize(...xs);
      figma.ui.postMessage({ settings: await settings.get() });
      figma.ui.onmessage = async (msg) => run(msg, settings);
      break;
  }
}

async function run(msg, settings) {
  const params = await settings.get();
  const styles = new Styles(params);

  if (msg.settings) await settings.set(msg.settings);
  if (msg.preparing) {
    setTimeout(() => {
      let scans = new Parser(figma.root, styles);
      setTimeout(() => scanner(scans, styles), 350);
    }, 350);

    cancel = false;
    finded = {};
  }
  if (msg.resize) {
    if (msg.resize == 'xl') figma.ui.resize(...xl);
    else figma.ui.resize(...xs);
  }

  if (msg.cancel) cancel = true;
}

function scanner(nodes, styles) {
  const keys = Object.keys(styles);

  let i = 0;
  (function loop(j) {
    setTimeout(function () {
      const key = keys[i],
        styleArr = styles[key],
        style = styleArr[j];

      if (j == 0) {
        figma.ui.postMessage({
          loader: true,
          state: key,
        });
      }

      if (cancel) return;

      figma.ui.postMessage({
        progress: {
          percent: percent(j + 1, styles[key].length) + '%',
          queue: j + 1,
          length: styles[key].length,
        },
      });

      scaningNodes(nodes, key, style);

      if (i == keys.length - 1 && j == styleArr.length - 1) {
        if (Object.keys(finded).length != 0) figma.ui.postMessage({ report: finded });
        else figma.ui.postMessage({ nothing: true });

        return;
      }
      if (i < keys.length - 1 && j == styleArr.length - 1) {
        i++;
        loop(0);
      }
      if (j < styleArr.length - 1) loop(j + 1);
    }, 100);
  })(0);
}

function scaningNodes(nodes, key, style) {
  for (let i = 0; i < nodes[key].length; i++) {
    const node = nodes[key][i];

    if (node === style.id) return;
    else if (i == nodes[key].length - 1) {
      if (!finded[key]) finded[key] = [];
      finded[key].push({
        id: style.id,
        name: style.name,
      });
    }
  }
}
