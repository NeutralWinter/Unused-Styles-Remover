export default class LoaderScreen {
  constructor() {
    this.loader = document.querySelector('.m-loader');
    this.scanningCount = this.loader.querySelector('.m-loader__scanningCount');
    this.progress = this.loader.querySelector('.b-progressBar__progress');
  }

  setScreen() {
    document.body.classList.changeLastOn(`--loader`);
  }

  changeState(state) {
    this.loader.classList.changeLastOn(`--${state}`);
  }

  changeProgress(count) {
    if (count.queue == 1) this.progress.classList.remove('--animation');
    else if (!this.progress.classList.contains('--animation')) this.progress.classList.add('--animation');
    this.progress.style.width = count.progress;
    this.scanningCount.textContent = `${count.queue} of ${count.length}`;
  }
}
