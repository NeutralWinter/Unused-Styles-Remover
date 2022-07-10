export default class Settings {
  #test;
  constructor(name) {
    this.fonts = true;
    this.colors = true;
    this.effects = true;
    this.grids = true;
    this.#test = name;
  }

  get test() {
    return this.#test;
  }

  async get() {
    let settings = await figma.clientStorage.getAsync(this.#test);

    if (!settings) {
      await this.set(this);
      return this;
    }

    return settings;
  }

  async set(obj) {
    figma.clientStorage.setAsync(this.#test, obj);
  }
}
