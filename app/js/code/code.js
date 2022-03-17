/* eslint-disable no-undef */
//// ================================ Imports ======================================

///// ================================ Code ======================================
console.clear();

let styles = {
  font: figma.getLocalTextStyles(),
  color: figma.getLocalPaintStyles(),
  effect: figma.getLocalEffectStyles(),
  grid: figma.getLocalGridStyles(),
};

let figmaRoot = figma.root,
  count = 0;

let wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

run(figma.command);

function removeStyle(type) {
  if (styles[type].length > 0) {
    findAndRemove(type);

    figma.notify(`${count} ${type}s removed`, {
      timeout: 10000000,
    });
    figma.closePlugin();
  } else {
    figma.closePlugin(`There are no ${type}s styles in this document`);
  }
}

async function run(command) {
  switch (command) {
    case 'font' || 'color' || 'effect' || 'grid':
      removeStyle(command);
      break;
    case 'all':
      let check = Object.values(styles).every((element) => element.length == 0);

      if (check) {
        figma.closePlugin(`There are no styles in this document at all`);
      } else {
        let removedItems = '';
        if (styles.font.length > 0) {
          removeUnusedFonts();
          removedItems += `${count} fonts`;
        } else {
          figma.notify(`There are no fonts styles in this document`);
        }
        count = 0;

        if (styles.color.length > 0) {
          removeUnusedColors();
          removedItems += removedItems == '' ? `${count} colors` : `, ${count} colors`;
        } else {
          figma.notify(`There are no color styles in this document`);
        }
        count = 0;

        if (styles.effect.length > 0) {
          removeUnusedEffects();
          removedItems += removedItems == '' ? `${count} effects` : `, ${count} effects`;
        } else {
          figma.notify(`There are no effect styles in this document`);
        }
        count = 0;

        if (styles.grid.length > 0) {
          removeUnusedGrids();
          removedItems += removedItems == '' ? `${count} grids` : `, ${count} grids`;
        } else {
          figma.notify(`There are no grid styles in this document`);
        }
        count = 0;

        figma.notify(`${removedItems} removed`, {
          timeout: 10000000,
        });
        figma.closePlugin();
      }
      break;
    case 'ui':
      figma.showUI(__html__);
      figma.ui.resize(228, 276);

      figma.ui.postMessage(await figma.clientStorage.getAsync('test'));
      figma.ui.onmessage = async (msg) => {
        await figma.clientStorage.setAsync('test', msg.removeSettings);
        let settings = await figma.clientStorage.getAsync('test');
        if (msg.type === 'remove') {
          styles = {
            font: figma.getLocalTextStyles(),
            color: figma.getLocalPaintStyles(),
            effect: figma.getLocalEffectStyles(),
            grids: figma.getLocalGridStyles(),
          };

          console.log(styles);
          console.log(figma.getLocalEffectStyles());
          console.log(styles.effect.length);

          if (
            (styles.font.length != 0 && settings.fonts) ||
            (styles.color.length != 0 && settings.colors) ||
            (styles.effect.length != 0 && settings.effects) ||
            (styles.grid.length != 0 && settings.grids)
          ) {
            await figma.ui.postMessage('fadeIn');
            await wait(400);
            await removeProps(settings);
            await figma.ui.postMessage('fadeOut');
          } else {
            figma.notify(`There are no selected style types in this document`);
          }
        }
      };
      break;
    case 'run':
      let settings = await figma.clientStorage.getAsync('test');
      if (settings != undefined) {
        if (!settings.grids && !settings.effects && !settings.colors && !settings.fonts) {
          figma.closePlugin('Select any type of style in UI');
        } else {
          styles = {
            font: figma.getLocalTextStyles(),
            color: figma.getLocalPaintStyles(),
            effect: figma.getLocalEffectStyles(),
            grid: figma.getLocalGridStyles(),
          };
          console.log(styles);
          console.log(figma.getLocalEffectStyles());
          console.log(styles.effect.length);
          if (styles.font.length == 0 && styles.color.length == 0 && styles.effect.length == 0 && styles.grid.length == 0) {
            figma.closePlugin(`There are no styles in this document at all`);
          } else {
            figma.notify(`${await removePropsNoUi(settings)} removed`, {
              timeout: 10000000,
            });
            figma.closePlugin();
          }
        }
      } else {
        figma.closePlugin(`Set the settings first`);
      }
      break;
  }
}

async function removeProps(settings) {
  if (styles.font.length > 0 && settings.fonts) {
    await figma.ui.postMessage('fonts');
    await wait(100);
    removeUnusedFonts();
    await figma.ui.postMessage({
      type: 'fonts',
      size: count,
    });
  } else if (styles.font.length == 0 && settings.fonts) {
    figma.notify(`There are no fonts styles in this document`);
    await figma.ui.postMessage({
      type: 'fonts',
      size: 'NaN',
    });
  } else if (!settings.fonts) {
    await figma.ui.postMessage({
      type: 'fonts',
      size: 'NaN',
    });
  }

  count = 0;
  if (styles.color.length > 0 && settings.colors) {
    await figma.ui.postMessage('colors');
    await wait(100);
    removeUnusedColors();
    await figma.ui.postMessage({
      type: 'colors',
      size: count,
    });
  } else if (styles.color.length == 0 && settings.colors) {
    figma.notify(`There are no color styles in this document`);
    await figma.ui.postMessage({
      type: 'colors',
      size: 'NaN',
    });
  } else if (!settings.colors) {
    await figma.ui.postMessage({
      type: 'colors',
      size: 'NaN',
    });
  }

  count = 0;
  console.log(styles.effect.length);
  if (styles.effect.length > 0 && settings.effects) {
    await figma.ui.postMessage('effects');
    await wait(100);
    removeUnusedEffects();
    await figma.ui.postMessage({
      type: 'effects',
      size: count,
    });
  } else if (styles.effect.length == 0 && settings.effects) {
    figma.notify(`There are no effect styles in this document`);
    await figma.ui.postMessage({
      type: 'effects',
      size: 'NaN',
    });
  } else if (!settings.effects) {
    await figma.ui.postMessage({
      type: 'effects',
      size: 'NaN',
    });
  }

  count = 0;
  if (styles.grid.length > 0 && settings.grids) {
    await figma.ui.postMessage('grids');
    await wait(100);
    removeUnusedGrids();
    await figma.ui.postMessage({
      type: 'grids',
      size: count,
    });
  } else if (styles.grid.length == 0 && settings.grids) {
    figma.notify(`There are no grid styles in this document`);
    await figma.ui.postMessage({
      type: 'grids',
      size: 'NaN',
    });
  } else if (!settings.grids) {
    await figma.ui.postMessage({
      type: 'grids',
      size: 'NaN',
    });
  }

  count = 0;
  await figma.ui.postMessage('done');
}

async function removePropsNoUi(settings) {
  let removedItems = '';

  if (styles.font.length > 0 && settings.fonts) {
    removeUnusedFonts();
    removedItems += `${count} fonts`;
  } else if (styles.font.length == 0 && settings.fonts) {
    figma.notify(`There are no fonts styles in this document`);
  }
  count = 0;

  if (styles.color.length > 0 && settings.colors) {
    removeUnusedColors();
    removedItems += removedItems == '' ? `${count} colors` : `, ${count} colors`;
  } else if (styles.color.length == 0 && settings.colors) {
    figma.notify(`There are no color styles in this document`);
  }
  count = 0;

  if (styles.effect.length > 0 && settings.effects) {
    removeUnusedEffects();
    removedItems += removedItems == '' ? `${count} effects` : `, ${count} effects`;
  } else if (styles.effect.length == 0 && settings.effects) {
    figma.notify(`There are no effect styles in this document`);
  }
  count = 0;

  if (styles.grid.length > 0 && settings.grids) {
    removeUnusedGrids();
    removedItems += removedItems == '' ? `${count} grids` : `, ${count} grids`;
  } else if (styles.grid.length == 0 && settings.grids) {
    figma.notify(`There are no grid styles in this document`);
  }
  count = 0;

  return removedItems;
}

function findAndRemove(type) {
  let search,
    ids = {
      font: ['textStyleId'],
      color: ['fillStyleId', 'strokeStyleId'],
      effect: ['effectStyleId'],
      grid: ['gridStyleId'],
    };

  for (let style of styles[type]) {
    for (const item of ids[type]) search = figmaRoot.findOne((n) => n[item] === style.id);
    if (search == null) {
      style.remove();
      count++;
    }
  }
}