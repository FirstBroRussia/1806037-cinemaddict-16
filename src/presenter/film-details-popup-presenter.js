import {footerBodyElement, controlButtons, onEscKeydown, closeButtonAction} from '/src/utils/util.js';

import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';


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
  #FilmDetailsNewCommentComponent = null;

  #filmDetailsTopContainerElement = null;
  #filmDetailsBottonContainerElement = null;

  constructor (changeMasterData, getClearCurrentPresenter, getOpenPopupElement) {
    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.destroyCurrentPresenter = getClearCurrentPresenter;
    this._callbacks.getOpenPopupElement = getOpenPopupElement;

    // document.styleSheets[0].addRule('* body *:not(.film-details)','pointer-events: none;');
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
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup(this.#film);
    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup();

    this.#filmDetailsTopContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__top-container');
    this.#filmDetailsBottonContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__bottom-container');


    document.addEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    this.#FilmDetailsCloseButtonComponent.addEventHandler('click', this.#closeFilmDetailsPopupClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this.#watchlistButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this.#watchedButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this.#favoriteButtonClickHandler);

    renderNodeElement(this.#filmDetailsTopContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCloseButtonComponent);
    renderNodeElement(this.#filmDetailsTopContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsInfoComponent);
    renderNodeElement(this.#filmDetailsTopContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsFilterButtonsComponent);

    renderNodeElement(this.#filmDetailsBottonContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCommentsCountComponent);
    renderNodeElement(this.#filmDetailsBottonContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCommentsComponent);
    renderNodeElement(this.#filmDetailsBottonContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsNewCommentComponent);

    renderNodeElement(footerBodyElement, positionMarkup.BEFORE_END, this.#FilmDetailsPopupComponent);
  }


  #controlButtonsChangeData = (controlButton) => {
    switch (controlButton) {
      case 'watchlist' : return ({...this.#film, isWatchlist : !this.#film.isWatchlist});
      case 'history' : return ({...this.#film, isWatched : !this.#film.isWatched});
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

    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#film);
    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#film);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup(this.#film);

    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this.#watchlistButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this.#watchedButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this.#favoriteButtonClickHandler);

    replaceNodeElementWithoutParent(this.#FilmDetailsFilterButtonsComponent, prevFilmDetailsFilterButtonsComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsCountComponent, prevFilmDetailsFilmsCountComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsComponent, prevFilmDetailsCommentsComponent);
  }

  closeFilmDetailsPopup = () => {
    this._callbacks.changeMasterData(this.#id, this.#film, closeButtonAction);
    this._callbacks.getOpenPopupElement(null);
    this.#FilmDetailsPopupComponent.remove();
    this._callbacks.destroyCurrentPresenter();
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);

  };

  #watchlistButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeData(controlButtons.isWatchlist);
    this.#insideUpdateData(changedData);
  }

  #watchedButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeData(controlButtons.isWatched);
    this.#insideUpdateData(changedData);
  }

  #favoriteButtonClickHandler = () => {
    const changedData = this.#controlButtonsChangeData(controlButtons.isFavorite);
    this.#insideUpdateData(changedData);
  }

  #insideUpdateData = (film) => {
    this.#film = {...film};
    this.#insideUpdateView();
  };

  #insideUpdateView = () => {
    const prevFilmDetailsFilterButtonsComponent = this.#FilmDetailsFilterButtonsComponent;
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#film);
    this.#FilmDetailsFilterButtonsComponent.setWatchlistClickHandler('click', this.#watchlistButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setWatchedClickHandler('click', this.#watchedButtonClickHandler);
    this.#FilmDetailsFilterButtonsComponent.setFavoriteClickHandler('click', this.#favoriteButtonClickHandler);
    replaceNodeElementWithoutParent(this.#FilmDetailsFilterButtonsComponent, prevFilmDetailsFilterButtonsComponent);
  };


}

export {FilmDetailsPopupPresenter};
