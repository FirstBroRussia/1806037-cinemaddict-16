import {FilmCardMarkup, FilmCardInfoMarkup, ControlButtonsOnTheFilmCardMarkup} from '/src/view/film-card-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';
import {INITIAL_FILMS_CARD_COUNT, controlButtons} from '/src/main.js';

import {FilmDetailsPopupPresenter} from '/src/presenter/film-details-popup-presenter.js';


class FilmCardPresenter {
  _callbacks = {};

  #FilmCardComponent = null;
  #FilmCardInfoComponent = null;
  #FilmCardControlButtonsComponent = null;

  #film = null;

  constructor (film, controlButtonsChangeData) {
    this.#film = film;

    this._callbacks.controlButtonsChangeData = controlButtonsChangeData;

    this.filmsListContainer = document.querySelector('.films-list__container');
    this.topRatedFilmsListContainer = document.querySelector('.films-list__container.top-rated');
    this.mostCommentedFilmsListContainer = document.querySelector('.films-list__container.most-commented');

  }

  #controlButtonsClickHandler = (evt) => {
    if (!evt.target.closest('.film-card__controls-item')) {
      return;
    }

    const currentClickedWatchlistButton = evt.target.closest('.film-card__controls-item--add-to-watchlist');
    const currentClickedWatchedButton = evt.target.closest('.film-card__controls-item--mark-as-watched');
    const currentClickedFavouriteButton = evt.target.closest('.film-card__controls-item--favorite');
    let id;

    if (currentClickedWatchlistButton) {
      id = Number(currentClickedWatchlistButton.closest('article').id);
      this._callbacks.controlButtonsChangeData(id, controlButtons.isWatchlist);
    }
    if (currentClickedWatchedButton) {
      id = Number(currentClickedWatchedButton.closest('article').id);
      this._callbacks.controlButtonsChangeData(id, controlButtons.isWatched);
    }
    if (currentClickedFavouriteButton) {
      id = Number(currentClickedFavouriteButton.closest('article').id);
      this._callbacks.controlButtonsChangeData(id, controlButtons.isFavorite);
    }
  };


  #openPopupClickHandler = (evt) => {
    if (evt.target.closest('.film-card__controls-item') || !evt.target.closest('article[class^="film-card"]')) {
      return;
    }
    const currentIdFilmCard = +evt.target.closest('article[class^="film-card"]').getAttribute('id');
    // this.#FilmDetailsPopupPresenter.init(currentIdFilmCard, this.#films);
  }


  render () {
    this.#FilmCardComponent = new FilmCardMarkup(this.#film);
    this.#FilmCardComponent.addEventHandler('click', this.#openPopupClickHandler);

    this.#FilmCardInfoComponent = new FilmCardInfoMarkup(this.#film);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardInfoComponent);

    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.#film);
    this.#FilmCardControlButtonsComponent.addEventHandler('click', this.#controlButtonsClickHandler);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardControlButtonsComponent);

    return this.#FilmCardComponent.element;
  }

}

export {FilmCardPresenter};
