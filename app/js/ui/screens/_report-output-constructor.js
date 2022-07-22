export default class OutputConstructor {
  constructor(nodes) {
    nodes.forEach((element) => {
      const contains = !element.classList.contains('--onRemove');
      if (!this[element.styleType] && contains) this[element.styleType] = [];
      if (contains) this[element.styleType].push(element.styleId);
    });
  }
}