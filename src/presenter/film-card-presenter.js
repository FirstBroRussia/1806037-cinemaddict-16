import {FilmCardMarkup, FilmCardInfoMarkup, ControlButtonsOnTheFilmCardMarkup} from '/src/view/film-card-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {controlButtons} from '/src/main.js';

import {FilmDetailsPopupPresenter} from '/src/presenter/film-details-popup-presenter.js';


class FilmCardPresenter {
  #film = null;
  #id = null;
  _callbacks = {};

  #FilmCardComponent = null;
  #FilmCardInfoComponent = null;
  #FilmCardControlButtonsComponent = null;

  #FilmDetailsPopupPresenter = null;

  constructor (changeMasterData) {
    this._callbacks.changeMasterData = changeMasterData;
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


  #controlButtonsChangeData = (controlButton) => {
    switch (controlButton) {
      case 'isWatchlist' : return ({...this.#film, isWatchlist : !this.#film.isWatchlist});
      case 'isWatched' : return ({...this.#film, isWatched : !this.#film.isWatched});
      case 'isFavorite' : return ({...this.#film, isFavorite : !this.#film.isFavorite});
    }
  }

  #watchlistButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeData(controlButtons.isWatchlist);
    this._callbacks.changeMasterData(this.#id, changedData);
  }

  #watchedButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeData(controlButtons.isWatched);
    this._callbacks.changeMasterData(this.#id, changedData);
  }

  #favoriteButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeData(controlButtons.isFavorite);
    this._callbacks.changeMasterData(this.#id, changedData);
  }


  #openPopupClickHandler = () => {
    this.#FilmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this._callbacks.changeMasterData, this.#destroyPopupPresenter);
    this.#FilmDetailsPopupPresenter.render(this.#film);
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

  #destroyPopupPresenter = () => {
    this.#FilmDetailsPopupPresenter = null;
  }

  destroy () {
    this.#FilmCardComponent.remove();
    this.#FilmCardComponent = null;
  }
}

export {FilmCardPresenter};
