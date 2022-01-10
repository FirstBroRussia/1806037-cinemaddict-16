/* eslint-disable no-fallthrough */
import {footerBodyElement, onEscKeydown, dayjs} from '/src/utils/util.js';
import {removeEnterAndControlKeyUpDownHandlers} from '/src/helpers/two-keys-handlers.js';

import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsCommentFromDataMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {methodsForPopup, METHODS_FOR_API, methodsForPopupUpdateView} from '../utils/util';


class FilmDetailsPopupPresenter {
  _callbacks = {};

  #id = null;
  #MainModel = null;

  #filmInfo = null;
  #filmCommentsData = null;

  #FilmDetailsPopupComponent = null;

  #FilmDetailsCloseButtonComponent = null;

  #FilmDetailsInfoComponent = null;
  #FilmDetailsFilterButtonsComponent = null;
  #FilmDetailsCommentsCountComponent = null;
  #FilmDetailsCommentsComponent = null;
  #FilmDetailsCommentFromDataComponent = null;
  #FilmDetailsNewCommentComponent = null;

  #filmDetailsTopContainerElement = null;
  #filmDetailsBottonContainerElement = null;

  constructor (film, id, MainModel, changeMasterData, popupElement) {
    this.#id = Number(id);
    this.#filmInfo = film;
    this.#MainModel = MainModel;
    this.#MainModel.odserverAdd(this.#observerNotificationPopupPresenter);

    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.popupElement = popupElement;
  }

  #observerNotificationPopupPresenter = (responseStatus, idFilm, method) => {
    if (responseStatus === 200) {
      this.init(method);
    }
  }

  #filmDetailsPopupUpdateView = (updateFilmInfo, updateComments, updateNewComment) => {
    if (updateFilmInfo === 'updateInfo') {
      const prevFilmDetailsFilterButtonsComponent = this.#FilmDetailsFilterButtonsComponent;
      this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#filmInfo);
      this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this.#controlButtonClickHandler);
      this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this.#controlButtonClickHandler);
      this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this.#controlButtonClickHandler);
      replaceNodeElementWithoutParent(this.#FilmDetailsFilterButtonsComponent, prevFilmDetailsFilterButtonsComponent);
    }

    if (updateComments === 'updateComments') {
      const prevFilmDetailsFilmsCountComponent = this.#FilmDetailsCommentsCountComponent;
      const prevFilmDetailsCommentsComponent = this.#FilmDetailsCommentsComponent;
      this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#filmInfo);
      this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup();
      this.#filmCommentsData.forEach( (item) => {
        this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(item, this.#deleteCommentButtonClickHandler);
        renderNodeElement(this.#FilmDetailsCommentsComponent, positionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
      });
      replaceNodeElementWithoutParent(this.#FilmDetailsCommentsCountComponent, prevFilmDetailsFilmsCountComponent);
      replaceNodeElementWithoutParent(this.#FilmDetailsCommentsComponent, prevFilmDetailsCommentsComponent);
    }

    if (updateNewComment === 'updateNewComment') {
      const prevFilmDetailsNewCommentComponent = this.#FilmDetailsNewCommentComponent;
      this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this.#changeMasterData);
      replaceNodeElementWithoutParent(this.#FilmDetailsNewCommentComponent, prevFilmDetailsNewCommentComponent);
    }

  }

  async init (method) {
    if (method !== undefined) {
      this.#popupUpdateViewSwitch(method);
      return;
    }

    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();

    this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(this.#filmInfo);
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#filmInfo);

    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#filmInfo);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup();

    this.#filmCommentsData = await this.#MainModel.getData(METHODS_FOR_API.GET_COMMENTS, this.#id);
    this.#filmCommentsData.forEach( (item) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(item, this.#deleteCommentButtonClickHandler);
      renderNodeElement(this.#FilmDetailsCommentsComponent, positionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
    });

    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this.#changeMasterData);

    this.#filmDetailsTopContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__top-container');
    this.#filmDetailsBottonContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__bottom-container');


    document.addEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    this.#FilmDetailsCloseButtonComponent.addEventHandler('click', this.#closeFilmDetailsPopupClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this.#controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this.#controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this.#controlButtonClickHandler);

    renderNodeElement(this.#filmDetailsTopContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCloseButtonComponent);
    renderNodeElement(this.#filmDetailsTopContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsInfoComponent);
    renderNodeElement(this.#filmDetailsTopContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsFilterButtonsComponent);

    renderNodeElement(this.#filmDetailsBottonContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCommentsCountComponent);
    renderNodeElement(this.#filmDetailsBottonContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCommentsComponent);
    renderNodeElement(this.#filmDetailsBottonContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsNewCommentComponent);

    renderNodeElement(footerBodyElement, positionMarkup.BEFORE_END, this.#FilmDetailsPopupComponent);
  }

  #filmDataToServer = async () => {
    const filmsData = await this.#MainModel.getData(METHODS_FOR_API.GET_MOVIES);
    for (const film of filmsData) {
      if (Number(film.id) === this.#id) {
        this.#filmInfo = film;
        break;
      }
    }
  }

  #changeMasterData = (method, changedData, idComment) => {
    switch (method) {
      case 'putMovies' : return this._callbacks.changeMasterData(method, changedData, this.#id);
      case 'postComment' : return this._callbacks.changeMasterData(method, changedData, this.#id);
      case 'deleteComment' : return this._callbacks.changeMasterData(method, changedData, this.#id, idComment);
    }
  };

  #controlButtonsChangeData = (controlButton) => {
    switch (controlButton) {
      case 'watchlist' : return ({...this.#filmInfo, isWatchlist : !this.#filmInfo.isWatchlist});
      case 'history' : return ({...this.#filmInfo, isWatched : !this.#filmInfo.isWatched, watchingDate: dayjs().format()});
      case 'favorite' : return ({...this.#filmInfo, isFavorite : !this.#filmInfo.isFavorite});
    }
  }

  #closeFilmDetailsPopupClickHandler = () => {
    this.closeFilmDetailsPopup();
  }

  #closeFilmDetailsPopupKeydownHandler = (evt) => {
    if (!onEscKeydown(evt)) {
      return;
    }

    this.closeFilmDetailsPopup();
  }


  closeFilmDetailsPopup = () => {
    // this._callbacks.changeMasterData(this.#id, this.#filmInfo);
    this.#FilmDetailsPopupComponent.remove();
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    removeEnterAndControlKeyUpDownHandlers();
    this._callbacks.popupElement(methodsForPopup.DELETE);
  };

  #controlButtonClickHandler = (clickButton) => {
    const changedData = this.#controlButtonsChangeData(clickButton);
    this.#changeMasterData(METHODS_FOR_API.PUT_MOVIES, changedData);
  }

  #deleteCommentButtonClickHandler = (idComment) => {
    this.#changeMasterData(METHODS_FOR_API.DELETE_COMMENT, null, idComment);
  };

  #popupUpdateViewSwitch = async (method) => {
    switch (method) {
      case 'putMovies' : {
        await this.#filmDataToServer();
        this.#filmDetailsPopupUpdateView(methodsForPopupUpdateView.UPDATE_FILM_INFO);
        return;
      }
      case 'postComment' : {
        await this.#filmDataToServer();
        this.#filmCommentsData = await this.#MainModel.getData(METHODS_FOR_API.GET_COMMENTS, this.#id);
        this.#filmDetailsPopupUpdateView(methodsForPopupUpdateView.UPDATE_FILM_INFO, methodsForPopupUpdateView.UPDATE_COMMENTS, methodsForPopupUpdateView.UPDATE_NEW_COMMENT);
        return;
      }
      case 'deleteComment' : {
        await this.#filmDataToServer();
        this.#filmCommentsData = await this.#MainModel.getData(METHODS_FOR_API.GET_COMMENTS, this.#id);
        this.#filmDetailsPopupUpdateView(methodsForPopupUpdateView.UPDATE_FILM_INFO, methodsForPopupUpdateView.UPDATE_COMMENTS);
      }
    }
  }

}

export {FilmDetailsPopupPresenter};
