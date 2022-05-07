/* eslint-disable no-undef */
//// ================================ Imports ======================================

///// ================================ Code ======================================
console.clear();

let count = 0;

let wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findAndRemove(params) {
  let search,
    ids = {
      font: ['textStyleId'],
      color: ['fillStyleId', 'strokeStyleId'],
      effect: ['effectStyleId'],
      grid: ['gridStyleId'],
    };

  for (let obj of params.style) {
    let isNull = true;
    for (let key of ids[params.type]) {
      search = figma.root.findOne((n) => n[key] === obj.id);
      if (search != null) isNull = false;
    }

    if (isNull) {
      obj.remove();
      count++;
    }
  }
}

function removeStyles(params) {
  if (params.style.length > 0 && params.settings || params.once) {
    findAndRemove(params);

    if (params.once) {
      figma.notify(`${count} ${params.type}s removed`, {
        timeout: 10000000,
      });
      figma.closePlugin();
    }
    
    return `${count} ${params.type}s`;
  } else {
    if (params.once) {
      figma.closePlugin(`There are no ${params.type} styles in this document`);
    } else {
      if (params.settings) figma.notify(`There are no ${params.type} styles in this document`);
    }
    return '';
  }
}

function removeMultipleStyles(styles, settings) {
  let check = Object.values(styles).some((element) => element.length != 0),
    removedItems = '';

  if (check) {
    for (let key in styles) {
      let remove = removeStyles({ style: styles[key], type: key, settings: settings[`${key}s`] });
      removedItems += removedItems === '' || remove === '' ? remove : ` | ${remove}`;
      count = 0;
    }

    figma.notify(`${removedItems} removed`, {
      timeout: 10000000,
    });
  } else {
    figma.closePlugin(`There are no styles in this document at all`);
  }

  figma.closePlugin();
}

async function removeProps(params) {
  let message = {
    type: `${params.type}s`,
    size: 'NaN',
  };
  if (params.style.length > 0 && params.option) {
    await figma.ui.postMessage(`${params.type}s`);
    await wait(100);
    findAndRemove(params);

    message.size = count;
  } else if (params.style.length == 0 && params.option) {
    figma.notify(`There are no ${params.type}s styles in this document`);
  }
  await figma.ui.postMessage(message);
}

async function run(command) {
  let styles = {
    font: figma.getLocalTextStyles(),
    color: figma.getLocalPaintStyles(),
    effect: figma.getLocalEffectStyles(),
    grid: figma.getLocalGridStyles(),
  };

  let settingsName = 'remover-settings';

  switch (command) {
    case 'font':
    case 'color':
    case 'effect':
    case 'grid':
      removeStyles({ style: styles[command], type: command, once: true });
      break;
    case 'all':
      removeMultipleStyles(styles, {
        fonts: true,
        colors: true,
        effects: true,
        grids: true,
      });
      break;
    case 'ui': {
      figma.showUI(__html__);
      figma.ui.resize(228, 276);

      figma.ui.postMessage(await figma.clientStorage.getAsync(settingsName));
      figma.ui.onmessage = async (msg) => {
        await figma.clientStorage.setAsync(settingsName, msg.removeSettings);
        let settings = await figma.clientStorage.getAsync(settingsName),
          isNotEmpty;

        for (let key in styles) {
          if (styles[key].length != 0 && settings[`${key}s`]) isNotEmpty = true;
        }

        if (msg.type === 'remove') {
          if (isNotEmpty) {
            await figma.ui.postMessage('fadeIn');
            await wait(400);
            for (const key in styles) {
              await removeProps({ style: styles[key], type: key, option: settings[`${key}s`] });
              count = 0;
            }
            await figma.ui.postMessage('done');
            await figma.ui.postMessage('fadeOut');
          } else {
            figma.notify(`There are no selected style types in this document`);
          }
        }
      };
      break;
    }
    case 'run': {
      let settings = await figma.clientStorage.getAsync(settingsName);

      if (settings != undefined) {
        let check = Object.values(settings).some((element) => element);
        check ? removeMultipleStyles(styles, settings) : figma.closePlugin('Select any type of style in UI');
      } else {
        figma.closePlugin(`Set the settings first`);
      }
      break;
    }
  }
}

run(figma.command);
