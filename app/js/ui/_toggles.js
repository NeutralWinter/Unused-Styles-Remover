export default class Toggles {
  constructor() {
    this.fonts = document.getElementById('fonts_checkbox');
    this.colors = document.getElementById('colors_checkbox');
    this.effects = document.getElementById('effects_checkbox');
    this.grids = document.getElementById('grids_checkbox');
  }

  get run() {
    const options = document.querySelector('.m-options');
    return options.querySelector('.b-button');
  }

  settings(message) {
    for (const key in this) {
      this[key].checked = message.settings[key];
      this[key].onclick = () => {
        message.settings[key] = this[key].checked;
        parent.postMessage({ pluginMessage: { settings: message.settings } }, '*');
        this.run.disabled = !this.someSelected();
      };
    }
    this.run.disabled = !this.someSelected();
  }

  someSelected() {
    return Object.values(this).some((element) => element.checked);
  }
}
