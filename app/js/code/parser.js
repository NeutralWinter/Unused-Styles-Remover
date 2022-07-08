export default class Parser {
  constructor(root, styles) {
    for (const key in styles) this[key] = [];
    this.preparing(root, styles);
  }

  preparing(node, styles) {
    this.getProps(node, styles.properties);
    if ('children' in node) {
      for (const child of node.children) {
        this.preparing(child, styles);
      }
    }
  }

  getProps(node, props) {
    for (const key in props) {
      for (let i = 0; i < props[key].length; i++) {
        const item = props[key][i];
        if (node[item] && node[item] != '') this[key].push(node[item]);
      }
    }
  }
}