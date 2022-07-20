export default class ResultScreen {
  constructor() {
    this.result = document.querySelector('.m-result');
    this.removedStyles = this.result.querySelector('.js-removedStyles');
  }

  setScreen(message) {
    document.body.classList.changeLastOn(`--result`);
    if (message) this._removeStyles(message);
    else this.result.classList.changeLastOn('--nothing');
  }

  _removeStyles(message) {
    let length = 0;
    for (const key in message) {
      length += message[key].length;
    }

    this.result.classList.changeLastOn('--done');

    setTimeout(() => {
      let upto = 0;
      const interval = setInterval(() => {
        if (upto === length) clearInterval(interval);
        this.removedStyles.textContent = upto++;
      }, 10);
    }, 150);
  }
}
