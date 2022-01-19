/* eslint-disable no-fallthrough */
import {footerBodyElement} from '/src/main.js';
import {onEscKeydown, dayjs, setHeadShakingStyleAnimation} from '/src/utils/util.js';
import {removeEnterAndControlKeyUpDownHandlers} from '/src/helpers/two-keys-handlers.js';
import {FilmDetailsPopupMarkup} from '/src/view/film-details-popup-views/film-details-popup-markup.js';
import {FilmDetailInfoMarkup} from '/src/view/film-details-popup-views/film-details-info-markup.js';
import {FilmDetailsCardFilterButtons} from '/src/view/film-details-popup-views/film-details-card-filter-buttons.js';
import {FilmDetailsCommentsCountMarkup} from '/src/view/film-details-popup-views/film-details-comments-count-markup.js';
import {FilmDetailsCommentsListMarkup} from '/src/view/film-details-popup-views/film-details-comments-list-markup.js';
import {FilmDetailsCommentFromDataMarkup} from '/src/view/film-details-popup-views/film-details-comment-from-data-markup.js';
import {FilmDetailsNewCommentMarkup} from '/src/view/film-details-popup-views/film-details-new-comment-markup.js';
import {FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-views/film-details-close-button-markup.js';
import {ErrorResponseForCommentsListMarkup} from '/src/view/error-response-from-server-views/error-response-for-comments-list-markup.js';
import {PositionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {DeleteButtonState, MethodsForPopup, MethodsForAPI, errorResponse} from '../utils/util';


class FilmDetailsPopupPresenter {
  _callbacks = {};

  idFilm = null;

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
  #filmDetailsBottomContainerElement = null;

  #ErrorResponseForCommentsListComponent = null;

  constructor (MainModel, changeMasterData, popupElement) {
    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();

    this.#MainModel = MainModel;
    this.#MainModel.odserverAdd(this.observerNotificationPopupPresenter);

    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.popupElement = popupElement;
  }

  async init (data, method) {
    if (method !== undefined) {
      await this.#setData(data, method);
      this.#popupUpdateViewSwitch(method, data);
      return;
    }

    await this.#setData(data);

    this.#filmDetailsTopContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__top-container');
    this.#filmDetailsBottomContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__bottom-container');

    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();

    this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(this.#filmInfo);
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#filmInfo);

    document.addEventListener('keydown', this._closeFilmDetailsPopupKeydownHandler);
    this.#FilmDetailsCloseButtonComponent.addEventHandler('click', this._closeFilmDetailsPopupClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this._controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this._controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this._controlButtonClickHandler);

    renderNodeElement(this.#filmDetailsTopContainerElement, PositionMarkup.BEFORE_END, this.#FilmDetailsCloseButtonComponent);
    renderNodeElement(this.#filmDetailsTopContainerElement, PositionMarkup.BEFORE_END, this.#FilmDetailsInfoComponent);
    renderNodeElement(this.#filmDetailsTopContainerElement, PositionMarkup.BEFORE_END, this.#FilmDetailsFilterButtonsComponent);

    renderNodeElement(footerBodyElement, PositionMarkup.BEFORE_END, this.#FilmDetailsPopupComponent);

    if (this.#filmCommentsData === null) {
      this.#setErrorResponseMarkupForCommentsList();
      return;
    }

    this.#filmDetailsBottomContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__bottom-container');

    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#filmCommentsData);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentsListMarkup();

    this.#filmCommentsData.forEach( (commentData) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(commentData, this._deleteCommentButtonClickHandler);
      renderNodeElement(this.#FilmDetailsCommentsComponent, PositionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
    });

    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this._submitNewCommentHandler);

    renderNodeElement(this.#filmDetailsBottomContainerElement, PositionMarkup.BEFORE_END, this.#FilmDetailsCommentsCountComponent);
    renderNodeElement(this.#filmDetailsBottomContainerElement, PositionMarkup.BEFORE_END, this.#FilmDetailsCommentsComponent);
    renderNodeElement(this.#filmDetailsBottomContainerElement, PositionMarkup.BEFORE_END, this.#FilmDetailsNewCommentComponent);

  }

  closeFilmDetailsPopup = () => {
    this.#FilmDetailsPopupComponent.remove();
    document.removeEventListener('keydown', this._closeFilmDetailsPopupKeydownHandler);
    removeEnterAndControlKeyUpDownHandlers();
    this.#MainModel.observerRemove(this.observerNotificationPopupPresenter);
    this._callbacks.popupElement(MethodsForPopup.DELETE);
  };

  observerNotificationPopupPresenter = (dataCollection) => {
    const {response, method} = dataCollection;
    this.init(response, method);
  }

  #setData = async (dataList, method) => {
    if (method !== undefined) {
      const {data} = dataList;
      switch (method) {
        case 'putMovies' : {
          this.#filmInfo = data;
          break;
        }
        case 'successPostComment' : {
          this.#filmCommentsData = data.comments;
          break;
        }
        case 'successDeletingComment' : {
          this.#filmCommentsData = this.#filmCommentsData.slice().filter( (item) => {
            if (item.id === this.#idDeletingComment) {
              return false;
            }
            return true;
          });
          this.#idDeletingComment = null;
        }
        default : break;
      }
      return;
    }
    this.#filmInfo = dataList;
    this.idFilm = this.#filmInfo.id;

    const responseFromServer = await this.#MainModel.getComments(this.idFilm);
    if (responseFromServer === errorResponse) {
      this.#filmCommentsData = null;
      return;
    }
    this.#filmCommentsData = await this.#MainModel.getComments(this.idFilm);
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

  #popupUpdateViewSwitch = async (method) => {
    switch (method) {
      case 'putMovies' : {
        this.#updateFilmInfoView();
        break;
      }
      case 'successPostComment' : {
        this.#updateCommentsListView();
        this.#updateNewCommentView();
        this.#FilmDetailsPopupComponent.formElementEnabled();
        break;
      }
      case 'failPostComment' : {
        this.#failPostNewComment();
        break;
      }
      case 'successDeletingComment' : {
        this.#updateCommentsListView();
        this.#deleteButtonUpdateViewFn = null;
        break;
      }
      case 'failDeletingComment' : {
        this.#failDeletingComment();
        this.#FilmDetailsCommentsComponent.enabledCommentsListElement();
        this.#deleteButtonUpdateViewFn = null;
      }
    }
  }

  #updateFilmInfoView = () => {
    const prevFilmDetailsFilterButtonsComponent = this.#FilmDetailsFilterButtonsComponent;
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#filmInfo);
    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this._controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this._controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this._controlButtonClickHandler);
    replaceNodeElementWithoutParent(this.#FilmDetailsFilterButtonsComponent, prevFilmDetailsFilterButtonsComponent);
  }

  #updateCommentsListView = () => {
    const prevFilmDetailsFilmsCountComponent = this.#FilmDetailsCommentsCountComponent;
    const prevFilmDetailsCommentsComponent = this.#FilmDetailsCommentsComponent;
    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#filmCommentsData);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentsListMarkup();

    this.#filmCommentsData.forEach( (commentData) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(commentData, this._deleteCommentButtonClickHandler);
      renderNodeElement(this.#FilmDetailsCommentsComponent, PositionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
    });
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsCountComponent, prevFilmDetailsFilmsCountComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsComponent, prevFilmDetailsCommentsComponent);
  }

  #updateNewCommentView = () => {
    const prevFilmDetailsNewCommentComponent = this.#FilmDetailsNewCommentComponent;
    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this._submitNewCommentHandler);
    replaceNodeElementWithoutParent(this.#FilmDetailsNewCommentComponent, prevFilmDetailsNewCommentComponent);
  }

  #failDeletingComment = () => {
    this.#deleteButtonUpdateViewFn(DeleteButtonState.DEFAULT);
    this.#deleteButtonUpdateViewFn = null;
    setHeadShakingStyleAnimation(this.#FilmDetailsCommentsComponent.element);
    this.#FilmDetailsCommentsComponent.enabledCommentsListElement();
  }

  #failPostNewComment = () => {
    setHeadShakingStyleAnimation(this.#FilmDetailsPopupComponent.element);
    this.#FilmDetailsPopupComponent.formElementEnabled();
  }

  #setErrorResponseMarkupForCommentsList = () => {
    this.#ErrorResponseForCommentsListComponent = new ErrorResponseForCommentsListMarkup();
    renderNodeElement(this.#filmDetailsBottomContainerElement, PositionMarkup.BEFORE_END, this.#ErrorResponseForCommentsListComponent);
  }

  _controlButtonClickHandler = (clickButton) => {
    const changedData = this.#controlButtonsChangeData(clickButton);
    const dataList = {
      data: changedData,
      idFilm: this.idFilm
    };
    this.#changeMasterData(MethodsForAPI.PUT_MOVIES, dataList);
  }

  _deleteCommentButtonClickHandler = (idComment, deleteButtonUpdateViewFn) => {
    this.#idDeletingComment = idComment;
    const dataList = {
      idFilm: this.idFilm,
      idComment: idComment,
    };
    this.#deleteButtonUpdateViewFn = deleteButtonUpdateViewFn;
    this.#deleteButtonUpdateViewFn(DeleteButtonState.DELETING);
    this.#FilmDetailsCommentsComponent.disabledCommentsListElement();
    this.#changeMasterData(MethodsForAPI.DELETE_COMMENT, dataList);
  };

  _submitNewCommentHandler = (newComment) => {
    const dataList = {
      idFilm: this.idFilm,
      data: newComment
    };
    this.#FilmDetailsPopupComponent.formElementDisabled();
    this.#changeMasterData(MethodsForAPI.POST_COMMENT, dataList);
  }

  _closeFilmDetailsPopupClickHandler = () => {
    this.closeFilmDetailsPopup();
  }

  _closeFilmDetailsPopupKeydownHandler = (evt) => {
    if (!onEscKeydown(evt)) {
      return;
    }

    this.closeFilmDetailsPopup();
  }

}

export {FilmDetailsPopupPresenter};
