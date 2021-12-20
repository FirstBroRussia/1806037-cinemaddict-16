// import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
// import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
// import {FilmsCountMarkup} from '/src/view/films-count-view.js';
// import {FilmDetailsPopupMarkup} from '/src/view/film-details-popup-view.js';

import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup} from '/src/view/films-list-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

import {INITIAL_FILMS_CARD_COUNT, bodyElement, mainElement, controlButtons} from '/src/main.js';


class FilmsListPresenter {
  #films = null;
  #filteredFilms = null;

  #showFilmsCount = null;

  #FilmCardPresenter = null;

  #GeneralFilmCardPresentersMap = null;
  #TopRatedFilmCardPresentersMap = null;
  #MostCommentedFilmCardPresentersMap = null;

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
    this.#films = data.slice();

    this.#GeneralFilmCardPresentersMap = new Map();
    this.#TopRatedFilmCardPresentersMap = new Map();
    this.#MostCommentedFilmCardPresentersMap = new Map();

    this.#AllFilmsComponent = new AllFilmsMarkup();
    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#TopRatedFilmsListComponent = new TopRatedFilmsListMarkup();
    this.#MostCommentedFilmsListComponent = new MostCommentedFilmsListMarkup();

    this.#generalFilmsListContainer = this.#GeneralFilmsListComponent.element.querySelector('.films-list__container');
    this.#topRatedFilmsListContainer = this.#TopRatedFilmsListComponent.element.querySelector('.films-list__container');
    this.#mostCommentedFilmsListContainer = this.#MostCommentedFilmsListComponent.element.querySelector('.films-list__container');


    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
  }

  render () {
    this.renderGeneralFilmsList();
    this.renderExtraFilmsList();

    renderNodeElement(mainElement, positionMarkup.BEFORE_END, this.#AllFilmsComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#TopRatedFilmsListComponent);
    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#MostCommentedFilmsListComponent);
  }

  renderGeneralFilmsList () {
    if (this.#films.length > INITIAL_FILMS_CARD_COUNT) {
      this.#showFilmsCount = INITIAL_FILMS_CARD_COUNT;

      this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
      this.#ShowMoreButtonComponent.addEventHandler('click', this.#renderFilmCardsToShowMoreButtonClickHandler);
      renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
    }

    for (let index = 0; index < this.#showFilmsCount; index++) {
      this.#FilmCardPresenter = new FilmCardPresenter(this.#changeMasterData);
      this.#GeneralFilmCardPresentersMap.set(this.#films[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#generalFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(this.#films[index]));
    }

  }

  renderExtraFilmsList () {
    const topRatedSortFilms = this.#films.slice().sort( (itemA, itemB) => itemB.rating - itemA.rating).slice(0,2);
    topRatedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this.#changeMasterData);
      this.#TopRatedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#topRatedFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });

    const mostCommentedSortFilms = this.#films.slice().sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length).slice(0,2);
    mostCommentedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this.#changeMasterData);
      this.#MostCommentedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#mostCommentedFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });
  }

  #renderFilmCardsToShowMoreButtonClickHandler = () => {
    if (this.#films.length - this.#showFilmsCount <= INITIAL_FILMS_CARD_COUNT) {
      this.#ShowMoreButtonComponent.remove();
    }

    for (let index = this.#showFilmsCount; index < this.#showFilmsCount + INITIAL_FILMS_CARD_COUNT; index++) {

      if (this.#films[index] === undefined) {
        return;
      }
      this.#FilmCardPresenter = new FilmCardPresenter(this.#changeMasterData);
      this.#GeneralFilmCardPresentersMap.set(this.#films[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#generalFilmsListContainer, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(this.#films[index]));
    }

    this.#showFilmsCount += INITIAL_FILMS_CARD_COUNT;
  }


  #changeMasterData = (id, changedData) => {
    for (let index = 0; index < this.#films.length; index++) {
      if (this.#films[index].id === id) {
        this.#films[index] = changedData;
        break;
      }
    }

    this.#updateView(id);
  }

  #updateView = (id) => {
    this.#navigationMenuUpdateView();

    this.#renderedFilmCardUpdateView(id);
  }


  #navigationMenuUpdateView = () => {
    let currentNavigationMenuElement;
    if (this.#NavigationMenuComponent === null) {
      currentNavigationMenuElement = document.querySelector('.main-navigation');
    } else {
      currentNavigationMenuElement = this.#NavigationMenuComponent.element;
    }
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.#films);
    replaceNodeElement(mainElement, this.#NavigationMenuComponent, currentNavigationMenuElement);
  }

  #renderedFilmCardUpdateView = (id) => {
    const rightFilm = this.#films.find( (film) => film.id === id);

    for (const film of this.#GeneralFilmCardPresentersMap) {
      const currentIdFilm = film[0];
      if (currentIdFilm === id) {
        const currentValueFilm = film[1];
        currentValueFilm.render(rightFilm);
        break;
      }
    }

    this.#TopRatedFilmCardPresentersMap.forEach( (film, key) => {
      if (key === id) {film.render(rightFilm);}
    });

    this.#MostCommentedFilmCardPresentersMap.forEach( (film, key) => {
      if (key === id) {film.render(rightFilm);}
    });
  }


}

export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement, controlButtons};
