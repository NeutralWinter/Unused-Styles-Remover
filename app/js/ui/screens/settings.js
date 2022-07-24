export default class SettingsScreen {
  constructor() {
    this.fonts = document.getElementById('fonts_checkbox');
    this.colors = document.getElementById('colors_checkbox');
    this.effects = document.getElementById('effects_checkbox');
    this.grids = document.getElementById('grids_checkbox');

    this.run.onclick = () => parent.postMessage({ pluginMessage: { preparing: true } }, '*');
  }

  get run() {
    const options = document.querySelector('.m-options');
    return options.querySelector('.b-button');
  }

  setScreen() {
    document.body.classList.changeLastOn(`--options`);
  }

  setSettings(message) {
    for (const key in this) {
      this[key].checked = message[key];
      this[key].onclick = () => {
        message[key] = this[key].checked;
        parent.postMessage({ pluginMessage: { settings: message } }, '*');
        this.run.disabled = !this._someSelected();
      };
    }
    this.run.disabled = !this._someSelected();
  }

  _someSelected() {
    return Object.values(this).some((element) => element.checked);
  }
}
