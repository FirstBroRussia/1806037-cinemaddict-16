import {FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';
import {onEscKeydown} from '/src/utils/util.js';
import {bodyElement} from '/src/main.js';

class FilmDetailsPopupPresenter {
  _callbacks = {};
  #id = null;
  #films = null;

  #FilmDetailsCloseButtonComponent = null;

  #FilmDetailsInfoComponent = null;
  #FilmDetailsFilterButtonsComponent = null;
  #FilmDetailsFilmsCountComponent = null;
  #FilmDetailsCommentsComponent = null;
  #FilmDetailsNewCommentComponent = null;

  #filmDetailsPopupElement = null;
  #filmDetailsContainerElement = null;
  #filmDetailsCommentsWrapElement = null;

  constructor (callbacks) {
    this._callbacks = callbacks;

    this.#filmDetailsPopupElement = document.querySelector('.film-details');
    this.#filmDetailsContainerElement = this.#filmDetailsPopupElement.querySelector('.film-details__top-container');
    this.#filmDetailsCommentsWrapElement = this.#filmDetailsPopupElement.querySelector('.film-details__comments-wrap');

    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();
  }

  init (id, films) {
    this.#id = id;
    this.#films = films;
    this.#openFilmDetailsPopup();
  }

  #openFilmDetailsPopup = () => {
    this.#filmDetailsPopupElement.classList.remove('hidden');

    for (const film of this.#films) {
      if (film.id === this.#id) {
        this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(film);
        this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(film);
        this.#FilmDetailsFilmsCountComponent = new FilmDetailsCommentsCountMarkup(film);
        this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup(film);
        this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup();

        renderNodeElement(this.#filmDetailsContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCloseButtonComponent);
        renderNodeElement(this.#filmDetailsContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsInfoComponent);
        renderNodeElement(this.#filmDetailsContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsFilterButtonsComponent);
        renderNodeElement(this.#filmDetailsCommentsWrapElement, positionMarkup.AFTER_BEGIN, this.#FilmDetailsFilmsCountComponent);
        renderNodeElement(this.#filmDetailsCommentsWrapElement, positionMarkup.BEFORE_END, this.#FilmDetailsCommentsComponent);
        renderNodeElement(this.#filmDetailsCommentsWrapElement, positionMarkup.BEFORE_END, this.#FilmDetailsNewCommentComponent);

        break;
      }
    }

    document.addEventListener('click', this.#closeFilmDetailsPopupClickHandler);
    document.addEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    document.addEventListener('click', this.#controlButtonsOnTheFilmDetailsPopupClickHandler);
  }

  #closeFilmDetailsPopupClickHandler = (evt) => {
    if (!evt.target.closest('.film-details__close-btn')) {
      return;
    }

    this.closeFilmDetailsPopup();
  }

  #closeFilmDetailsPopupKeydownHandler = (evt) => {
    if (!onEscKeydown(evt)) {
      return;
    }

    this.closeFilmDetailsPopup();
  }

  #controlButtonsOnTheFilmDetailsPopupClickHandler = (evt) => {
    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    const currentClickedWatchlistButton = evt.target.closest('.film-details__control-button--watchlist');
    const currentClickedWatchedButton = evt.target.closest('.film-details__control-button--watched');
    const currentClickedFavouriteButton = evt.target.closest('.film-details__control-button--favorite');

    let id;
    let currentButtonValueAndUpdatedData;

    if (currentClickedWatchlistButton) {
      id = +currentClickedWatchlistButton.closest('.film-details__controls').id;
      currentButtonValueAndUpdatedData = this._callbacks.controlButtonsChangeData(id, 'isWatchlist');
      this.#films = currentButtonValueAndUpdatedData[1];
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedWatchlistButton, currentButtonValueAndUpdatedData[0]);
    }
    if (currentClickedWatchedButton) {
      id = +currentClickedWatchedButton.closest('.film-details__controls').id;
      currentButtonValueAndUpdatedData = this._callbacks.controlButtonsChangeData(id, 'isWatched');
      this.#films = currentButtonValueAndUpdatedData[1];
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedWatchedButton, currentButtonValueAndUpdatedData[0]);
    }
    if (currentClickedFavouriteButton) {
      id = +currentClickedFavouriteButton.closest('.film-details__controls').id;
      currentButtonValueAndUpdatedData = this._callbacks.controlButtonsChangeData(id, 'isFavorite');
      this.#films = currentButtonValueAndUpdatedData[1];
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedFavouriteButton, currentButtonValueAndUpdatedData[0]);
    }

    this._callbacks.controlButtonsUpdateView(id);
    this._callbacks.navigationMenuUpdateView();
  };

  closeFilmDetailsPopup = () => {
    bodyElement.classList.remove('hide-overflow');
    this.#filmDetailsPopupElement.classList.add('hidden');

    this.#filmDetailsContainerElement.textContent = '';
    this.#filmDetailsCommentsWrapElement.textContent = '';

    document.removeEventListener('click', this.#closeFilmDetailsPopupClickHandler);
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    document.removeEventListener('click', this.#controlButtonsOnTheFilmDetailsPopupClickHandler);
  }

  controlItemButtonOnTheFilmDetailsPopupToggleClass = (currentClickedButton, value) =>
    value ?
      currentClickedButton.classList.add('film-details__control-button--active') :
      currentClickedButton.classList.remove('film-details__control-button--active');


}

export {FilmDetailsPopupPresenter};
