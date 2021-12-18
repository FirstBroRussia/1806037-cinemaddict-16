import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {onEscKeydown} from '/src/utils/util.js';
import {footerBodyElement, controlButtons} from '/src/main.js';


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

  constructor (film, changeMasterData, currentPresenter) {
    this.#film = {...film};
    this.#id = Number(this.#film.id);
    this._callbacks.changeMasterData = changeMasterData;
    this._callbacks.destroyCurrentPresenter = currentPresenter;

    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();

    this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(this.#film);
    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#film, this.#controlButtonsClickHandler);
    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#film);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup(this.#film);
    this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup();

    this.#filmDetailsTopContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__top-container');
    this.#filmDetailsBottonContainerElement = this.#FilmDetailsPopupComponent.element.querySelector('.film-details__bottom-container');
  }

  render () {
    document.addEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    this.#FilmDetailsCloseButtonComponent.addEventHandler('click', this.#closeFilmDetailsPopupClickHandler);
    this.#FilmDetailsFilterButtonsComponent.addEventHandler('click', this.#controlButtonsClickHandler);

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
      case 'isWatchlist' : return ({...this.#film, isWatchlist : !this.#film.isWatchlist});
      case 'isWatched' : return ({...this.#film, isWatched : !this.#film.isWatched});
      case 'isFavorite' : return ({...this.#film, isFavorite : !this.#film.isFavorite});
    }
  }

  #closeFilmDetailsPopupClickHandler = (evt) => {
    if (!evt.target.closest('.film-details__close-btn')) {
      return;
    }

    this.closeFilmDetailsPopup();
  }

  #closeFilmDetailsPopupKeydownHandler = (evt) => {
    if (!onEscKeydown(evt)) {
      return;
    }

    this.closeFilmDetailsPopup();
  }

  #controlButtonsClickHandler = (evt) => {
    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    const currentClickedWatchlistButton = evt.target.closest('.film-details__control-button--watchlist');
    const currentClickedWatchedButton = evt.target.closest('.film-details__control-button--watched');
    const currentClickedFavouriteButton = evt.target.closest('.film-details__control-button--favorite');

    if (currentClickedWatchlistButton) {
      const changedData = this.#controlButtonsChangeData(controlButtons.isWatchlist);
      this._callbacks.changeMasterData(this.#id, changedData);
    }
    if (currentClickedWatchedButton) {
      const changedData = this.#controlButtonsChangeData(controlButtons.isWatched);
      this._callbacks.changeMasterData(this.#id, changedData);
    }
    if (currentClickedFavouriteButton) {
      const changedData = this.#controlButtonsChangeData(controlButtons.isFavorite);
      this._callbacks.changeMasterData(this.#id, changedData);
    }
  };


  filmDetailsPopupUpdateView = (film) => {
    this.#film = {...film};

    const prevFilmDetailsFilterButtonsComponent = this.#FilmDetailsFilterButtonsComponent;
    const prevFilmDetailsFilmsCountComponent = this.#FilmDetailsCommentsCountComponent;
    const prevFilmDetailsCommentsComponent = this.#FilmDetailsCommentsComponent;

    this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(this.#film);
    this.#FilmDetailsCommentsCountComponent = new FilmDetailsCommentsCountMarkup(this.#film);
    this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup(this.#film);


    this.#FilmDetailsFilterButtonsComponent.addEventHandler('click', this.#controlButtonsClickHandler);

    replaceNodeElementWithoutParent(this.#FilmDetailsFilterButtonsComponent, prevFilmDetailsFilterButtonsComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsCountComponent, prevFilmDetailsFilmsCountComponent);
    replaceNodeElementWithoutParent(this.#FilmDetailsCommentsComponent, prevFilmDetailsCommentsComponent);
  }

  closeFilmDetailsPopup = () => {
    this.#FilmDetailsPopupComponent.remove();
    this._callbacks.destroyCurrentPresenter();
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
  };

}

export {FilmDetailsPopupPresenter};
