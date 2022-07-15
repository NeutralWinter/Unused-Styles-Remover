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

const degrees = (radians) => radians * (180 / Math.PI);
const arcctg = (x) => Math.PI / 2 - Math.atan(x);

let a = figma.currentPage.selection[0].fills[0].gradientTransform;
let x1 = Math.acos(a[0][0]);
let x2 = -Math.asin(a[1][0]);

let y1 = Math.asin(a[0][1]);
let y2 = Math.acos(a[1][1]);

let atan1 = Math.atan(a[0][2]);
let atan2 = Math.atan(a[1][2]);

console.log(figma.currentPage.selection[0]);
console.log(a);
console.log(degrees(x1 - atan1), degrees(y1 - atan2), atan1);
console.log(degrees(x2 - atan1), degrees(y2 - atan2), atan2);
// console.log(a[1][0], a[1][1], a[1][2]);
// console.log(Math.atan(a[0][2] - 1));
// console.log(degrees(Math.atan(a[0][2] - 1)));
// console.log(degrees(Math.atan(a[1][2] / a[0][2])));
// console.log(degrees(Math.atan(Math.PI / 2 - a[0][2] / a[1][2])));
// console.log(degrees(Math.atan(Math.PI / 2 - a[1][2] / a[0][2])));
// console.log(degrees(Math.acos(a[0][0])), degrees(Math.asin(a[0][1])), degrees(Math.atan((a[1][0] - a[1][1])/(a[0][0] - a[0][1]))));
// console.log(degrees(Math.asin(1/a[1][0])), degrees(Math.acos(1/a[1][1])), degrees(Math.atan(a[1][2])));
