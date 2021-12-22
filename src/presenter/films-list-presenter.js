import {INITIAL_FILMS_CARD_COUNT, bodyElement, mainBodyElement, controlButtons, filterMode, sortMode} from '/src/utils/util.js';
import {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup, ExtraFilmsListMarkup, TopRatedListTagMarkup, MostCommentedListTagMarkup, GeneralAllFilmsListTagMarkup, GeneralFilmsListContainerMarkup, GeneralWatchlistFilmsListTagMarkup, GeneralWatchedFilmsListTagMarkup, GeneralFavoriteFilmsListTagMarkup} from '/src/view/films-list-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';
import {EmptyAllFilmsListMarkup, EmptyWatchlistMarkup, EmptyWatchedMarkup, EmptyFavoriteMarkup} from '/src/view/empty-films-list-view.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

const NO_FILMS_VALUE = 0;

class FilmsListPresenter {
  #films = null;
  #filteredFilms = null;
  #sortFilms = null;
  #noSortStockList = null;
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


  constructor (changeMasterData) {
    this._callbacks.changeMasterData = changeMasterData;

    this.#GeneralFilmCardPresentersMap = new Map();
    this.#TopRatedFilmCardPresentersMap = new Map();
    this.#MostCommentedFilmCardPresentersMap = new Map();

    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
  }

  init (films, id, selectedFilter, currentChangeControlButton, selectedSort) {
    if (selectedSort) {
      this.#SortMode = selectedSort;
    }
    // САМАЯ ПЕРВАЯ ОТРИСОВКА ПРИ ЗАПУСКЕ САЙТА
    if (this.#films === null && selectedFilter) {
      this.#FilterMode = selectedFilter;
      this.#films = films.slice();
      this.#renderNewFilmsList(this.#films);
      return;
    }
    // ОТРИСОВКА ПУСТОГО СПИСКА ПРИ ВЫБОРЕ ALL MOVIES
    if (films.length === NO_FILMS_VALUE && this.#FilterMode === filterMode.ALL_MOVIES && selectedFilter === filterMode.ALL_MOVIES) {
      this.#renderEmptyAllFilmsList();
      return;
    }
    // ОТРИСОВКА ПУСТОГО ЛИСТА ЛЮБОГО ВЫБРАННОГО ФИЛЬТРА КРОМЕ ALL MOVIES
    if (films.length === NO_FILMS_VALUE && selectedFilter !== filterMode.ALL_MOVIES) {
      this.#FilterMode = selectedFilter;
      this.#renderEmptyFilteredFilmsList();
      return;
    }
    // ОТРИСОВКА ЛЮБОГО ВЫБРАННОГО ОТФИЛЬТРОВАННОГО СПИСКА
    if (films && selectedFilter) {
      if (selectedFilter === filterMode.ALL_MOVIES && this.#SortMode === sortMode.DEFAULT) { // СВЯЗКА ALL MOVIES + SORT_DEFAILT
        this.#AllFilmsComponent.remove();
        this.#FilterMode = selectedFilter;
        this.#films = films.slice();
        this.#renderNewFilmsList(this.#films);
        return;
      }
      if (selectedFilter === filterMode.ALL_MOVIES && this.#SortMode !== sortMode.DEFAULT) { // СВЯЗКА ALL MOVIES + ЛЮБОЙ ДРУГОЙ SORT КРОМЕ ДЕФОЛТНОГО
        this.#FilterMode = selectedFilter;
        this.#films = films.slice();
        this.#sortFilms = this.#setSortFilmsListSwitch(this.#films, this.#SortMode);
        this.#renderFilteredFilmsList(this.#sortFilms, selectedFilter);
        return;
      }
      this.#FilterMode = selectedFilter;
      this.#films = films.slice();
      this.#filteredFilms = this.#setFilteredFilmsListSwitch(this.#FilterMode);
      if (this.#SortMode !== sortMode.DEFAULT) {
        this.#sortFilms = this.#setSortFilmsListSwitch(this.#filteredFilms, this.#SortMode);
        this.#renderFilteredFilmsList(this.#sortFilms, selectedFilter);
        return;
      }
      this.#renderFilteredFilmsList(this.#filteredFilms, selectedFilter);
      return;
    }
    // ВИДОИЗМЕНЕНИЕ ОТРИСОВАННОГО СПИСКА ALL MOVIES
    if (films && id !== undefined && this.#FilterMode === filterMode.ALL_MOVIES) {
      this.#films = films.slice();
      if (this.#SortMode === sortMode.ON) {
        this.#noSortStockList = this.#films.slice();
      }
      this.#filmCardUpdateView(id);
      return;
    }
    // ВИДОИЗМЕНЕНИЕ СПИСКА ПРИ ЛЮБОМ ВЫБРАННОМ ФИЛЬТРЕ КРОМЕ ALL MOVIES, ГДЕ НЕ НАЖИМАЛИ НА КАРТОЧКЕ СООТВЕТСТВУЮЩУЮ ВЫБРАННОМУ ФИЛЬТРУ КНОПКУ(ТО ЕСТЬ ТУТ КАРТОЧКА НЕ ИСЧЕЗАЕТ ИЗ СПИСКА)
    if (films && id !== undefined && currentChangeControlButton !== this.#FilterMode) {
      this.#films = films.slice();
      this.#filteredFilms = this.#setFilteredFilmsListSwitch(this.#FilterMode);
      if (this.#SortMode === sortMode.ON) {
        this.#noSortStockList = this.#filteredFilms.slice();
      }
      this.#filmCardUpdateView(id);
      return;
    }
    // ВИДОИЗМЕНЕНИЕ СПИСКА ПРИ ЛЮБОМ ВЫБРАННОМ ФИЛЬТРЕ КРОМЕ ALL MOVIES, ГДЕ КАРТОЧКА ИСЧЕЗАЕТ И ОТРИСОВЫВАЕТСЯ НОВАЯ ИЗ СПИСКА СООТВЕТСТВУЮЩЕГО ДАННОМУ ФИЛЬТРУ
    if (films && id !== undefined && this.#FilterMode !== filterMode.ALL_MOVIES && currentChangeControlButton === this.#FilterMode) {
      this.#films = films.slice();
      this.#filteredFilms = this.#setFilteredFilmsListSwitch(this.#FilterMode);
      if (this.#SortMode === sortMode.ON) {
        this.#noSortStockList = this.#filteredFilms.slice();
      }
      this.#filteredFilmsListUpdateView(id);
    }
  }


  #renderNewFilmsList = (films) => {
    this.#AllFilmsComponent = new AllFilmsMarkup();
    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#GeneralFilmsListTagComponent = new GeneralAllFilmsListTagMarkup();
    this.#GeneralFilmsListContainerComponent = new GeneralFilmsListContainerMarkup();

    this.#TopRatedExtraFilmsListComponent = new ExtraFilmsListMarkup();
    this.#TopRatedFilmsListTagComponent = new TopRatedListTagMarkup();
    this.#TopRatedFilmsListContainerComponent = new TopRatedFilmsListMarkup();

    this.#MostCommentedExtraFilmsListComponent = new ExtraFilmsListMarkup();
    this.#MostCommentedFilmsListTagComponent = new MostCommentedListTagMarkup();
    this.#MostCommentedFilmsListContainerComponent = new MostCommentedFilmsListMarkup();

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#AllFilmsComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListContainerComponent);
    this.renderGeneralFilmsList(films);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#TopRatedExtraFilmsListComponent);
    renderNodeElement(this.#TopRatedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#TopRatedFilmsListTagComponent);
    renderNodeElement(this.#TopRatedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#TopRatedFilmsListContainerComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#MostCommentedExtraFilmsListComponent);
    renderNodeElement(this.#MostCommentedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#MostCommentedFilmsListTagComponent);
    renderNodeElement(this.#MostCommentedExtraFilmsListComponent, positionMarkup.BEFORE_END, this.#MostCommentedFilmsListContainerComponent);
    this.renderExtraFilmsList(films);
  }

  #renderFilteredFilmsList = (films, filter) => {
    this.#GeneralFilmCardPresentersMap = new Map();

    const prevGeneralFilmsListComponent = this.#GeneralFilmsListComponent;
    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#GeneralFilmsListTagComponent = this.#generalFilmsListTagSwitch(filter);
    this.#GeneralFilmsListContainerComponent = new GeneralFilmsListContainerMarkup();
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListContainerComponent);
    this.renderGeneralFilmsList(films);

    replaceNodeElementWithoutParent(this.#GeneralFilmsListComponent, prevGeneralFilmsListComponent);
  }


  renderGeneralFilmsList (films) {
    if (films.length > INITIAL_FILMS_CARD_COUNT) {
      this.#showGeneralFilmsCount = INITIAL_FILMS_CARD_COUNT;

      this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
      this.#ShowMoreButtonComponent.addEventHandler('click', this.#renderFilmCardsToShowMoreButtonClickHandler);
      renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
    } else {
      this.#showGeneralFilmsCount = films.length;
    }

    for (let index = 0; index < this.#showGeneralFilmsCount; index++) {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData);
      this.#GeneralFilmCardPresentersMap.set(films[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(films[index]));
    }
  }

  renderExtraFilmsList (films) {
    const topRatedSortFilms = films.slice().sort( (itemA, itemB) => itemB.rating - itemA.rating).slice(0,2);
    topRatedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData);
      this.#TopRatedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#TopRatedFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });

    const mostCommentedSortFilms = films.slice().sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length).slice(0,2);
    mostCommentedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData);
      this.#MostCommentedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#MostCommentedFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });
  }


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

    if (this.#filteredFilms.length === NO_FILMS_VALUE) {
      this.#renderEmptyFilteredFilmsList();
      return;
    }

    if (this.#filteredFilms.length <= INITIAL_FILMS_CARD_COUNT) {
      if (this.#ShowMoreButtonComponent === null) {
        return;
      }
      this.#ShowMoreButtonComponent.remove();
      this.#ShowMoreButtonComponent = null;
    }

    const mapKeys = Array.from(this.#GeneralFilmCardPresentersMap.keys());

    for (const film of this.#filteredFilms) {
      if (mapKeys.some( (item) => item === film.id)) {
        continue;
      }
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData);
      this.#GeneralFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
      break;
    }
  }

  #renderFilmCardsToShowMoreButtonClickHandler = () => {
    let currentFilmsList;
    if (this.#FilterMode === filterMode.ALL_MOVIES) {
      currentFilmsList = this.#films;
    } else {
      currentFilmsList = this.#filteredFilms;
    }

    if (currentFilmsList.length - this.#showGeneralFilmsCount <= INITIAL_FILMS_CARD_COUNT) {
      this.#ShowMoreButtonComponent.remove();
      this.#ShowMoreButtonComponent = null;
    }

    for (let index = this.#showGeneralFilmsCount; index < this.#showGeneralFilmsCount + INITIAL_FILMS_CARD_COUNT; index++) {

      if (currentFilmsList[index] === undefined) {
        return;
      }
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData);
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

  #setFilteredFilmsListSwitch = (value) => {
    switch (value) {
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

  #setSortFilmsListSwitch = (films, sort) => {
    switch (sort) {
      case 'default' : return films.slice();
      case 'date' : return films.slice().sort( (itemA, itemB) => itemB.releaseYear - itemA.releaseYear);
      case 'rating' : return films.slice().sort( (itemA, itemB) => itemB.rating - itemA.rating);
    }
  }
}


export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement, controlButtons};
