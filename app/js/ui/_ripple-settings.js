import { Ripple } from 'data-ripple';

let ripples = document.querySelectorAll('.--lightRipple');

for (let ripple of ripples) {
  new Ripple(ripple, {
    color: 'rgba(255, 255, 255, 0.30)',
    enterDuration: 400,
  });
}