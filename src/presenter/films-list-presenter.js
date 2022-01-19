import {bodyElement, mainBodyElement} from '/src/main.js';
import {INITIAL_FILMS_CARD_COUNT, ZERO_VALUE, ControlButtons} from '/src/utils/util.js';
import {AllFilmsMarkup} from '/src/view/films-list-views/all-films-markup.js';
import {FilmsListMarkup} from '/src/view/films-list-views/films-list-markup.js';
import {TopRatedFilmsListMarkup} from '/src/view/films-list-views/top-rated-films-list-markup.js';
import {MostCommentedFilmsListMarkup} from '/src/view/films-list-views/most-commented-films-list-markup.js';
import {ExtraFilmsListMarkup} from '/src/view/films-list-views/extra-films-list-markup.js';
import {TopRatedListTagMarkup} from '/src/view/films-list-views/top-rated-list-tag-markup.js';
import {MostCommentedListTagMarkup} from '/src/view/films-list-views/most-commented-list-tag-markup.js';
import {GeneralAllFilmsListTagMarkup} from '/src/view/films-list-views/general-all-films-list-tag-markup.js';
import {GeneralFilmsListContainerMarkup} from '/src/view/films-list-views/general-films-list-container-markup.js';
import {GeneralWatchlistFilmsListTagMarkup} from '/src/view/films-list-views/general-watchlist-films-list-tag-markup.js';
import {GeneralWatchedFilmsListTagMarkup} from '/src/view/films-list-views/general-watched-films-list-tag-markup.js';
import {GeneralFavoriteFilmsListTagMarkup} from '/src/view/films-list-views/general-favorite-films-list-tag-markup.js';
import {PositionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-markup.js';
import {EmptyAllFilmsListMarkup} from '/src/view/empty-films-views/empty-all-films-list-markup.js';
import {EmptyWatchlistMarkup} from '/src/view/empty-films-views/empty-watchlist-markup.js';
import {EmptyWatchedMarkup} from '/src/view/empty-films-views/empty-watched-markup.js';
import {EmptyFavoriteMarkup} from '/src/view/empty-films-views/empty-favorite-markup.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

const NO_FILMS_VALUE = 0;


class FilmsListPresenter {
  #films = null;

  #FilterMode = null;
  #SortMode = null;
  _callbacks = {};
  #showGeneralFilmsCount = null;

  #FilmCardPresenter = null;

  #GeneralFilmCardPresentersMap = null;
  #TopRatedFilmCardPresentersMap = null;
  #MostCommentedFilmCardPresentersMap = null;

  #ShowMoreButtonComponent = null;

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


  constructor (changeMasterData, popupElement, deleteSectionElement) {
    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.popupElement = popupElement;
    this._callbacks.deleteSectionElement = deleteSectionElement;

  }

  render (films, selectedFilter, selectedSort, id) {
    this.#films = films.slice();

    if (selectedFilter) {
      this.#FilterMode = selectedFilter;
    }

    if (selectedSort) {
      this.#SortMode = selectedSort;
    }

    this._callbacks.deleteSectionElement();
    this.#renderGeneralFilmsList(this.#films, id);
    this.#renderExtraFilmsList(this.#films);
  }

  #renderGeneralFilmsList = (films, id) => {
    this.#AllFilmsComponent = new AllFilmsMarkup();

    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    if (films.length === NO_FILMS_VALUE) {
      this.#GeneralFilmsListTagComponent = this.#emptyGeneralFilmsListSwitch(this.#FilterMode);
      renderNodeElement(this.#AllFilmsComponent, PositionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);
      renderNodeElement(this.#GeneralFilmsListComponent, PositionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
      renderNodeElement(mainBodyElement, PositionMarkup.BEFORE_END, this.#AllFilmsComponent);
      return;
    }
    this.#GeneralFilmsListTagComponent = this.#generalFilmsListTagSwitch(this.#FilterMode);
    this.#GeneralFilmsListContainerComponent = new GeneralFilmsListContainerMarkup();

    renderNodeElement(this.#AllFilmsComponent, PositionMarkup.BEFORE_END, this.#GeneralFilmsListComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, PositionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, PositionMarkup.BEFORE_END, this.#GeneralFilmsListContainerComponent);

    renderNodeElement(mainBodyElement, PositionMarkup.BEFORE_END, this.#AllFilmsComponent);
    this.#renderGeneralFilmsCard(films, id);
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

    renderNodeElement(this.#AllFilmsComponent, PositionMarkup.BEFORE_END, this.#TopRatedExtraFilmsListComponent);
    renderNodeElement(this.#TopRatedExtraFilmsListComponent, PositionMarkup.BEFORE_END, this.#TopRatedFilmsListTagComponent);
    renderNodeElement(this.#TopRatedExtraFilmsListComponent, PositionMarkup.BEFORE_END, this.#TopRatedFilmsListContainerComponent);

    renderNodeElement(this.#AllFilmsComponent, PositionMarkup.BEFORE_END, this.#MostCommentedExtraFilmsListComponent);
    renderNodeElement(this.#MostCommentedExtraFilmsListComponent, PositionMarkup.BEFORE_END, this.#MostCommentedFilmsListTagComponent);
    renderNodeElement(this.#MostCommentedExtraFilmsListComponent, PositionMarkup.BEFORE_END, this.#MostCommentedFilmsListContainerComponent);
    this.#renderExtraFilmsCard(films);
  }

  #renderGeneralFilmsCard = (films, id) => {
    this.#GeneralFilmCardPresentersMap = new Map();

    if (id !== undefined) {
      const prevShowGeneralFilmsCount = this.#showGeneralFilmsCount;

      if (prevShowGeneralFilmsCount < films.length) {
        this.#showGeneralFilmsCount = prevShowGeneralFilmsCount;
        this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
        this.#ShowMoreButtonComponent.addEventHandler('click', this._renderFilmCardsToShowMoreButtonClickHandler);
        renderNodeElement(this.#GeneralFilmsListComponent, PositionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
      } else {
        this.#showGeneralFilmsCount = films.length;
      }
    } else {
      if (films.length > INITIAL_FILMS_CARD_COUNT) {
        this.#showGeneralFilmsCount = INITIAL_FILMS_CARD_COUNT;
        this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
        this.#ShowMoreButtonComponent.addEventHandler('click', this._renderFilmCardsToShowMoreButtonClickHandler);
        renderNodeElement(this.#GeneralFilmsListComponent, PositionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
      } else {
        this.#showGeneralFilmsCount = films.length;
      }
    }

    for (let index = 0; index < this.#showGeneralFilmsCount; index++) {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this._callbacks.popupElement);
      this.#GeneralFilmCardPresentersMap.set(films[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, PositionMarkup.BEFORE_END, this.#FilmCardPresenter.render(films[index]));
    }
  }

  #renderExtraFilmsCard = (films) => {
    this.#TopRatedFilmCardPresentersMap = new Map();
    this.#MostCommentedFilmCardPresentersMap = new Map();

    const topRatedSortFilms = films.slice().sort( (itemA, itemB) => itemB.rating - itemA.rating).slice(0,2)
      .filter( (item) => {
        if (item.rating === ZERO_VALUE) {
          return false;
        }
        return true;
      });
    topRatedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this._callbacks.popupElement);
      this.#TopRatedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#TopRatedFilmsListContainerComponent, PositionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });

    const mostCommentedSortFilms = films.slice().sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length).slice(0,2)
      .filter( (item) => {
        if (item.comments.length === ZERO_VALUE) {
          return false;
        }
        return true;
      });
    mostCommentedSortFilms.forEach( (film) => {
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this._callbacks.popupElement);
      this.#MostCommentedFilmCardPresentersMap.set(film.id, this.#FilmCardPresenter);
      renderNodeElement(this.#MostCommentedFilmsListContainerComponent, PositionMarkup.BEFORE_END, this.#FilmCardPresenter.render(film));
    });

    if (topRatedSortFilms.length === ZERO_VALUE) {
      this.#TopRatedExtraFilmsListComponent.remove();
      this.#TopRatedExtraFilmsListComponent = null;
    }
    if (mostCommentedSortFilms.length === ZERO_VALUE) {
      this.#MostCommentedExtraFilmsListComponent.remove();
      this.#MostCommentedExtraFilmsListComponent = null;
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

  _renderFilmCardsToShowMoreButtonClickHandler = () => {
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
      this.#FilmCardPresenter = new FilmCardPresenter(this._callbacks.changeMasterData, this._callbacks.popupElement);
      this.#GeneralFilmCardPresentersMap.set(this.#films[index].id, this.#FilmCardPresenter);
      renderNodeElement(this.#GeneralFilmsListContainerComponent, PositionMarkup.BEFORE_END, this.#FilmCardPresenter.render(this.#films[index]));
    }
  }

}

export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement, ControlButtons as controlButtons};
