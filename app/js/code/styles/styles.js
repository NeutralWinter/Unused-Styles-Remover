import Fonts from './_fonts';
import Colors from './_colors';
import Effects from './_effects';
import { percent } from './__utils';

export default class Styles {
  constructor(settings) {
    const keys = Object.keys(settings);
    const styles = {
      fonts: figma.getLocalTextStyles(),
      colors: figma.getLocalPaintStyles(),
      effects: figma.getLocalEffectStyles(),
      grids: figma.getLocalGridStyles(),
    };

    for (const key of keys) {
      if (settings[key] && styles[key].length != 0) this[key] = styles[key];
    }
  }

  get properties() {
    const props = {};

    if (this.fonts && this.fonts.length != 0) props.fonts = ['textStyleId'];
    if (this.colors && this.colors.length != 0) props.colors = ['fillStyleId', 'strokeStyleId'];
    if (this.effects && this.effects.length != 0) props.effects = ['effectStyleId'];
    if (this.grids && this.grids.length != 0) props.grids = ['gridStyleId'];

    return props;
  }

  get unitedStyles() {
    return Object.values(this).flat();
  }

  filterNodes(root) {
    const properties = this.properties;
    const result = {};

    for (const key in this) result[key] = [];

    (function filter(node) {
      for (const key in properties) {
        for (let i = 0; i < properties[key].length; i++) {
          const prop = properties[key][i];
          if (node[prop] && node[prop] != '') result[key].push(node[prop]);
        }
      }

      if ('children' in node) {
        for (const child of node.children) {
          filter(child);
        }
      }
    })(root);

    return result;
  }

  scanNodes(nodes) {
    const self = this;
    const keys = Object.keys(self);
    const result = {};

    let i = 0;
    (function loop(j) {
      setTimeout(function () {
        const key = keys[i],
          styles = self[key],
          style = styles[j];

        const progressMessage = {};
        progressMessage.progress = percent(j + 1, self[key].length) + '%';
        progressMessage.queue = j + 1;
        progressMessage.length = self[key].length;

        const loaderMessage = {};
        loaderMessage.loader = true;
        loaderMessage.state = key;

        if (self.stop) return;

        if (j == 0) figma.ui.postMessage(loaderMessage);
        figma.ui.postMessage(progressMessage);

        scaningNodes(nodes, key, style);

        if (i == keys.length - 1 && j == styles.length - 1) {
          let length = 0;
          for (const st in result) length += result[st].length;

          if (length != 0) figma.ui.postMessage({ report: result });
          else figma.ui.postMessage({ nothing: true });

          return;
        }
        if (i < keys.length - 1 && j == styles.length - 1) {
          i++;
          loop(0);
        }
        if (j < styles.length - 1) loop(j + 1);
      }, 50);
    })(0);

    function scaningNodes(nodes, key, style) {
      for (let i = 0; i < nodes[key].length; i++) {
        const node = nodes[key][i];

        if (node === style.id) return;
        else if (i == nodes[key].length - 1) {
          if (!result[key]) result[key] = [];
          result[key].push(self.prepareToSend(style, key));
        }
      }
    }
  }

  prepareToSend(style, key) {
    const message = {};
    message.id = style.id;
    message.name = style.name;
    return this[`_${key}Return`](message, style);
  }

  remove(ids) {
    let values = Object.values(ids).flat();
    this.unitedStyles.map((style) => {
      if (values.includes(style.id)) console.log(style.name);
    });
  }

  cancel() {
    this.stop = true;
  }

  _fontsReturn(message, style) {
    const fonts = new Fonts(style);
    return { ...message, ...fonts };
  }

  _colorsReturn(message, style) {
    const colors = new Colors(style);
    return { ...message, ...colors };
  }

  _effectsReturn(message, style) {
    const effects = new Effects(style);
    return { ...message, ...effects };
  }

  _gridsReturn(message, style) {
    message.type = style.layoutGrids[0].pattern;
    return message;
  }
}
