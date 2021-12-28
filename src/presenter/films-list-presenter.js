import {INITIAL_FILMS_CARD_COUNT, bodyElement, mainBodyElement, controlButtons, filterMode, sortMode} from '/src/utils/util.js';
import {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup, ExtraFilmsListMarkup, TopRatedListTagMarkup, MostCommentedListTagMarkup, GeneralAllFilmsListTagMarkup, GeneralFilmsListContainerMarkup, GeneralWatchlistFilmsListTagMarkup, GeneralWatchedFilmsListTagMarkup, GeneralFavoriteFilmsListTagMarkup} from '/src/view/films-list-view.js';
import {positionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';

import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';
import {EmptyAllFilmsListMarkup, EmptyWatchlistMarkup, EmptyWatchedMarkup, EmptyFavoriteMarkup} from '/src/view/empty-films-list-view.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

const NO_FILMS_VALUE = 0;


class FilmsListPresenter {
  #films = null;

  #currentOpenPopupElement = null;

  #FilterMode = null;
  #SortMode = null;
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

    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
  }

  init (films, selectedFilter, selectedSort, id) {
    this.#films = films.slice();

    if (selectedFilter) {
      this.#FilterMode = selectedFilter;
    }

    if (selectedSort) {
      this.#SortMode = selectedSort;
    }

    this.#renderGeneralFilmsList(this.#films, id);
    if (this.#SortMode === sortMode.DEFAULT && this.#FilterMode === filterMode.ALL_MOVIES) {
      this.#renderExtraFilmsList(this.#films);
    }
  }

  #renderGeneralFilmsList = (films, id) => {
    if (this.#AllFilmsComponent !== null) {
      this.#AllFilmsComponent.remove();
    }
    this.#AllFilmsComponent = new AllFilmsMarkup();

    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    if (films.length === NO_FILMS_VALUE) {
      this.#GeneralFilmsListTagComponent = this.#emptyGeneralFilmsListSwitch(this.#FilterMode);
      renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);
      renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
      renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#AllFilmsComponent);
      return;
    }
    this.#GeneralFilmsListTagComponent = this.#generalFilmsListTagSwitch(this.#FilterMode);
    this.#GeneralFilmsListContainerComponent = new GeneralFilmsListContainerMarkup();

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#AllFilmsComponent);

    renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListContainerComponent);
    this.renderGeneralFilmsCard(films, id);
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

  renderGeneralFilmsCard (films, id) {
    this.#GeneralFilmCardPresentersMap = new Map();

    if (id !== undefined) {
      this.#ShowMoreButtonComponent = null;
      const prevShowGeneralFilmsCount = this.#showGeneralFilmsCount;

      if (prevShowGeneralFilmsCount < films.length) {
        this.#showGeneralFilmsCount = prevShowGeneralFilmsCount;
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
      return;
    }

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

  #renderFilmCardsToShowMoreButtonClickHandler = () => {
    if (this.#films.length - this.#showGeneralFilmsCount <= INITIAL_FILMS_CARD_COUNT) {
      this.#ShowMoreButtonComponent.remove();
      this.#ShowMoreButtonComponent = null;
    }

    const prevShowGeneralFilmsCount = this.#showGeneralFilmsCount;
    if (this.#showGeneralFilmsCount + INITIAL_FILMS_CARD_COUNT <= this.#films.length) {
      this.#showGeneralFilmsCount += INITIAL_FILMS_CARD_COUNT;
    } else {
      this.#showGeneralFilmsCount += this.#films.length - this.#showGeneralFilmsCount;
    }

    for (let index = prevShowGeneralFilmsCount; index < this.#showGeneralFilmsCount; index++) {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this.#getCurrentOpenPopupElement);
      this.#GeneralFilmCardPresentersMap.set(this.#films[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, positionMarkup.BEFORE_END, this.#FilmCardPresenter.render(this.#films[index]));
    }
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

  #getCurrentOpenPopupElement = (value) => {
    if (value !== undefined) {
      this.#currentOpenPopupElement = value;
      return;
    }
    return this.#currentOpenPopupElement;
  }

}

export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement, controlButtons};
