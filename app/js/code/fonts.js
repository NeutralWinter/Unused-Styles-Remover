export default class Fonts {
  constructor() {
    this.styles = ['italic', 'narrow', 'condensed', 'semicondensed', 'extracondensed', 'oblique', 'extended'];

    this.weights = [
      {
        weight: ['thin', 'hairline'],
        number: 100,
      },
      {
        weight: ['extralight', 'ultralight'],
        number: 200,
      },
      {
        weight: ['light'],
        number: 300,
      },
      {
        weight: ['semilight', 'demilight', 'book'],
        number: 350,
      },
      {
        weight: ['regular', 'default', 'normal'].concat(this.styles),
        number: 400,
      },
      {
        weight: ['medium'],
        number: 500,
      },
      {
        weight: ['semibold', 'demibold'],
        number: 600,
      },
      {
        weight: ['bold'],
        number: 700,
      },
      {
        weight: ['extrabold', 'ultrabold', 'xbold'],
        number: 800,
      },
      {
        weight: ['black', 'heavy'],
        number: 900,
      },
      {
        weight: ['extrablack', 'extraheavy'],
        number: 1000,
      },
    ];
  }

  getStyle(prop) {
    let str = prop.toLowerCase().replace(' ', '');

    for (const item of this.weights) {
      for (const weight of item.weight) {
        let condition = str.indexOf(weight) != -1 && !this.styles.some((element) => element === weight);
        if (condition && str.length > weight.length) str = str.replace(weight, '');
        if (condition && str.length == weight.length) str = str.replace(weight, 'normal');
      }
    }

    let arr = [];
    for (const item of this.styles) {
      if (str.indexOf(item) != -1 && str.length > item.length) {
        arr.push(item);
      }
    }

    if (arr.length > 0) str = arr.join(' ');

    return str;
  }

  getWeight(prop) {
    let str = prop.toLowerCase().replace(' ', '');

    for (const item of this.styles) {
      if (str.indexOf(item) != -1 && str.length != item.length) {
        str = str.replace(item, '');
      }
    }

    for (const item of this.weights) {
      for (const weight of item.weight) {
        if (str.indexOf(weight) != -1 && str.length == weight.length) return item.number;
      }
    }

    return 'undefined';
  }

  getDecoration(prop) {
    switch (prop) {
      case 'NONE':
        return 'none';
      case 'UNDERLINE':
        return 'underline';
      case 'STRIKETHROUGH':
        return 'line-through';
    }
  }

  getCase(prop) {
    switch (prop) {
      case 'ORIGINAL':
        return 'none';
      case 'UPPER':
        return 'uppercase';
      case 'LOWER':
        return 'lowercase';
      case 'TITLE':
        return 'capitalize';
    }
  }
}
