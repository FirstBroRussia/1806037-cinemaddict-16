import {ControlButtons} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';


const createControlButtonOnTheFilmCardTemplate = (film) => `
<div id="${film.id}" class="film-card__controls">
<button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.isWatchlist && 'film-card__controls-item--active'}" type="button">Add to watchlist</button>
<button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.isWatched && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
<button class="film-card__controls-item film-card__controls-item--favorite ${film.isFavorite && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
</div>
`;

class ControlButtonsOnTheFilmCardMarkup extends AbstractView {
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
    this._callback.watchlistClick(ControlButtons.isWatchlist);
  };

  #hangWatchedButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(ControlButtons.isWatched);
  };

  #hangFavoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.FavoriteClick(ControlButtons.isFavorite);
  };

}

export {ControlButtonsOnTheFilmCardMarkup};
