import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {positionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';


import {filmsData} from '/src/mock/temporary-data.js';
import {FilmsListPresenter} from '/src/presenter/films-list-presenter.js';

const controlButtons = {
  isWatchlist: 'isWatchlist',
  isWatched: 'isWatched',
  isFavorite: 'isFavorite',
};


const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

const PrimaryActions = new Promise( (resolve) => {
  setTimeout( () => {
    resolve(filmsData);
  }, 1000);
});

PrimaryActions
  .then( (data) => {
    primaryInit(data);
    new FilmsListPresenter(data).render();
  });


function primaryInit (data) {
  const ProfileUserComponent = new ProfileUserMarkup();
  const NavigationMenuComponent = new NavigationMenuMarkup(data);
  const SortListComponent = new SortListMarkup();
  const FilmsCountComponent = new FilmsCountMarkup(data.length);


  renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, ProfileUserComponent);
  renderNodeElement(mainElement, positionMarkup.BEFORE_END, NavigationMenuComponent);
  renderNodeElement(mainElement, positionMarkup.BEFORE_END, SortListComponent);
  renderNodeElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, FilmsCountComponent);
}


export {INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainElement, footerBodyElement, footerStatisticBodyElement, controlButtons};
