import {INITIAL_FILMS_CARD_COUNT, bodyElement, mainBodyElement, controlButtons, filterMode, sortMode, closeButtonAction} from '/src/utils/util.js';
import {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup, ExtraFilmsListMarkup, TopRatedListTagMarkup, MostCommentedListTagMarkup, GeneralAllFilmsListTagMarkup, GeneralFilmsListContainerMarkup, GeneralWatchlistFilmsListTagMarkup, GeneralWatchedFilmsListTagMarkup, GeneralFavoriteFilmsListTagMarkup} from '/src/view/films-list-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';

import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';
import {EmptyAllFilmsListMarkup, EmptyWatchlistMarkup, EmptyWatchedMarkup, EmptyFavoriteMarkup} from '/src/view/empty-films-list-view.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

const NO_FILMS_VALUE = 0;


class FilmsListPresenter {
  #primaryInit = null;
  #films = null;
  #convertedFilms = null;
  #prevConvertedFilms = null;

  #currentOpenPopupElement = null;

  #FilterMode = 'all';
  #SortMode = 'default';
  _callbacks = {};
  #showGeneralFilmsCount = null;

  #FilmCardPresenter = null;

  #GeneralFilmCardPresentersMap = null;
  #TopRatedFilmCardPresentersMap = null;
  #MostCommentedFilmCardPresentersMap = null;

  #ShowMoreButtonComponent = null;
  #LoadingFilmsListComponent = null;

  #AllFilmsComponent = null;

  #GeneralFilmsListComponent = null;
  #GeneralFilmsListTagComponent = null;
  #GeneralFilmsListContainerComponent = null;

  #TopRatedExtraFilmsListComponent = null;
  #TopRatedFilmsListTagComponent = null;
  #TopRatedFilmsListContainerComponent = null;

  #MostCommentedExtraFilmsListComponent = null;
  #MostCommentedFilmsListTagComponent = null;
  #MostCommentedFilmsListContainerComponent = null;


  constructor (changeMasterData, sortListComponent) {
    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.sortListComponent = sortListComponent;

    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
  }

  init (films, selectedFilter, selectedSort, id, currentAction) {
    this._callbacks.sortListComponent.element.classList.remove('hidden');
    this.#films = films.slice();

    if (selectedFilter) {
      this.#FilterMode = selectedFilter;
    }

    if (selectedSort) {
      this.#SortMode = selectedSort;
    }

    // САМАЯ ПЕРВАЯ ОТРИСОВКА ПРИ ЗАПУСКЕ САЙТА
    if (this.#primaryInit === null) {
      this.#primaryInit = true;
      this.#renderGeneralFilmsList(films);
      this.#renderExtraFilmsList(films);
      return;
    }

    this.#prevConvertedFilms = this.#convertedFilms;
    this.#convertedFilms = this.#getFilteredFilmsListSwitch(this.#FilterMode);
    this.#convertedFilms = this.#getSortFilmsListSwitch(this.#convertedFilms, this.#SortMode);


    if (id !== undefined) {
      this.#filmsListUpdateViewByID(id, currentAction);
      return;
    }

    this.#renderGeneralFilmsList(this.#convertedFilms);
    if (this.#SortMode === sortMode.DEFAULT && this.#FilterMode === filterMode.ALL_MOVIES) {
      this.#renderExtraFilmsList(this.#convertedFilms);
    }
  }


  #renderGeneralFilmsList = (films) => {
    if (films.length === NO_FILMS_VALUE && this.#FilterMode === filterMode.ALL_MOVIES) {
      this._callbacks.sortListComponent.element.classList.add('hidden');
      this.#renderEmptyAllFilmsList();
      return;
    }
    if (films.length === NO_FILMS_VALUE && this.#FilterMode !== filterMode.ALL_MOVIES) {
      this._callbacks.sortListComponent.element.classList.add('hidden');
      this.#renderEmptyFilteredFilmsList();
      return;
    }

    let prevAllFilmsComponent;
    if (this.#AllFilmsComponent !== null) {
      prevAllFilmsComponent = this.#AllFilmsComponent;
    }
    this.#AllFilmsComponent = new AllFilmsMarkup();

    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#GeneralFilmsListTagComponent = new GeneralAllFilmsListTagMarkup();
    this.#GeneralFilmsListContainerComponent = new GeneralFilmsListContainerMarkup();

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#AllFilmsComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListContainerComponent);
    this.renderGeneralFilmsCard(films);
    if (prevAllFilmsComponent !== undefined) {
      replaceNodeElementWithoutParent(this.#AllFilmsComponent, prevAllFilmsComponent);
    }
  }

  #renderExtraFilmsList = (films) => {
    if (films.length === NO_FILMS_VALUE) {
      return;
    }
    this.#TopRatedExtraFilmsListComponent = new ExtraFilmsListMarkup();
    this.#TopRatedFilmsListTagComponent = new TopRatedListTagMarkup();
    this.#TopRatedFilmsListContainerComponent = new TopRatedFilmsListMarkup();

    this.#MostCommentedExtraFilmsListComponent = new ExtraFilmsListMarkup();
    this.#MostCommentedFilmsListTagComponent = new MostCommentedListTagMarkup();
    this.#MostCommentedFilmsListContainerComponent = new MostCommentedFilmsListMarkup();

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#TopRatedExtraFilmsListComponent);
    renderNodeElement(this.#TopRatedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#TopRatedFilmsListTagComponent);
    renderNodeElement(this.#TopRatedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#TopRatedFilmsListContainerComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#MostCommentedExtraFilmsListComponent);
    renderNodeElement(this.#MostCommentedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#MostCommentedFilmsListTagComponent);
    renderNodeElement(this.#MostCommentedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#MostCommentedFilmsListContainerComponent);
    this.renderExtraFilmsCard(films);
  }

  renderGeneralFilmsCard (films) {
    this.#GeneralFilmCardPresentersMap = new Map();

    if (films.length > INITIAL_FILMS_CARD_COUNT) {
      this.#showGeneralFilmsCount = INITIAL_FILMS_CARD_COUNT;

      this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
      this.#ShowMoreButtonComponent.addEventHandler('click', this.#renderFilmCardsToShowMoreButtonClickHandler);
      renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
    } else {
      this.#showGeneralFilmsCount = films.length;
    }

    for (let index = 0; index < this.#showGeneralFilmsCount; index++) {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this.#getCurrentOpenPopupElement);
      this.#GeneralFilmCardPresentersMap.set(films[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(films[index]));
    }
  }

  renderExtraFilmsCard (films) {
    this.#TopRatedFilmCardPresentersMap = new Map();
    this.#MostCommentedFilmCardPresentersMap = new Map();

    const topRatedSortFilms = films.slice().sort( (itemA, itemB) => itemB.rating - itemA.rating).slice(0,2);
    topRatedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this.#getCurrentOpenPopupElement);
      this.#TopRatedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#TopRatedFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });

    const mostCommentedSortFilms = films.slice().sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length).slice(0,2);
    mostCommentedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this.#getCurrentOpenPopupElement);
      this.#MostCommentedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#MostCommentedFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });
  }

  #filmsListUpdateViewByID = (id, currentAction) => {
    this.#filmCardUpdateView(id);
    if (this.#FilterMode !== filterMode.ALL_MOVIES && currentAction === this.#FilterMode) {
      this.#filteredFilmsListUpdateView(id);
      return;
    }
    if (this.#FilterMode !== filterMode.ALL_MOVIES && currentAction === closeButtonAction && (this.#convertedFilms.length < this.#prevConvertedFilms.length)) {
      this.#filteredFilmsListUpdateView(id);
    }
  };


  #filmCardUpdateView = (id) => {
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
  };

  #filteredFilmsListUpdateView = (id) => {
    for (const film of this.#GeneralFilmCardPresentersMap) {
      if (film[0] === id) {
        film[1].destroy();
        this.#GeneralFilmCardPresentersMap.delete(film[0]);
        break;
      }
    }

    if (this.#convertedFilms.length === NO_FILMS_VALUE) {
      this._callbacks.sortListComponent.element.classList.add('hidden');
      this.#renderEmptyFilteredFilmsList();
      return;
    }

    if (this.#convertedFilms.length <= INITIAL_FILMS_CARD_COUNT) {
      if (this.#ShowMoreButtonComponent === null) {
        return;
      }
      this.#ShowMoreButtonComponent.remove();
      this.#ShowMoreButtonComponent = null;
    }

    const mapKeys = Array.from(this.#GeneralFilmCardPresentersMap.keys());

    for (const film of this.#convertedFilms) {
      if (mapKeys.some( (item) => item === film.id)) {
        continue;
      }
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this.#getCurrentOpenPopupElement);
      this.#GeneralFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
      break;
    }
  }

  #renderFilmCardsToShowMoreButtonClickHandler = () => {
    let currentFilmsList;
    if (this.#FilterMode === filterMode.ALL_MOVIES) {
      currentFilmsList = this.#films;
    }
    if (this.#FilterMode !== filterMode.ALL_MOVIES) {
      currentFilmsList = this.#convertedFilms;
    }

    if (currentFilmsList.length - this.#showGeneralFilmsCount <= INITIAL_FILMS_CARD_COUNT) {
      this.#ShowMoreButtonComponent.remove();
      this.#ShowMoreButtonComponent = null;
    }

    for (let index = this.#showGeneralFilmsCount; index < this.#showGeneralFilmsCount + INITIAL_FILMS_CARD_COUNT; index++) {
      if (currentFilmsList[index] === undefined) {
        this.#showGeneralFilmsCount += currentFilmsList.length - this.#showGeneralFilmsCount;
        return;
      }
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this.#getCurrentOpenPopupElement);
      this.#GeneralFilmCardPresentersMap.set(currentFilmsList[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(currentFilmsList[index]));
    }

    this.#showGeneralFilmsCount += INITIAL_FILMS_CARD_COUNT;
  }


  #generalFilmsListTagSwitch = (value) => {
    switch (value) {
      case 'all' : return new GeneralAllFilmsListTagMarkup();
      case 'watchlist' : return new GeneralWatchlistFilmsListTagMarkup();
      case 'history' : return new GeneralWatchedFilmsListTagMarkup();
      case 'favorite' : return new GeneralFavoriteFilmsListTagMarkup();
    }
  }

  #emptyGeneralFilmsListSwitch = (value) => {
    switch (value) {
      case 'all' : return new EmptyAllFilmsListMarkup();
      case 'watchlist' : return new EmptyWatchlistMarkup();
      case 'history' : return new EmptyWatchedMarkup();
      case 'favorite' : return new EmptyFavoriteMarkup();
    }
  }

  #getFilteredFilmsListSwitch = (value) => {
    switch (value) {
      case 'all' : return this.#films.slice();
      case 'watchlist' : return this.#films.slice().filter( (film) => film.isWatchlist === true);
      case 'history' : return this.#films.slice().filter( (film) => film.isWatched === true);
      case 'favorite' : return this.#films.slice().filter( (film) => film.isFavorite === true);
    }
  }

  #renderEmptyAllFilmsList = () => {
    const prevAllFilmsComponent = this.#AllFilmsComponent;
    this.#AllFilmsComponent = new AllFilmsMarkup();
    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#GeneralFilmsListTagComponent = this.#emptyGeneralFilmsListSwitch(this.#FilterMode);
    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    replaceNodeElementWithoutParent(this.#AllFilmsComponent, prevAllFilmsComponent);
  }

  #renderEmptyFilteredFilmsList = () => {
    const prevGeneralFilmsListComponent = this.#GeneralFilmsListComponent;
    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#GeneralFilmsListTagComponent = this.#emptyGeneralFilmsListSwitch(this.#FilterMode);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    replaceNodeElementWithoutParent(this.#GeneralFilmsListComponent, prevGeneralFilmsListComponent);
  }

  #getSortFilmsListSwitch = (films, sort) => {
    switch (sort) {
      case 'default' : return films.slice();
      case 'date' : return films.slice().sort( (itemA, itemB) => itemB.releaseYear - itemA.releaseYear);
      case 'rating' : return films.slice().sort( (itemA, itemB) => itemB.rating - itemA.rating);
    }
  }

  #getCurrentOpenPopupElement = (value) => {
    if (value !== undefined) {
      this.#currentOpenPopupElement = value;
      return;
    }
    return this.#currentOpenPopupElement;
  }

}

export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement, controlButtons};
