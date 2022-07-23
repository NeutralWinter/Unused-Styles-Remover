export function preparingToScan(styles) {
  if (Object.keys(styles).length === 0) {
    figma.ui.postMessage({ home: true });
    return figma.notify('There are no selected style types in this document');
  }

  figma.ui.postMessage({ preparing: true });
  setTimeout(() => {
    const collection = styles.filterNodes(figma.root);
    console.log(collection);
    setTimeout(() => styles.scanNodes(collection), 350);
  }, 350);
}

export function removeStyles(msg, styles) {
  setTimeout(() => {
    styles.remove(msg);
    figma.ui.postMessage({ done: msg });
  }, 350);
}

export function resizeUI(msg) {
  const xl = [456, 556],
    xs = [278, 350];

  if (msg == 'xl') figma.ui.resize(...xl);
  else figma.ui.resize(...xs);
}

export function cancelScaning(styles) {
  figma.ui.postMessage({ home: true });
  styles.cancel();
}
