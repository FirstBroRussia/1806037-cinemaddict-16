import {FilmCardMarkup, FilmCardInfoMarkup, ControlButtonsOnTheFilmCardMarkup} from '/src/view/film-card-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {controlButtons} from '/src/main.js';

import {FilmDetailsPopupPresenter} from '/src/presenter/film-details-popup-presenter.js';


class FilmCardPresenter {
  #film = null;
  _callbacks = {};

  #FilmCardComponent = null;
  #FilmCardInfoComponent = null;
  #FilmCardControlButtonsComponent = null;

  #FilmDetailsPopupPresenter = null;

  constructor (film, changeMasterData) {
    this.#film = {...film};
    this._callbacks.changeMasterData = changeMasterData;

    this.#FilmCardComponent = new FilmCardMarkup(this.#film);
    this.#FilmCardInfoComponent = new FilmCardInfoMarkup(this.#film);
    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.#film);
  }

  render () {
    this.#FilmCardComponent.addEventHandler('click', this.#openPopupClickHandler);
    this.#FilmCardControlButtonsComponent.addEventHandler('click', this.#controlButtonsClickHandler);

    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardInfoComponent);
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
      const changedData = this.#controlButtonsChangeData(controlButtons.isWatchlist);
      this._callbacks.changeMasterData(id, changedData);
    }
    if (currentClickedWatchedButton) {
      id = Number(currentClickedWatchedButton.closest('article').id);
      const changedData = this.#controlButtonsChangeData(controlButtons.isWatched);
      this._callbacks.changeMasterData(id, changedData);
    }
    if (currentClickedFavouriteButton) {
      id = Number(currentClickedFavouriteButton.closest('article').id);
      const changedData = this.#controlButtonsChangeData(controlButtons.isFavorite);
      this._callbacks.changeMasterData(id, changedData);
    }
  };


  #openPopupClickHandler = (evt) => {
    if (evt.target.closest('.film-card__controls-item') || !evt.target.closest('article[class^="film-card"]')) {
      return;
    }

    this.#FilmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this.#film, this._callbacks.changeMasterData, this.#destroyPopupPresenter);
    this.#FilmDetailsPopupPresenter.render();
  }


  changeFilmCard = (film) => {
    this.#film = {...film};

    const prevFilmCardComponent = this.#FilmCardComponent;

    this.#FilmCardComponent = new FilmCardMarkup(this.#film);
    this.#FilmCardComponent.addEventHandler('click', this.#openPopupClickHandler);

    this.#FilmCardInfoComponent = new FilmCardInfoMarkup(this.#film);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardInfoComponent);

    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.#film);
    this.#FilmCardControlButtonsComponent.addEventHandler('click', this.#controlButtonsClickHandler);
    renderNodeElement(this.#FilmCardComponent, positionMarkup.BEFORE_END, this.#FilmCardControlButtonsComponent);

    replaceNodeElementWithoutParent(this.#FilmCardComponent, prevFilmCardComponent);

    if (this.#FilmDetailsPopupPresenter !== null) {
      this.#FilmDetailsPopupPresenter.filmDetailsPopupUpdateView(this.#film);
    }
  }

  #destroyPopupPresenter = () => {
    this.#FilmDetailsPopupPresenter = null;
  }
}

export {FilmCardPresenter};
