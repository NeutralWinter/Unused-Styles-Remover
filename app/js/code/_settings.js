export default class Settings {
  #name;
  constructor(name) {
    this.fonts = true;
    this.colors = true;
    this.effects = true;
    this.grids = true;
    this.#name = name;
  }

  async get() {
    let settings = await figma.clientStorage.getAsync(this.#name);

    if (!settings) {
      await this.set(this);
      return this;
    }

    return settings;
  }

  async set(obj) {
    figma.clientStorage.setAsync(this.#name, obj);
  }
}
