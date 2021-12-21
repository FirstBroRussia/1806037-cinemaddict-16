import {NavigationMenuMarkup, FilterWrapMarkup, AllFilmsFilterMarkup, WatchlistFilmsFilterMarkup, HistoryFilterMarkup, FavoriteFilmsFilterMarkup, StatsMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup, ExtraFilmsListMarkup, TopRatedListTagMarkup, MostCommentedListTagMarkup, GeneralAllFilmsListTagMarkup, GeneralFilmsListContainerMarkup, GeneralWatchlistFilmsListTagMarkup, GeneralWatchedFilmsListTagMarkup, GeneralFavoriteFilmsListTagMarkup} from '/src/view/films-list-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement, replaceNodeElementWithoutParent, removeNodeElement} from '/src/utils/render-html-element.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';
import {EmptyAllFilmsListMarkup, EmptyWatchlistMarkup, EmptyWatchedMarkup, EmptyFavoriteMarkup} from '/src/view/empty-films-list-view.js';

import {FilmCardPresenter} from '/src/presenter/film-card-presenter.js';

import {INITIAL_FILMS_CARD_COUNT, bodyElement, mainBodyElement, controlButtons} from '/src/main.js';

const filterMode = {
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',
};

class FilmsListPresenter {
  #FilterMode = false;
  _callbacks = {};
  #films = null;
  #filteredFilms = null;
  #showGeneralFilmsCount = null;

  #FilmCardPresenter = null;

  #GeneralFilmCardPresentersMap = null;
  #TopRatedFilmCardPresentersMap = null;
  #MostCommentedFilmCardPresentersMap = null;

  #SortListComponent = null;
  #ShowMoreButtonComponent = null;
  #LoadingFilmsListComponent = null;
  #EmptyAllFilmsListComponent = null;
  #EmptyWatchlistComponent = null;
  #EmptyWatchedListComponent = null;
  #EmptyFavoriteListComponent = null;


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

    this.#SortListComponent = new SortListMarkup();
    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#SortListComponent);

    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
    // this.#EmptyAllFilmsListComponent = new EmptyAllFilmsListMarkup();
    // this.#EmptyWatchlistComponent = new EmptyWatchlistMarkup();
    // this.#EmptyWatchedListComponent = new EmptyWatchedMarkup();
    // this.#EmptyFavoriteListComponent = new EmptyFavoriteMarkup();

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
  }


  render (films, id, filter) {
    if (filter && !id) {
      if (filter === 'all') {
        this.#FilterMode = false;
      } else {
        this.#FilterMode = filter;
      }
      this.#filteredFilms = films;
      this.#rerenderFilmsList(films, filter);

      return;
    }
    if (id !== undefined) {
      this.#films = films.slice();

      this.filmCardUpdateView(id);
      if (this.#FilterMode) {
        this.#filteredFilms = this.#FilterItemSwitch(this.#FilterMode);
        this.#filteredFilmsListUpdateView(id);
      }

      return;
    }
    this.#films = films;

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


  filmCardUpdateView (id) {
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

  #renderFilmCardsToShowMoreButtonClickHandler = () => {
    let currentFilmsList;
    if (!this.#FilterMode) {
      currentFilmsList = this.#films;
    }
    if (this.#FilterMode) {
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

  #rerenderFilmsList = (films, filter) => {
    this.#GeneralFilmCardPresentersMap = new Map();
    if (films.length === 0) {
      if (filter === 'all') {
        const prevAllFilmsComponent = this.#AllFilmsComponent;
        this.#AllFilmsComponent = new AllFilmsMarkup();
        this.#GeneralFilmsListTagComponent = this.#EmptyGeneralFilmsListSwitch(filter);
        renderNodeElement(this.#AllFilmsComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);

        replaceNodeElementWithoutParent(this.#AllFilmsComponent, prevAllFilmsComponent);
        return;
      }

      const prevGeneralFilmsListComponent = this.#GeneralFilmsListComponent;
      this.#GeneralFilmsListComponent = new FilmsListMarkup();
      this.#GeneralFilmsListTagComponent = this.#EmptyGeneralFilmsListSwitch(filter);
      renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);

      replaceNodeElementWithoutParent(this.#GeneralFilmsListComponent, prevGeneralFilmsListComponent);
      return;
    }

    const prevGeneralFilmsListComponent = this.#GeneralFilmsListComponent;
    this.#GeneralFilmsListComponent = new FilmsListMarkup();
    this.#GeneralFilmsListTagComponent = this.#generalFilmsListTagSwitch(filter);
    this.#GeneralFilmsListContainerComponent = new GeneralFilmsListContainerMarkup();
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListTagComponent);
    renderNodeElement(this.#GeneralFilmsListComponent, positionMarkup.BEFORE_END, this.#GeneralFilmsListContainerComponent);
    this.renderGeneralFilmsList(films);

    replaceNodeElementWithoutParent(this.#GeneralFilmsListComponent, prevGeneralFilmsListComponent);
  }

  #filteredFilmsListUpdateView = (id) => {
    if (this.#filteredFilms.length <= INITIAL_FILMS_CARD_COUNT) {
      this.#ShowMoreButtonComponent.remove();
      this.#ShowMoreButtonComponent = null;
    }


    for (const film of this.#filteredFilms) {
      if (film.id === id) {
        if (this.#filterSwitch(this.#FilterMode, film)) {
          return;
        }
      }
    }


    this.#GeneralFilmCardPresentersMap.forEach( (presenter, key, map) => {
      if (key === id) {
        presenter.destroy();
        map.delete(key);
      }
    });
  }

  #generalFilmsListTagSwitch = (value) => {
    switch (value) {
      case 'all' : return new GeneralAllFilmsListTagMarkup();
      case 'watchlist' : return new GeneralWatchlistFilmsListTagMarkup();
      case 'history' : return new GeneralWatchedFilmsListTagMarkup();
      case 'favorite' : return new GeneralFavoriteFilmsListTagMarkup();
    }
  }

  #EmptyGeneralFilmsListSwitch = (value) => {
    switch (value) {
      case 'all' : return new EmptyAllFilmsListMarkup();
      case 'watchlist' : return new EmptyWatchlistMarkup();
      case 'history' : return new EmptyWatchedMarkup();
      case 'favorite' : return new EmptyFavoriteMarkup();
    }
  }

  #FilterItemSwitch = (value) => {
    switch (value) {
      case 'all' : return this.#films.slice();
      case 'watchlist' : return this.#films.slice().filter( (film) => film.isWatchlist === true);
      case 'history' : return this.#films.slice().filter( (film) => film.isWatched === true);
      case 'favorite' : return this.#films.slice().filter( (film) => film.isFavorite === true);
    }
  }

  #filterSwitch = (value, film) => {
    switch (value) {
      case 'watchlist' : return film.isWatchlist;
      case 'history' : return film.isWatched;
      case 'favorite' : return film.isFavorite;
    }
  }

}


export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, bodyElement, controlButtons};
