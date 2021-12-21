import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {positionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';


import {filmsData} from '/src/mock/temporary-data.js';
import {MainPresenter} from '/src/presenter/main-presenter.js';

const controlButtons = {
  isWatchlist: 'isWatchlist',
  isWatched: 'isWatched',
  isFavorite: 'isFavorite',
};


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
    new MainPresenter(data).init();
  });


export {INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement, controlButtons};
