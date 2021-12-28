import {controlButtons} from '/src/utils/util.js';
import {getConvertedString} from '../utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const MAX_LENGTH_DESCRIPTION_STRING_TO_FILM_CARD = 140;

const createFilmCardTemplate = (film) => `
<article id="${film.id}" class="film-card">


</article>`;

const createFilmCardInfoMarkup = (film) => `
<a class="film-card__link">
  <h3 class="film-card__title">${film.name}</h3>
  <p class="film-card__rating">${film.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${film.releaseYear}</span>
    <span class="film-card__duration">${film.duration}</span>
    <span class="film-card__genre">${film.genre[0]}</span>
  </p>
  <img src="${film.img}" alt="${film.name}" class="film-card__poster">
  <p class="film-card__description">${getConvertedString(film.description, MAX_LENGTH_DESCRIPTION_STRING_TO_FILM_CARD)}</p>
  <span class="film-card__comments">${film.comments.length === 1 ? '1 comment' : `${film.comments.length} comments`}</span>
</a>
`;

const createControlButtonOnTheFilmCardTemplate = (film) => `
<div id="${film.id}" class="film-card__controls">
<button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.isWatchlist && 'film-card__controls-item--active'}" type="button">Add to watchlist</button>
<button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.isWatched && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
<button class="film-card__controls-item film-card__controls-item--favorite ${film.isFavorite && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
</div>
`;

class ControlButtonsOnTheFilmCardMarkup extends AbstractClass {
  constructor (filmData) {
    super();

    this._template = createControlButtonOnTheFilmCardTemplate;
    this._element = createNodeElement(this._template(filmData));
  }

  setWatchlistClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.watchlistClick = callback;
    this._element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener(event, this.#hangWatchlistButtonClickHandler);
  }

  setWatchedClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.watchedClick = callback;
    this._element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener(event, this.#hangWatchedButtonClickHandler);
  }

  setFavoriteClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.FavoriteClick = callback;
    this._element.querySelector('.film-card__controls-item--favorite').addEventListener(event, this.#hangFavoriteButtonClickHandler);
  }

  #hangWatchlistButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(controlButtons.isWatchlist);
  };

  #hangWatchedButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(controlButtons.isWatched);
  };

  #hangFavoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.FavoriteClick(controlButtons.isFavorite);
  };

}

class FilmCardInfoMarkup extends AbstractClass {
  constructor (filmData) {
    super();

    this._template = createFilmCardInfoMarkup;
    this._element = createNodeElement(this._template(filmData));
  }
}

class FilmCardMarkup extends AbstractClass {
  constructor (filmData, classHidden) {
    super();

    this._template = createFilmCardTemplate;
    if (classHidden) {
      this._element = createNodeElement(this._template(filmData, 'hidden'));
    } else {
      this._element = createNodeElement(this._template(filmData));
    }
  }

  addEventHandler(event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.respectiveHandler = callback;
    this._element.addEventListener(event, this.#hangFunctionHandler);
  }


  #hangFunctionHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.film-card__controls')) {
      return;
    }
    this._callback.respectiveHandler(evt);
  };
}

export {FilmCardMarkup, ControlButtonsOnTheFilmCardMarkup, FilmCardInfoMarkup};
