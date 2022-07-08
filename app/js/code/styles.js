export default class Styles {
  constructor(settings) {
    const keys = Object.keys(settings);
    const styles = {
      fonts: figma.getLocalTextStyles(),
      colors: figma.getLocalPaintStyles(),
      effects: figma.getLocalEffectStyles(),
      grids: figma.getLocalGridStyles(),
    };

    for (const key of keys) {
      if (settings[key]) this[key] = styles[key];
    }
  }

  get properties() {
    let props = {
      fonts: this.fonts ? ['textStyleId'] : undefined,
      colors: this.colors ? ['fillStyleId', 'strokeStyleId'] : undefined,
      effects: this.effects ? ['effectStyleId'] : undefined,
      grids: this.grids ? ['gridStyleId'] : undefined,
    };

    props = Object.entries(props);
    // eslint-disable-next-line no-unused-vars
    props = props.filter(([key, value]) => value != undefined);
    props = Object.fromEntries(props);

    return props;
  }
}
