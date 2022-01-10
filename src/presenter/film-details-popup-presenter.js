/* eslint-disable no-fallthrough */
import {footerBodyElement, onEscKeydown, dayjs} from '/src/utils/util.js';
import {removeEnterAndControlKeyUpDownHandlers} from '/src/helpers/two-keys-handlers.js';

import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsCommentFromDataMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup, DeleteCommentButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {methodsForPopup, METHODS_FOR_API} from '../utils/util';


class FilmDetailsPopupPresenter {
  _callbacks = {};

  #idFilm = null;

  #MainModel = null;

  #filmInfo = null;
  #filmCommentsData = null;
  #idDeletingComment = null;

  #FilmDetailsPopupComponent = null;

  #FilmDetailsCloseButtonComponent = null;

  #FilmDetailsInfoComponent = null;
  #FilmDetailsFilterButtonsComponent = null;
  #FilmDetailsCommentsCountComponent = null;
  #FilmDetailsCommentsComponent = null;
  #FilmDetailsCommentFromDataComponent = null;
  #FilmDetailsDeleteCommentButtonComponent = null;
  #FilmDetailsNewCommentComponent = null;

  #filmDetailsTopContainerElement = null;
  #filmDetailsBottonContainerElement = null;

  constructor (MainModel, changeMasterData, popupElement) {
    this.#MainModel = MainModel;
    this.#MainModel.odserverAdd(this.#observerNotificationPopupPresenter);

    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.popupElement = popupElement;
  }

  #observerNotificationPopupPresenter = (method, response) => {
    if (!response.responseStatus === 200) {
      this.init(response, method);
      throw new Error(`${response.data.responseStatus}`);
    }
    this.init(response, method);
  }

  #updateFilmInfoView = () => {
    const prevFilmDetailsFilterButtonsComponent = this.#FilmDetailsFilterButtonsComponent;
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#filmInfo);
    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this.#controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this.#controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this.#controlButtonClickHandler);
    replaceNodeElementWithoutParent(this.#FilmDetailsFilterButtonsComponent, prevFilmDetailsFilterButtonsComponent);
  }

  #updateCommentsListView = () => {
    const prevFilmDetailsFilmsCountComponent = this.#FilmDetailsCommentsCountComponent;
    const prevFilmDetailsCommentsComponent = this.#FilmDetailsCommentsComponent;
    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#filmCommentsData);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup();

    this.#filmCommentsData.forEach( (commentData) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(commentData);
      this.#FilmDetailsDeleteCommentButtonComponent = new DeleteCommentButtonMarkup(commentData.id, this.#deleteCommentButtonClickHandler);
      const commentWrap = this.#FilmDetailsCommentFromDataComponent.element.querySelector('.film-details__comment-wrap');
      renderNodeElement(commentWrap, positionMarkup.BEFORE_END, this.#FilmDetailsDeleteCommentButtonComponent);
      renderNodeElement(this.#FilmDetailsCommentsComponent, positionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
    });
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsCountComponent, prevFilmDetailsFilmsCountComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsComponent, prevFilmDetailsCommentsComponent);
  }

  #updateNewCommentView = () => {
    const prevFilmDetailsNewCommentComponent = this.#FilmDetailsNewCommentComponent;
    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this.#submitNewCommentHandler);
    replaceNodeElementWithoutParent(this.#FilmDetailsNewCommentComponent, prevFilmDetailsNewCommentComponent);
  }

  #popupUpdateViewSwitch = async (response, method) => {
    switch (method) {
      case 'putMovies' : {
        this.#filmInfo = response.data;

        this.#updateFilmInfoView();
        break;
      }
      case 'postComment' : {
        this.#filmCommentsData = response.data.comments;

        this.#updateCommentsListView();

        this.#updateNewCommentView();
        break;
      }
      case 'deleteComment' : {
        this.#filmCommentsData = this.#filmCommentsData.slice().filter( (item) => {
          if (item.id === this.#idDeletingComment) {
            return false;
          }
          return true;
        });

        this.#updateCommentsListView();
        this.#idDeletingComment = null;
      }
    }
  }

  async init (data, methodUpdatePopup) {
    if (methodUpdatePopup !== undefined) {
      this.#popupUpdateViewSwitch(data, methodUpdatePopup);
      return;
    }

    this.#filmInfo = data;
    this.#idFilm = this.#filmInfo.id;
    this.#filmCommentsData = await this.#MainModel.getData(METHODS_FOR_API.GET_COMMENTS, this.#idFilm);

    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();

    this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(this.#filmInfo);
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#filmInfo);

    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#filmCommentsData);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup();

    this.#filmCommentsData.forEach( (commentData) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(commentData);
      this.#FilmDetailsDeleteCommentButtonComponent = new DeleteCommentButtonMarkup(commentData.id, this.#deleteCommentButtonClickHandler);
      const commentWrap = this.#FilmDetailsCommentFromDataComponent.element.querySelector('.film-details__comment-wrap');
      renderNodeElement(commentWrap, positionMarkup.BEFORE_END, this.#FilmDetailsDeleteCommentButtonComponent);
      renderNodeElement(this.#FilmDetailsCommentsComponent, positionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
    });

    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this.#submitNewCommentHandler);

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

  #changeMasterData = (method, changedData, idFilm, idComment) => {
    switch (method) {
      case 'putMovies' : return this._callbacks.changeMasterData(method, changedData, idFilm);
      case 'postComment' : return this._callbacks.changeMasterData(method, changedData, idFilm);
      case 'deleteComment' : return this._callbacks.changeMasterData(method, changedData, idFilm, idComment);
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
    this.#FilmDetailsPopupComponent.remove();
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    removeEnterAndControlKeyUpDownHandlers();
    this.#MainModel.observerRemove(this.#observerNotificationPopupPresenter);
    this._callbacks.popupElement(methodsForPopup.DELETE);
  };


  #controlButtonClickHandler = (clickButton) => {
    const changedData = this.#controlButtonsChangeData(clickButton);
    this.#changeMasterData(METHODS_FOR_API.PUT_MOVIES, changedData, this.#idFilm);
  }

  #deleteCommentButtonClickHandler = (idComment) => {
    this.#idDeletingComment = idComment;
    this.#changeMasterData(METHODS_FOR_API.DELETE_COMMENT, null, null, idComment);
  };

  #submitNewCommentHandler = (newComment) => {
    this.#changeMasterData(METHODS_FOR_API.POST_COMMENT, newComment, this.#idFilm);
  }


}

export {FilmDetailsPopupPresenter};
