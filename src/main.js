import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {FilmDetailsPopupMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';


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
    primaryInit(data);
    new FilmsListPresenter(data).init();
  });


function primaryInit (data) {
  const filmsMarkup = document.querySelector('.films');
  filmsMarkup.remove();

  const ProfileUserComponent = new ProfileUserMarkup();
  const NavigationMenuComponent = new NavigationMenuMarkup(data);
  const SortListComponent = new SortListMarkup();
  const FilmsCountComponent = new FilmsCountMarkup(data.length);
  const FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();

  const currentMarkupNavigationMenu = document.querySelector('.main-navigation');
  const currentMarkupFilmsCount = document.querySelector('.footer__statistics');


  renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, ProfileUserComponent);
  replaceNodeElement(mainBodyElement, NavigationMenuComponent, currentMarkupNavigationMenu);
  renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, SortListComponent);
  replaceNodeElement(footerStatisticBodyElement, FilmsCountComponent, currentMarkupFilmsCount.firstElementChild);
  renderNodeElement(footerBodyElement, positionMarkup.BEFORE_END, FilmDetailsPopupComponent);
}


export {INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement, controlButtons};
