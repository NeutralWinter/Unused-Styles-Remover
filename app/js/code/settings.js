export default class Settings {
  constructor(name) {
    this.fonts = true;
    this.colors = true;
    this.effects = true;
    this.grids = true;
    this.name = name;
  }

  async get() {
    let settings = await figma.clientStorage.getAsync(this.name);
    if (!settings) {
      settings = Object.entries(this);
      // eslint-disable-next-line no-unused-vars
      settings = settings.filter(([key, value]) => value != this.name);
      settings = Object.fromEntries(settings);

      await this.set(settings);
    }
    return settings;
  }

  async set(obj) {
    figma.clientStorage.setAsync(this.name, obj);
  }
}
