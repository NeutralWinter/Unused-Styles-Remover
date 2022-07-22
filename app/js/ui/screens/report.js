import OutputConstructor from './_report-output-constructor';
import ReportItems from './_report-Items';

export default class ReportScreen extends ReportItems {
  #alert;

  constructor() {
    super();
    this.report = document.querySelector('.m-report');
    this.error = this.report.querySelector('.c-error');
    this.done = document.querySelector('.js-confirm');

    this.done.onclick = () => this._confirm();
  }

  get items() {
    let items = {
      titles: this.report.querySelectorAll('.js-title'),
      items: this.report.querySelectorAll('.js-item'),
    };

    return items;
  }

  setScreen() {
    document.body.classList.changeLastOn(`--report`);
    parent.postMessage({ pluginMessage: { resize: 'xl' } }, '*');
  }

  _confirm() {
    const items = this.report.querySelectorAll('.js-item');
    let output = new OutputConstructor(items);

    if (Object.keys(output).length == 0) {
      if (!this.#alert) {
        this.#alert = true;
        this.error.classList.toggle('--alert');
        setTimeout(() => {
          this.error.classList.toggle('--alert');
          this.#alert = false;
        }, 3300);
      }
    } else {
      parent.postMessage({ pluginMessage: { resize: 'xs' } }, '*');
      document.body.classList.changeLastOn('--result');
      parent.postMessage({ pluginMessage: { remove: output } }, '*');
    }
  }
}
