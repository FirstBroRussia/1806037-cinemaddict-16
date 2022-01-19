import {getReleaseDateFormat, getDurationFormatTime} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createFilmDetailsInfoMarkupTemplate = (film) => {
  let textMarkupToGenresList = '';
  film.genre.forEach((item) => {
    textMarkupToGenresList += `<span class="film-details__genre">${item}</span>\n`;
  });

  return `
<div id="${film.id}" class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${film.img}" alt="${film.name}">

        <p class="film-details__age">${film.ageRating}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${film.name}</h3>
            <p class="film-details__title-original">Original: ${film.originalName}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${film.rating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${film.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${film.screenwritters}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${film.actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${getReleaseDateFormat(film.releaseFullFormat.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${getDurationFormatTime(film.duration)}</td>
          </tr>
          <tr class="film-details__row genre">
            <td class="film-details__term">${film.genre.length === 1 ? 'Genre' : 'Genres'}</td>
            <td class="film-details__cell">
              ${textMarkupToGenresList}
          </tr>
        </table>

        <p class="film-details__film-description">${film.description}</p>
      </div>
    </div>


`;
};

class FilmDetailInfoMarkup extends AbstractView {
  constructor(filmData) {
    super();

    this._template = createFilmDetailsInfoMarkupTemplate;
    this._element = createNodeElement(this._template(filmData));
  }

}

export {FilmDetailInfoMarkup};
