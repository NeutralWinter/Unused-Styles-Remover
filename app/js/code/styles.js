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
      if (settings[key]) this[key] = styles[key];
    }
  }

  get properties() {
    const props = {};

    if (this.fonts) props.fonts = ['textStyleId'];
    if (this.colors) props.colors = ['fillStyleId', 'strokeStyleId'];
    if (this.effects) props.effects = ['effectStyleId'];
    if (this.grids) props.grids = ['gridStyleId'];

    return props;
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

    const percent = (a, b) => Math.round((a / b) * 100);

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
          if (Object.keys(self).length != 0) figma.ui.postMessage({ report: result });
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
          result[key].push(self.prepareObj(style, key));
        }
      }
    }
  }

  prepareObj(style, key) {
    const message = {};

    message.id = style.id;
    message.name = style.name;
    switch (key) {
      case 'fonts':
        message.fontFamily = style.fontName.family;
        message.fontStyle = style.fontName.style;
        message.textDecoration = style.textDecoration;
        message.textCase = style.textCase;
        break;
    }

    return message;
  }

  remove(ids) {
    for (const key in ids) {
      for (const id of ids[key]) {
        for (const style of this[key]) {
          if (style.id === id) console.log(style.name);
        }
      }
    }
  }

  cancel() {
    this.stop = true;
  }
}
