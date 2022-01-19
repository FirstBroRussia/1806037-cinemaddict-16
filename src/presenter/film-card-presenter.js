import FilmCardMarkup from '/src/view/film-card-views/film-card-markup.js';
import FilmCardInfoMarkup from '/src/view/film-card-views/film-card-info-markup.js';
import ControlButtonsOnTheFilmCardMarkup from '/src/view/film-card-views/control-buttons-on-the-film-card-markup.js';

import {PositionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';

import {MethodsForPopup, dayjs, MethodsForAPI} from '../utils/util';


export default class FilmCardPresenter {
  film = null;
  idFilm = null;
  _callbacks = {};

  #FilmCardComponent = null;
  #FilmCardInfoComponent = null;
  #FilmCardControlButtonsComponent = null;


  constructor (changeMasterData, popupElement) {
    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.popupElement = popupElement;
  }


  render (film) {
    if (!film) {
      return this.#FilmCardComponent;
    }
    if (this.film !== null) {
      this.film = {...film};
      this.idFilm = this.film.id;
      this.#updateCardComponent();
      return;
    }

    this.film = {...film};
    this.idFilm = this.film.id;

    this.#FilmCardComponent = new FilmCardMarkup(this.film);
    this.#FilmCardComponent.addEventHandler('click', this._openPopupClickHandler);

    this.#FilmCardInfoComponent = new FilmCardInfoMarkup(this.film);
    renderNodeElement(this.#FilmCardComponent, PositionMarkup.BEFORE_END, this.#FilmCardInfoComponent);

    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.film);
    this.#FilmCardControlButtonsComponent.setWatchlistClickHandler('click', this._controlButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setWatchedClickHandler('click', this._controlButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setFavoriteClickHandler('click', this._controlButtonClickHandler);
    renderNodeElement(this.#FilmCardComponent, PositionMarkup.BEFORE_END, this.#FilmCardControlButtonsComponent);

    return this.#FilmCardComponent;
  }

  destroy () {
    this.#FilmCardComponent.remove();
    this.#FilmCardComponent = null;
  }

  #controlButtonsChangeDataSwitch = (value) => {
    switch (value) {
      case 'watchlist' : return ({...this.film, isWatchlist : !this.film.isWatchlist});
      case 'history' : return ({...this.film, isWatched : !this.film.isWatched, watchingDate: dayjs().format()});
      case 'favorite' : return ({...this.film, isFavorite : !this.film.isFavorite});
    }
  }

  #updateCardComponent = () => {
    const prevFilmCardComponent = this.#FilmCardComponent;

    this.#FilmCardComponent = new FilmCardMarkup(this.film);
    this.#FilmCardComponent.addEventHandler('click', this._openPopupClickHandler);

    this.#FilmCardInfoComponent = new FilmCardInfoMarkup(this.film);
    renderNodeElement(this.#FilmCardComponent, PositionMarkup.BEFORE_END, this.#FilmCardInfoComponent);

    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.film);
    this.#FilmCardControlButtonsComponent = new ControlButtonsOnTheFilmCardMarkup(this.film);
    this.#FilmCardControlButtonsComponent.setWatchlistClickHandler('click', this._controlButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setWatchedClickHandler('click', this._controlButtonClickHandler);
    this.#FilmCardControlButtonsComponent.setFavoriteClickHandler('click', this._controlButtonClickHandler);
    renderNodeElement(this.#FilmCardComponent, PositionMarkup.BEFORE_END, this.#FilmCardControlButtonsComponent);

    replaceNodeElementWithoutParent(this.#FilmCardComponent, prevFilmCardComponent);
  }

  _controlButtonClickHandler = (clickButton) => {
    const changedData = this.#controlButtonsChangeDataSwitch(clickButton);
    const dataList = {
      data: changedData,
      idFilm: this.idFilm
    };
    this._callbacks.changeMasterData(MethodsForAPI.PUT_MOVIES, dataList);
  }

  _openPopupClickHandler = () => {
    const dataList = {
      data: this.film,
      callbacks: [this._callbacks.changeMasterData, this._callbacks.popupElement]
    };
    this._callbacks.popupElement(MethodsForPopup.CREATE, dataList);
  }

}
