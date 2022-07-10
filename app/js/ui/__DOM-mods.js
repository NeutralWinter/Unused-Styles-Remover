DOMTokenList.prototype.changeLastOn = function (target) {
  this.remove(this[this.length - 1]);
  this.add(target);
};

NodeList.prototype.onRemoveEvent = function (callback) {
  this.forEach((element) => {
    const button = element.querySelector('.b-iconButton');
    button.onclick = function () {
      const title = element.parentElement.querySelector('.js-title'),
        childs = element.parentElement.querySelectorAll('.js-item');

      element.classList.toggle('--onRemove');

      callback(title, childs);
    };
  });
};
