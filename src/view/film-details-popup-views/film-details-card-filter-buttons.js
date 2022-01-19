import {ControlButtons} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createFilmDetailsCardFilterControlButtonsTemplate = (film) => `
<section id="${film.id}" class="film-details__controls">
<button type="button" class="film-details__control-button film-details__control-button--watchlist ${film.isWatchlist && 'film-details__control-button--active'}" id="watchlist" name="watchlist">Add to watchlist</button>
<button type="button" class="film-details__control-button film-details__control-button--watched ${film.isWatched && 'film-details__control-button--active'}" id="watched" name="watched">Already watched</button>
<button type="button" class="film-details__control-button film-details__control-button--favorite ${film.isFavorite && 'film-details__control-button--active'}" id="favorite" name="favorite">Add to favorites</button>
</section>
`;

class FilmDetailsCardFilterButtons extends AbstractView {
  constructor(filmData) {
    super();

    this._template = createFilmDetailsCardFilterControlButtonsTemplate;
    this._element = createNodeElement(this._template(filmData));
  }

  setWatchlistClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.watchlistClick = callback;
    this._element.querySelector('.film-details__control-button--watchlist').addEventListener(event, this.#hangWatchlistButtonClickHandler);
  }

  setWatchedClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.watchedClick = callback;
    this._element.querySelector('.film-details__control-button--watched').addEventListener(event, this.#hangWatchedButtonClickHandler);
  }

  setFavoriteClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.FavoriteClick = callback;
    this._element.querySelector('.film-details__control-button--favorite').addEventListener(event, this.#hangFavoriteButtonClickHandler);
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

export {FilmDetailsCardFilterButtons};
