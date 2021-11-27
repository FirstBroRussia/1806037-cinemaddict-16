import {getConvertedString} from '../utils/util.js';

const MAX_LENGTH_DESCRIPTION_STRING_TO_FILM_CARD = 140;

const createFilmCardTemplate = (film) => `
<article id="${film.id}" class="film-card hidden">
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
  <span class="film-card__comments">${film.comments.length} comments</span>
</a>
<div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
</div>
</article>

`;

const setClassToggleToControlButtonsForFilmCard = ({id, isWatchlist, isWatched, isFavorite}) => {
  const currentIdArticleTagElement = document.querySelector(`article[id="${id}"]`);
  const addToWatchlistControlButton = currentIdArticleTagElement.querySelector('.film-card__controls-item--add-to-watchlist');
  const markAsWatchedControlButton = currentIdArticleTagElement.querySelector('.film-card__controls-item--mark-as-watched');
  const favoriteControlButton = currentIdArticleTagElement.querySelector('.film-card__controls-item--favorite');

  if (isWatchlist) {
    addToWatchlistControlButton.classList.add('film-card__controls-item--active');
  }
  if (isWatched) {
    markAsWatchedControlButton.classList.add('film-card__controls-item--active');
  }
  if (isFavorite) {
    favoriteControlButton.classList.add('film-card__controls-item--active');
  }
};

const setMarkupCommentsCountField = ({id, comments}) => {
  const currentIdArticleTagElement = document.querySelector(`article[id="${id}"]`);
  const markupCommentsCountField = currentIdArticleTagElement.querySelector('.film-card__comments');
  if (comments.length === 1) {
    markupCommentsCountField.textContent = '1 comment';
  }
};


export {createFilmCardTemplate, setClassToggleToControlButtonsForFilmCard, setMarkupCommentsCountField};


