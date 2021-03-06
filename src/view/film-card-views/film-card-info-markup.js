import {getConvertedString, dayjs, getDurationFormatTime} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const MAX_LENGTH_DESCRIPTION_STRING_TO_FILM_CARD = 140;

const createFilmCardInfoMarkup = (film) => `
<a class="film-card__link">
  <h3 class="film-card__title">${film.name}</h3>
  <p class="film-card__rating">${film.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(film.releaseFullFormat.date).format('YYYY')}</span>
    <span class="film-card__duration">${getDurationFormatTime(film.duration)}</span>
    <span class="film-card__genre">${film.genre[0]}</span>
  </p>
  <img src="${film.img}" alt="${film.name}" class="film-card__poster">
  <p class="film-card__description">${getConvertedString(film.description, MAX_LENGTH_DESCRIPTION_STRING_TO_FILM_CARD)}</p>
  <span class="film-card__comments">${film.comments.length === 1 ? '1 comment' : `${film.comments.length} comments`}</span>
</a>
`;

export default class FilmCardInfoMarkup extends AbstractView {
  constructor (filmData) {
    super();

    this._template = createFilmCardInfoMarkup;
    this._element = createNodeElement(this._template(filmData));
  }
}
