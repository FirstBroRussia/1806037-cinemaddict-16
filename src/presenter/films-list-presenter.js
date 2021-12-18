import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup} from '/src/view/films-list-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {FilmDetailsPopupMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

import {INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement, controlButtons} from '/src/main.js';


class FilmsListPresenter {
  films = null;
  #filteredFilms = null;

  #showFilmsCount = null;

  #FilmCardPresenter = null;

  #AllFilmsComponent = null;
  #GeneralFilmsListComponent = null;
  #TopRatedFilmsListComponent = null;
  #MostCommentedFilmsListComponent = null;

  #generalFilmsListContainer = null;
  #topRatedFilmsListContainer = null;
  #mostCommentedFilmsListContainer = null;

  #NavigationMenuComponent = null;

  #ShowMoreButtonComponent = null;
  #LoadingFilmsListComponent = null;


  constructor (data) {
    console.log(data);
    const aaa = data.sort( (itemA, itemB) => itemA.id - itemB.id);
    this.films = aaa;
    console.log(this.films);


    this.#AllFilmsComponent = new AllFilmsMarkup();
    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#TopRatedFilmsListComponent = new TopRatedFilmsListMarkup();
    this.#MostCommentedFilmsListComponent = new MostCommentedFilmsListMarkup();

    this.#generalFilmsListContainer = this.#GeneralFilmsListComponent.element.querySelector('.films-list__container');
    this.#topRatedFilmsListContainer = this.#TopRatedFilmsListComponent.element.querySelector('.films-list__container');
    this.#mostCommentedFilmsListContainer = this.#MostCommentedFilmsListComponent.element.querySelector('.films-list__container');


    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();

  }

  init () {
    this.renderGeneralFilmsList();
    this.renderExtraFilmsList();

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#AllFilmsComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#TopRatedFilmsListComponent);
    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#MostCommentedFilmsListComponent);
  }

  renderGeneralFilmsList () {
    if (this.films.length > INITIAL_FILMS_CARD_COUNT) {
      this.#showFilmsCount = INITIAL_FILMS_CARD_COUNT;

      this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
      this.#ShowMoreButtonComponent.addEventHandler('click', this.#renderFilmCardsToShowMoreButtonClickHandler);
      renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
    }

    for (let index = 0; index < this.#showFilmsCount; index++) {
      console.log(this.films[index].id);
      this.#FilmCardPresenter = new FilmCardPresenter(this.films[index], this.#valueControlButtonsChangeData).render();
      renderNodeElement(this.#generalFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter);
    }

  }

  renderExtraFilmsList () {
    this.films.sort( (itemA, itemB) => itemB.rating - itemA.rating).slice(0,2)
      .forEach( (film) => {
        this.#FilmCardPresenter = new FilmCardPresenter(film, this.#valueControlButtonsChangeData).render();
        renderNodeElement(this.#topRatedFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter);
      });

    this.films.sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length).slice(0,2)
      .forEach( (film) => {
        this.#FilmCardPresenter = new FilmCardPresenter(film, this.#valueControlButtonsChangeData).render();
        renderNodeElement(this.#mostCommentedFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter);
      });
  }

  #renderFilmCardsToShowMoreButtonClickHandler = () => {

    if (this.films.length - this.#showFilmsCount <= INITIAL_FILMS_CARD_COUNT) {
      this.#ShowMoreButtonComponent.removeEventHandler('click', this.#renderFilmCardsToShowMoreButtonClickHandler);
      this.#ShowMoreButtonComponent.removeElement();
    }

    for (let index = this.#showFilmsCount; index < this.#showFilmsCount + INITIAL_FILMS_CARD_COUNT; index++) {
      console.log(this.films[index].id);
      this.#FilmCardPresenter = new FilmCardPresenter(this.films[index], this.#valueControlButtonsChangeData).render();
      renderNodeElement(this.#generalFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter);
    }

    this.#showFilmsCount += INITIAL_FILMS_CARD_COUNT;
  }


  #valueControlButtonsChangeData = (id, controlItem) => {
    this.films.forEach( (film) => {
      if (film.id === id && controlItem === controlButtons.isWatchlist) {
        film.isWatchlist = !film.isWatchlist;
      }
      if (film.id === id && controlItem === controlButtons.isWatched) {
        film.isWatched = !film.isWatched;
      }
      if (film.id === id && controlItem === controlButtons.isFavorite) {
        film.isFavorite = !film.isFavorite;
      }
    });

    this.#navigationMenuUpdateView();
    this.#renderedFilmCardsUpdateView();
  }


  navigationMenuUpdateView = () => {
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.films);
    replaceNodeElement(mainBodyElement, this.#NavigationMenuComponent, mainBodyElement.firstElementChild);
  }


  #renderedFilmCardsUpdateView = () => {
    const RenderedFilmCards = this.#AllFilmsComponent.element.querySelectorAll('.film-card');
    RenderedFilmCards.forEach( (card) => {
      const currentIdFilm = Number(card.getAttribute('id'));
      this.films.forEach( (film) => {
        if (film.id === currentIdFilm) {
          this.#FilmCardPresenter = new FilmCardPresenter(film, this.#valueControlButtonsChangeData).render();
          card.replaceWith(this.#FilmCardPresenter);
        }
      });
    });
  }

  #navigationMenuUpdateView = () => {
    let currentNavigationMenuElement;
    if (this.#NavigationMenuComponent === null) {
      currentNavigationMenuElement = document.querySelector('.main-navigation');
    } else {
      currentNavigationMenuElement = this.#NavigationMenuComponent.element;
    }
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.films);
    replaceNodeElement(mainBodyElement, this.#NavigationMenuComponent, currentNavigationMenuElement);
  }

}


export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement, controlButtons};
