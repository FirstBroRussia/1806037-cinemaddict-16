import {getConvertedString} from '../utils/util.js';

const MAX_LENGTH_DESCRIPTION_STRING_TO_FILM_CARD = 140;

const createFilmCardTemplate = (film, requiredClass) => `
<article id="${film.id}" class="film-card ${requiredClass}">
<a class="film-card__link">
  <h3 class="film-card__title">${film.name}</h3>
  <p class="film-card__rating">${film.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${film.releaseYear}</span>
    <span class="film-card__duration">${film.duration}</span>
    <span class="film-card__genre">${film.genre}</span>
  </p>
  <img src="${film.img}" alt="" class="film-card__poster">
  <p class="film-card__description">${getConvertedString(film.description, MAX_LENGTH_DESCRIPTION_STRING_TO_FILM_CARD)}</p>
  <span class="film-card__comments">${film.comments.length === 1 ? '1 comment' : `${film.comments.length} comments`}</span>
</a>
<div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.isWatchlist && 'film-card__controls-item--active'}" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.isWatched && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite ${film.isFavorite && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
</div>
</article>

`;

export {createFilmCardTemplate};
