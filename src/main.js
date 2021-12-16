import {filmsData} from '/src/mock/temporary-data.js';

import {FilmsListPresenter} from '/src/presenter/films-list-presenter.js';

const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');


const PrimaryActions = new Promise( (resolve) => {
  setTimeout( () => {
    resolve(filmsData);
  }, 1000);
});

PrimaryActions
  .then( (data) => {
    new FilmsListPresenter(data).init();
  });

export {INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement};
