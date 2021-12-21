import { createNodeElement } from '/src/utils/render-html-element.js';
import { AbstractClass } from '/src/abstract-class/abstract-class.js';


const createFilmDetailsPopupTemplate = () => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">


    </div>


    <div class="film-details__bottom-container">

    </div>
  </form>
</section>
`;


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
            <td class="film-details__cell">${film.releaseFullFormat}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${film.duration}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${film.country}</td>
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

const createFilmDetailsCardFilterControlButtons = (film) => `
<section id="${film.id}" class="film-details__controls">
<button type="button" class="film-details__control-button film-details__control-button--watchlist ${film.isWatchlist && 'film-details__control-button--active'}" id="watchlist" name="watchlist">Add to watchlist</button>
<button type="button" class="film-details__control-button film-details__control-button--watched ${film.isWatched && 'film-details__control-button--active'}" id="watched" name="watched">Already watched</button>
<button type="button" class="film-details__control-button film-details__control-button--favorite ${film.isFavorite && 'film-details__control-button--active'}" id="favorite" name="favorite">Add to favorites</button>
</section>
`;

const filmDetailsCommentsCount = (filmData) => `
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmData.comments.length}</span></h3>
`;

const createFilmDetailsCommentsMarkup = (film) => {
  let htmlTextMarkup = '';
  film.comments.forEach((item) => {
    htmlTextMarkup += `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/smile.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${item}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">Tim Macoveev</span>
        <span class="film-details__comment-day">2019/12/31 23:59</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
   </li>\n`;
  });

  return `
  <ul class="film-details__comments-list">
    ${htmlTextMarkup}
  </ul>
  `;
};

const createFolmDetailsNewCommentMarkup = () => `
<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
`;

const createFilmsDetailsCloseButtonMarkup = () => `
<div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
`;

class FilmDetailsPopupMarkup extends AbstractClass {
  constructor() {
    super();

    this._template = createFilmDetailsPopupTemplate;
    this._element = createNodeElement(this._template());
  }
}


class FilmDetailsCloseButtonMarkup extends AbstractClass {
  constructor() {
    super();

    this._template = createFilmsDetailsCloseButtonMarkup();
    this._element = createNodeElement(this._template);
  }
}


class FilmDetailInfoMarkup extends AbstractClass {
  constructor(filmData) {
    super();

    this._template = createFilmDetailsInfoMarkupTemplate;
    this._element = createNodeElement(this._template(filmData));
  }
}

class FilmDetailsCardFilterButtons extends AbstractClass {
  constructor(filmData) {
    super();

    this._template = createFilmDetailsCardFilterControlButtons;
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
    this._callback.watchlistClick(evt);
  };

  #hangWatchedButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(evt);
  };

  #hangFavoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.FavoriteClick(evt);
  };

}


class FilmDetailsCommentsCountMarkup extends AbstractClass {
  constructor(filmData) {
    super();

    this._template = filmDetailsCommentsCount;
    this._element = createNodeElement(this._template(filmData));
  }
}

class FilmDetailsCommentMarkup extends AbstractClass {
  constructor(filmData) {
    super();

    this._template = createFilmDetailsCommentsMarkup;
    this._element = createNodeElement(this._template(filmData));
  }
}

class FilmDetailsNewCommentMarkup extends AbstractClass {
  constructor() {
    super();

    this._template = createFolmDetailsNewCommentMarkup();
    this._element = createNodeElement(this._template);
  }
}


export { FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup };
