import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createNavigationMenuTemplate = () => `
<nav class="main-navigation">

  </nav>
`;

const creaeFiltersWrapTemplate = () => `
<div class="main-navigation__items">

</div>
`;

const createAllFilmsFilterTemplate = () => `
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
`;

const createWatchlistFilmsFilterTemplate = () => `
<a href="#watchlist" class="main-navigation__item">Watchlist </span></a>
`;

const createWatchedFilmsFilterTemplate = () => `
<a href="#history" class="main-navigation__item">History </span></a>
`;

const createFavoriteFilmsFilterTemplate = () => `
<a href="#favorites" class="main-navigation__item">Favorites </span></a>
`;

const createStatsTemplate = () => `
<a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
`;

const createWatchlistFilmsCountTemplate = (filmsData) => `
<span class="main-navigation__item-count">${filmsData.filter(({isWatchlist}) => isWatchlist).length}
`;

const createWatchedFilmsCountTemplate = (filmsData) => `
<span class="main-navigation__item-count">${filmsData.filter(({isWatched}) => isWatched).length}
`;

const createFavoriteFilmsCountTemplate = (filmsData) => `
<span class="main-navigation__item-count">${filmsData.filter(({isFavorite}) => isFavorite).length}
`;


class NavigationMenuMarkup extends AbstractClass {
  _currentActiveButton = null;

  constructor (filmData) {
    super();

    this._template = createNavigationMenuTemplate;
    this._element = createNodeElement(this._template(filmData));
  }

  static setCurrentActiveButton = (element) => {
    if (this._currentActiveButton === undefined) {
      this._currentActiveButton = element;
      return;
    }
    this._currentActiveButton.classList.remove('main-navigation__item--active');
    this._currentActiveButton = element;
  }

  setAllMoviesFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.allMoviesFilterClick = callback;
    this._element.querySelector('a[href="#all"]').addEventListener(event, this.#hangAllMoviesHandler);
  }

  setWatchlistFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.watchlistFilterClick = callback;
    this._element.querySelector('a[href="#watchlist"]').addEventListener(event, this.#hangAWatchlistHandler);
  }

  setHistoryFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.historyFilterClick = callback;
    this._element.querySelector('a[href="#history"]').addEventListener(event, this.#hangHistoryHandler);
  }

  setFavoritesFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.favoriteFilterClick = callback;
    this._element.querySelector('a[href="#favorites"]').addEventListener(event, this.#hangFavoritesHandler);
  }

  #hangAllMoviesHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    this._currentActiveButton.classList.remove('main-navigation__item--active');
    this._currentActiveButton = this._element.querySelector('a[href="#all"]').classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.allMoviesFilterClick(evt);
  }

  #hangAWatchlistHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    this._currentActiveButton.classList.remove('main-navigation__item--active');
    this._currentActiveButton = this._element.querySelector('a[href="#watchlist"]').classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.watchlistFilterClick(evt);
  }

  #hangHistoryHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    this._currentActiveButton.classList.remove('main-navigation__item--active');
    this._currentActiveButton = this._element.querySelector('a[href="#history"]').classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.historyFilterClick(evt);
  }

  #hangFavoritesHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    this._currentActiveButton.classList.remove('main-navigation__item--active');
    this._currentActiveButton = this._element.querySelector('a[href="#favorites"]').classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.favoriteFilterClick(evt);
  }
}


class WatchlistFilmsCountMarkup extends AbstractClass {
  constructor (filmsData) {
    super();

    this._template = createWatchlistFilmsCountTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}

class WatchedFilmsCountMarkup extends AbstractClass {
  constructor (filmsData) {
    super();

    this._template = createWatchedFilmsCountTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}

class FavoriteFilmsCountMarkup extends AbstractClass {
  constructor (filmsData) {
    super();

    this._template = createFavoriteFilmsCountTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}

class FilterWrapMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = creaeFiltersWrapTemplate;
    this._element = createNodeElement(this._template());
  }
}

class AllFilmsFilterMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createAllFilmsFilterTemplate;
    this._element = createNodeElement(this._template());
    NavigationMenuMarkup.setCurrentActiveButton(this._element);
  }

  setAllMoviesFilterClickHandler = (event, callback) => {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.allMoviesFilterClick = callback;
    this._element.addEventListener(event, this.#hangAllMoviesHandler);
  }

  #hangAllMoviesHandler = (evt) => {
    if (this._element.closest('.main-navigation__item--active')) {
      return;
    }
    NavigationMenuMarkup.setCurrentActiveButton(this._element);
    this._element.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.allMoviesFilterClick(evt);
  }
}

class WatchlistFilmsFilterMarkup extends AbstractClass {
  constructor (filmsData) {
    super();

    this._template = createWatchlistFilmsFilterTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }

  setWatchlistFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.watchlistFilterClick = callback;
    this._element.addEventListener(event, this.#hangAWatchlistHandler);
  }

  #hangAWatchlistHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    NavigationMenuMarkup.setCurrentActiveButton(this._element);
    this._element.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.watchlistFilterClick(evt);
  }
}

class HistoryFilterMarkup extends AbstractClass {
  constructor (filmsData) {
    super();

    this._template = createWatchedFilmsFilterTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}

class FavoriteFilmsFilterMarkup extends AbstractClass {
  constructor (filmsData) {
    super();

    this._template = createFavoriteFilmsFilterTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}

class StatsMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createStatsTemplate;
    this._element = createNodeElement(this._template());
  }
}


export {NavigationMenuMarkup, FilterWrapMarkup, AllFilmsFilterMarkup, WatchlistFilmsFilterMarkup, HistoryFilterMarkup, FavoriteFilmsFilterMarkup, StatsMarkup, WatchlistFilmsCountMarkup, WatchedFilmsCountMarkup, FavoriteFilmsCountMarkup};
