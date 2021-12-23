import {FilmCardMarkup, FilmCardInfoMarkup, ControlButtonsOnTheFilmCardMarkup} from '/src/view/film-card-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {controlButtons} from '/src/utils/util.js';

import {FilmDetailsPopupPresenter} from '/src/presenter/film-details-popup-presenter.js';


class FilmCardPresenter {
  #film = null;
  #id = null;
  _callbacks = {};

  #FilmCardComponent = null;
  #FilmCardInfoComponent = null;
  #FilmCardControlButtonsComponent = null;

  #FilmDetailsPopupPresenter = null;

  constructor (changeMasterData, getOpenPopupElement) {
    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.getOpenPopupElement = getOpenPopupElement;
  }

  render (film) {
    if (!film) {
      return this.#FilmCardComponent;
    }
    if (this.#film !== null) {
      this.#film = {...film};
      this.#id = this.#film.id;
      this.updateCardComponent();
      return;
    }

    this.#film = {...film};
    this.#id = this.#film.id;

    this.#FilmCardComponent = new FilmCardMarkup(this.#film);
    this.#FilmCardComponent.addEventHandler('click', this.#openPopupClickHandler);

    this.#FilmCardInfoComponent = new FilmCardInfoMarkup(this.#film);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardInfoComponent);

    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.#film);
    this.#FilmCardControlButtonsComponent.setWatchlistClickHandler('click', this.#watchlistButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setWatchedClickHandler('click', this.#watchedButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setFavoriteClickHandler('click', this.#favoriteButtonClickHandler);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardControlButtonsComponent);

    return this.#FilmCardComponent;
  }


  #controlButtonsChangeDataSwitch = (value) => {
    switch (value) {
      case 'watchlist' : return ({...this.#film, isWatchlist : !this.#film.isWatchlist});
      case 'history' : return ({...this.#film, isWatched : !this.#film.isWatched});
      case 'favorite' : return ({...this.#film, isFavorite : !this.#film.isFavorite});
    }
  }

  #watchlistButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeDataSwitch(controlButtons.isWatchlist);
    this._callbacks.changeMasterData(this.#id, changedData, controlButtons.isWatchlist);
  }

  #watchedButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeDataSwitch(controlButtons.isWatched);
    this._callbacks.changeMasterData(this.#id, changedData, controlButtons.isWatched);
  }

  #favoriteButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeDataSwitch(controlButtons.isFavorite);
    this._callbacks.changeMasterData(this.#id, changedData, controlButtons.isFavorite);
  }


  #openPopupClickHandler = () => {
    if (this._callbacks.getOpenPopupElement() !== null) {
      this._callbacks.getOpenPopupElement().closeFilmDetailsPopup();
      this._callbacks.getOpenPopupElement(null);
    }
    this.#FilmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this._callbacks.changeMasterData, this.#clearPopupPresenter, this._callbacks.getOpenPopupElement);
    this.#FilmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this._callbacks.changeMasterData, this.#clearPopupPresenter, this._callbacks.getOpenPopupElement);
    this.#FilmDetailsPopupPresenter.render(this.#film);
    this._callbacks.getOpenPopupElement(this.#FilmDetailsPopupPresenter);
  }


  updateCardComponent = () => {
    const prevFilmCardComponent = this.#FilmCardComponent;

    this.#FilmCardComponent = new FilmCardMarkup(this.#film);
    this.#FilmCardComponent.addEventHandler('click', this.#openPopupClickHandler);

    this.#FilmCardInfoComponent = new FilmCardInfoMarkup(this.#film);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardInfoComponent);

    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.#film);
    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.#film);
    this.#FilmCardControlButtonsComponent.setWatchlistClickHandler('click', this.#watchlistButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setWatchedClickHandler('click', this.#watchedButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setFavoriteClickHandler('click', this.#favoriteButtonClickHandler);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardControlButtonsComponent);

    replaceNodeElementWithoutParent(this.#FilmCardComponent, prevFilmCardComponent);

    if (this.#FilmDetailsPopupPresenter !== null) {
      this.#FilmDetailsPopupPresenter.render(this.#film);
    }
  }

  #clearPopupPresenter = () => {
    this.#FilmDetailsPopupPresenter = null;
  }

  destroy () {
    this.#FilmCardComponent.remove();
    this.#FilmCardComponent = null;
  }
}

export {FilmCardPresenter};
