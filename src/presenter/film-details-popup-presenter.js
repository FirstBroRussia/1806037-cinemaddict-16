/* eslint-disable no-fallthrough */
import {footerBodyElement, onEscKeydown, dayjs, setHeadShakingStyleAnimation} from '/src/utils/util.js';
import {removeEnterAndControlKeyUpDownHandlers} from '/src/helpers/two-keys-handlers.js';

import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsCommentFromDataMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {DELETE_BUTTON_STATE, methodsForPopup, METHODS_FOR_API} from '../utils/util';


class FilmDetailsPopupPresenter {
  _callbacks = {};

  #idFilm = null;

  #MainModel = null;

  #filmInfo = null;
  #filmCommentsData = null;
  #idDeletingComment = null;

  #deleteButtonUpdateViewFn = null;

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

  constructor (MainModel, changeMasterData, popupElement) {
    this.#MainModel = MainModel;
    this.#MainModel.odserverAdd(this.#observerNotificationPopupPresenter);

    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.popupElement = popupElement;
  }


  #observerNotificationPopupPresenter = (dataCollection) => {
    const {response, method} = dataCollection;
    this.init(response, method);
  }


  #setData = async (dataList, method) => {
    if (method !== undefined) {
      const {data, responseOk} = dataList;
      switch (method) {
        case 'putMovies' : {
          this.#filmInfo = data;
          break;
        }
        case 'postComment' : {
          this.#filmCommentsData = data.comments;
          break;
        }
        case 'deleteComment' : {
          if (!responseOk) {
            return;
          }
          this.#filmCommentsData = this.#filmCommentsData.slice().filter( (item) => {
            if (item.id === this.#idDeletingComment) {
              return false;
            }
            return true;
          });
          this.#idDeletingComment = null;
        }
      }
      return;
    }
    this.#filmInfo = dataList;
    this.#idFilm = this.#filmInfo.id;
    this.#filmCommentsData = await this.#MainModel.getComments(this.#idFilm);
  }


  async init (data, method) {
    if (method !== undefined) {
      await this.#setData(data, method);
      this.#popupUpdateViewSwitch(method, data);
      return;
    }

    await this.#setData(data);

    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();

    this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(this.#filmInfo);
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#filmInfo);

    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#filmCommentsData);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup();

    this.#filmCommentsData.forEach( (commentData) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(commentData, this.#deleteCommentButtonClickHandler);
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
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(commentData, this.#deleteCommentButtonClickHandler);
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

  #failDeletingComment = () => {
    this.#deleteButtonUpdateViewFn(DELETE_BUTTON_STATE.DEFAULT);
    this.#deleteButtonUpdateViewFn = null;
    setHeadShakingStyleAnimation(this.#FilmDetailsCommentsComponent.element);
    this.#FilmDetailsCommentsComponent.enabledCommentsListElement();
  }

  #failPostNewComment = () => {
    setHeadShakingStyleAnimation(this.#FilmDetailsPopupComponent.element);
    this.#FilmDetailsPopupComponent.formElementEnabled();
  }

  #popupUpdateViewSwitch = async (method, data) => {
    const {responseOk} = data;
    switch (method) {
      case 'putMovies' : {
        this.#updateFilmInfoView();
        break;
      }
      case 'postComment' : {
        if (!responseOk) {
          this.#failPostNewComment();
          return;
        }
        this.#updateCommentsListView();
        this.#updateNewCommentView();
        break;
      }
      case 'deleteComment' : {
        if (!responseOk) {
          this.#failDeletingComment();
          return;
        }
        this.#updateCommentsListView();
        this.#deleteButtonUpdateViewFn = null;
      }
    }
  }


  #changeMasterData = (method, dataList) => {
    this._callbacks.changeMasterData(method, dataList);
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
    const dataList = {
      data: changedData,
      idFilm: this.#idFilm
    };
    this.#changeMasterData(METHODS_FOR_API.PUT_MOVIES, dataList);
  }


  #deleteCommentButtonClickHandler = (idComment, deleteButtonUpdateViewFn) => {
    this.#idDeletingComment = idComment;
    this.#deleteButtonUpdateViewFn = deleteButtonUpdateViewFn;
    this.#deleteButtonUpdateViewFn(DELETE_BUTTON_STATE.DELETING);
    this.#FilmDetailsCommentsComponent.disabledCommentsListElement();
    this.#changeMasterData(METHODS_FOR_API.DELETE_COMMENT, {idComment});
  };


  #submitNewCommentHandler = (newComment) => {
    const dataList = {
      idFilm: this.#idFilm,
      data: newComment
    };
    this.#FilmDetailsPopupComponent.formElementDisabled();
    this.#changeMasterData(METHODS_FOR_API.POST_COMMENT, dataList);
  }

}

export {FilmDetailsPopupPresenter};
