import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {FilmsListMarkup} from '/src/view/films-list-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {FilmDetailsPopupMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

import {INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement} from '/src/main.js';


class FilmsListPresenter {
  #films = null;
  #filteredFilms = null;

  #FilmCardPresenter = null;

  #ProfileUserComponent = null;
  #NavigationMenuComponent = null;
  #FilmsCountComponent = null;
  #FilmsListComponent = null;
  #FilmDetailsPopupComponent = null;

  #ShowMoreButtonComponent = null;
  #LoadingFilmsListComponent = null;
  #SortListComponent = null;


  constructor (data) {
    this.#films = data;

    this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
    this.#SortListComponent = new SortListMarkup();
    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
    this.#ProfileUserComponent = new ProfileUserMarkup();
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.#films);
    this.#FilmsCountComponent = new FilmsCountMarkup(this.#films.length);
  }

  init () {
    const currentMarkupNavigationMenu = document.querySelector('.main-navigation');
    const currentMarkupFilmsCount = document.querySelector('.footer__statistics');

    renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, this.#ProfileUserComponent);
    replaceNodeElement(mainBodyElement, this.#NavigationMenuComponent, currentMarkupNavigationMenu);
    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#SortListComponent);
    replaceNodeElement(footerStatisticBodyElement, this.#FilmsCountComponent, currentMarkupFilmsCount.firstElementChild);
    renderNodeElement(footerBodyElement, positionMarkup.BEFORE_END, this.#FilmDetailsPopupComponent);

    this.renderFilmsList(this.#films);
  }


  renderFilmsList (films) {
    this.#FilmsListComponent = new FilmsListMarkup();

    const currentFilmsListMarkup = document.querySelector('.films');
    currentFilmsListMarkup.remove();

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#FilmsListComponent);

    if (films.length > INITIAL_FILMS_CARD_COUNT) {
      const filmsListElement = this.#FilmsListComponent.element.querySelector('.films-list');
      renderNodeElement(filmsListElement, positionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
    }

    this.#FilmCardPresenter = new FilmCardPresenter(this.controlItemButtonChangeData, this.navigationMenuUpdateView);
    this.#FilmCardPresenter.init(films);
  }

  controlItemButtonChangeData = (id, controlItem) => {

    let clickedButton;
    this.#films.forEach( (film) => {
      if (film.id === id && controlItem === 'isWatchlist') {
        film.isWatchlist = !film.isWatchlist;
        clickedButton = film.isWatchlist;
      }
      if (film.id === id && controlItem === 'isWatched') {
        film.isWatched = !film.isWatched;
        clickedButton = film.isWatched;
      }
      if (film.id === id && controlItem === 'isFavorite') {
        film.isFavorite = !film.isFavorite;
        clickedButton = film.isFavorite;
      }
    });
    return [clickedButton, this.#films];
  }


  navigationMenuUpdateView = () => {
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.#films);
    replaceNodeElement(mainBodyElement, this.#NavigationMenuComponent, mainBodyElement.firstElementChild);
  }

}


export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement};
