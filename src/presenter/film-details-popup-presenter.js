import {footerBodyElement, onEscKeydown, dayjs} from '/src/utils/util.js';
import {removeEnterAndControlKeyUpDownHandlers} from '/src/helpers/two-keys-handlers.js';

import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsCommentFromDataMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {methodsForPopup} from '../utils/util';


class FilmDetailsPopupPresenter {
  _callbacks = {};
  #id = null;
  #film = null;

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

  constructor (changeMasterData, popupElement) {
    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.popupElement = popupElement;
  }

  render (film) {
    if (this.#film !== null) {
      this.#film = {...film};
      this.#id = Number(this.#film.id);
      this.filmDetailsPopupUpdateView();
      return;
    }
    this.#film = {...film};
    this.#id = Number(this.#film.id);

    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();

    this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(this.#film);
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#film);

    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#film);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup();
    this.#film.comments.forEach( (item) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(item, this.#deleteCommentButtonClickHandler);
      renderNodeElement(this.#FilmDetailsCommentsComponent, positionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
    });

    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this.#film, this.#changeData);

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

  #changeData = (changedData) => {
    this._callbacks.changeMasterData(this.#id, changedData);
  };

  #controlButtonsChangeData = (controlButton) => {
    switch (controlButton) {
      case 'watchlist' : return ({...this.#film, isWatchlist : !this.#film.isWatchlist});
      case 'history' : return ({...this.#film, isWatched : !this.#film.isWatched, watchingDate: dayjs().format()});
      case 'favorite' : return ({...this.#film, isFavorite : !this.#film.isFavorite});
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

  filmDetailsPopupUpdateView = () => {
    const prevFilmDetailsFilterButtonsComponent = this.#FilmDetailsFilterButtonsComponent;
    const prevFilmDetailsFilmsCountComponent = this.#FilmDetailsCommentsCountComponent;
    const prevFilmDetailsCommentsComponent = this.#FilmDetailsCommentsComponent;
    const prevFilmDetailsNewCommentComponent = this.#FilmDetailsNewCommentComponent;

    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#film);
    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#film);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup();
    this.#film.comments.forEach( (item) => {
      this.#FilmDetailsCommentFromDataComponent = new FilmDetailsCommentFromDataMarkup(item, this.#deleteCommentButtonClickHandler);
      renderNodeElement(this.#FilmDetailsCommentsComponent, positionMarkup.BEFORE_END, this.#FilmDetailsCommentFromDataComponent);
    });
    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup(this.#film, this.#changeData);

    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this.#controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this.#controlButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this.#controlButtonClickHandler);

    replaceNodeElementWithoutParent(this.#FilmDetailsFilterButtonsComponent, prevFilmDetailsFilterButtonsComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsCountComponent, prevFilmDetailsFilmsCountComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsComponent, prevFilmDetailsCommentsComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsNewCommentComponent, prevFilmDetailsNewCommentComponent);
  }

  closeFilmDetailsPopup = () => {
    this._callbacks.changeMasterData(this.#id, this.#film);
    this.#FilmDetailsPopupComponent.remove();
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    removeEnterAndControlKeyUpDownHandlers();
    this._callbacks.popupElement(methodsForPopup.DELETE);
  };

  #controlButtonClickHandler = (clickButton) => {
    const changedData = this.#controlButtonsChangeData(clickButton);
    this.#changeData(changedData);
  }

  #deleteCommentButtonClickHandler = (idComment) => {
    let changedData;
    changedData = {...this.#film};
    const changedCommentsList = changedData.comments.filter( (item) => {
      if (item.id === idComment) {
        return false;
      }
      return true;
    });
    changedData = {...changedData, comments: changedCommentsList};
    this.#changeData(changedData);
  };

}

export {FilmDetailsPopupPresenter};
