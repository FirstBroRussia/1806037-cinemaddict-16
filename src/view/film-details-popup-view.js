import {he, ControlButtons, getReleaseDateFormat, getDurationFormatTime} from '/src/utils/util.js';
import {twoKeysPressFunction} from '/src/helpers/two-keys-handlers.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {PositionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';
import {setNewCommentElementValid} from '/src/helpers/new-comment-submit-validation.js';
import dayjs from 'dayjs';


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

const createFilmDetailsCardFilterControlButtonsTemplate = (film) => `
<section id="${film.id}" class="film-details__controls">
<button type="button" class="film-details__control-button film-details__control-button--watchlist ${film.isWatchlist && 'film-details__control-button--active'}" id="watchlist" name="watchlist">Add to watchlist</button>
<button type="button" class="film-details__control-button film-details__control-button--watched ${film.isWatched && 'film-details__control-button--active'}" id="watched" name="watched">Already watched</button>
<button type="button" class="film-details__control-button film-details__control-button--favorite ${film.isFavorite && 'film-details__control-button--active'}" id="favorite" name="favorite">Add to favorites</button>
</section>
`;

const filmDetailsCommentsCountTemplate = (commentsData) => `
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>
`;

const createFilmDetailsCommentsMarkupTemplate = () => `
  <ul class="film-details__comments-list">

  </ul>
`;

const createFilmDetailsCommentFromDataTemplate = (item) => `
<li id="${item.id}"class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-${item.emotion}">
    </span>
    <div class="film-details__comment-wrap">
      <p class="film-details__comment-text">${he.encode(item.comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${item.author}</span>
        <span class="film-details__comment-day">${dayjs(item.date).fromNow()}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
   </li>\n
`;

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


class FilmDetailsPopupMarkup extends AbstractView {
  #formElement = null;

  constructor() {
    super();

    this._template = createFilmDetailsPopupTemplate;
    this._element = createNodeElement(this._template());
    this.#formElement = this._element.querySelector('.film-details__inner');
  }

  formElementDisabled () {
    this.#formElement.classList.add('element--disabled');
  }

  formElementEnabled () {
    this.#formElement.classList.remove('element--disabled');
  }

}

class FilmDetailsNewCommentMarkup extends AbstractView {
  #newComment = null;

  #currentCheckedButton = null;
  #newCommentTextInputElement = null;
  #bigEmojiElement = null;

  constructor(callback) {
    super();

    this._callback.submitNewComment = callback;
    this._template = createFolmDetailsNewCommentMarkup();
    this._element = createNodeElement(this._template);

    this.#bigEmojiElement = this._element.querySelector('.film-details__add-emoji-label');
    this.#newCommentTextInputElement = this._element.querySelector('.film-details__comment-input');

    this.addHandlers();
  }

  addHandlers = () => {
    this._element.querySelector('.film-details__emoji-list').addEventListener('click', this.#smileButtonClickHandler);
    twoKeysPressFunction(this.#submitNewComment);
  }

  #smileButtonClickHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('label')) {
      return;
    }
    if (this.#currentCheckedButton !== null) {
      this.#currentCheckedButton.checked = false;
    }
    const inputElement = evt.target.closest('label').control;
    inputElement.checked = true;
    this.#currentCheckedButton = inputElement;

    const currentEmojiLabel = evt.target.closest('img');

    const newImgElement = document.createElement('img');
    newImgElement.setAttribute('src', currentEmojiLabel.getAttribute('src'));
    newImgElement.classList.add('limitation-border');

    this.#bigEmojiElement.textContent = '';
    renderNodeElement(this.#bigEmojiElement, PositionMarkup.BEFORE_END, newImgElement);
  }

  #validationCheck = (newCommentInputElement, currentCheckedEmotionButton) => {
    setNewCommentElementValid(newCommentInputElement, currentCheckedEmotionButton);
    if (!newCommentInputElement.validity.valid) {
      return false;
    }
    return true;
  }


  #submitNewComment = () => {
    if (!this.#validationCheck(this.#newCommentTextInputElement, this.#currentCheckedButton)) {
      return;
    }

    const emotion = this.#currentCheckedButton.value;
    const comment = this.#newCommentTextInputElement.value;
    this.#newComment = {emotion: emotion, comment: comment};

    this._callback.submitNewComment(this.#newComment);
  }

}

class FilmDetailsCloseButtonMarkup extends AbstractView {
  constructor() {
    super();

    this._template = createFilmsDetailsCloseButtonMarkup();
    this._element = createNodeElement(this._template);
  }
}

class FilmDetailInfoMarkup extends AbstractView {
  constructor(filmData) {
    super();

    this._template = createFilmDetailsInfoMarkupTemplate;
    this._element = createNodeElement(this._template(filmData));
  }

}

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

class FilmDetailsCommentsCountMarkup extends AbstractView {
  constructor(commentsData) {
    super();

    this._template = filmDetailsCommentsCountTemplate;
    this._element = createNodeElement(this._template(commentsData));
  }
}

class FilmDetailsCommentMarkup extends AbstractView {
  constructor() {
    super();

    this._template = createFilmDetailsCommentsMarkupTemplate;
    this._element = createNodeElement(this._template());
  }

  disabledCommentsListElement () {
    this._element.classList.add('element--disabled');
  }

  enabledCommentsListElement () {
    this._element.classList.remove('element--disabled');
  }
}

class FilmDetailsCommentFromDataMarkup extends AbstractView {
  #idComment = null;

  #deleteButtonElement = null;

  constructor(commentData, callback) {
    super();

    this.#idComment = commentData.id;
    this._callback.deleteButtonClick = callback;
    this._template = createFilmDetailsCommentFromDataTemplate;
    this._element = createNodeElement(this._template(commentData));

    this.#deleteButtonElement = this._element.querySelector('.film-details__comment-delete');
    this.addDeleteCommentButtonClickHandler();
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick(this.#idComment, this.#updateDeleteButtonView);
  };

  addDeleteCommentButtonClickHandler() {
    this.#deleteButtonElement.addEventListener('click', this.#deleteButtonClickHandler);
  }

  #updateDeleteButtonView = (state) => {
    switch (state) {
      case 'deleting' : {
        this.#deleteButtonElement.textContent = 'Deleting...';
        break;
      }
      case 'default' : {
        this.#deleteButtonElement.textContent = 'Delete';
      }
    }
  }
}


export {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsCommentFromDataMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup};
