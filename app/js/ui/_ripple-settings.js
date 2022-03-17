import { rippleEffect, Ripple } from 'data-ripple';

let ripple = document.querySelector('.--lightRipple');

new Ripple(ripple, {
  color: 'rgba(255, 255, 255, 0.30)',
  enterDuration: 400,
});