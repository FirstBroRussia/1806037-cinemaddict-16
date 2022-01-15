import {MainPresenter} from '/src/presenter/main-presenter.js';

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

new MainPresenter().init();

export {bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement};
