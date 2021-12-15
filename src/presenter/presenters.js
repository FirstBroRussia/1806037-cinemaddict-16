import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {FilmsListMarkup} from '/src/view/films-list-view.js';
import {FilmCardMarkup, ControlButtonsOnTheFilmCardMarkup} from '/src/view/film-card-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';
import {onEscKeydown} from '/src/utils/util.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';

const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');


class FilmDetailsPopupPresenter {
  _callbacks = {};
  #id = null;
  #films = null;

  #FilmDetailsCloseButtonComponent = null;

  #FilmDetailsInfoComponent = null;
  #FilmDetailsFilterButtonsComponent = null;
  #FilmDetailsFilmsCountComponent = null;
  #FilmDetailsCommentsComponent = null;
  #FilmDetailsNewCommentComponent = null;

  #filmDetailsPopupElement = null;
  #filmDetailsContainerElement = null;
  #filmDetailsCommentsWrapElement = null;

  constructor (callbacks) {
    this._callbacks = callbacks;

    this.#filmDetailsPopupElement = document.querySelector('.film-details');
    this.#filmDetailsContainerElement = this.#filmDetailsPopupElement.querySelector('.film-details__top-container');
    this.#filmDetailsCommentsWrapElement = this.#filmDetailsPopupElement.querySelector('.film-details__comments-wrap');

    this.#FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();
  }

  init (id, films) {
    this.#id = id;
    this.#films = films;
    this.#openFilmDetailsPopup();
  }

  #openFilmDetailsPopup = () => {
    this.#filmDetailsPopupElement.classList.remove('hidden');

    for (const film of this.#films) {
      if (film.id === this.#id) {
        this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(film);
        this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(film);
        this.#FilmDetailsFilmsCountComponent = new FilmDetailsCommentsCountMarkup(film);
        this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup(film);
        this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup();

        renderNodeElement(this.#filmDetailsContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsCloseButtonComponent);
        renderNodeElement(this.#filmDetailsContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsInfoComponent);
        renderNodeElement(this.#filmDetailsContainerElement, positionMarkup.BEFORE_END, this.#FilmDetailsFilterButtonsComponent);
        renderNodeElement(this.#filmDetailsCommentsWrapElement, positionMarkup.AFTER_BEGIN, this.#FilmDetailsFilmsCountComponent);
        renderNodeElement(this.#filmDetailsCommentsWrapElement, positionMarkup.BEFORE_END, this.#FilmDetailsCommentsComponent);
        renderNodeElement(this.#filmDetailsCommentsWrapElement, positionMarkup.BEFORE_END, this.#FilmDetailsNewCommentComponent);

        break;
      }
    }

    document.addEventListener('click', this.#closeFilmDetailsPopupClickHandler);
    document.addEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    document.addEventListener('click', this.#controlButtonsOnTheFilmDetailsPopupClickHandler);
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

  #controlButtonsOnTheFilmDetailsPopupClickHandler = (evt) => {
    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    const currentClickedWatchlistButton = evt.target.closest('.film-details__control-button--watchlist');
    const currentClickedWatchedButton = evt.target.closest('.film-details__control-button--watched');
    const currentClickedFavouriteButton = evt.target.closest('.film-details__control-button--favorite');

    let id;
    let currentButtonValueAndUpdatedData;

    if (currentClickedWatchlistButton) {
      id = +currentClickedWatchlistButton.closest('.film-details__controls').id;
      currentButtonValueAndUpdatedData = this._callbacks.controlButtonsChangeData(id, 'isWatchlist');
      this.#films = currentButtonValueAndUpdatedData[1];
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedWatchlistButton, currentButtonValueAndUpdatedData[0]);
    }
    if (currentClickedWatchedButton) {
      id = +currentClickedWatchedButton.closest('.film-details__controls').id;
      currentButtonValueAndUpdatedData = this._callbacks.controlButtonsChangeData(id, 'isWatched');
      this.#films = currentButtonValueAndUpdatedData[1];
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedWatchedButton, currentButtonValueAndUpdatedData[0]);
    }
    if (currentClickedFavouriteButton) {
      id = +currentClickedFavouriteButton.closest('.film-details__controls').id;
      currentButtonValueAndUpdatedData = this._callbacks.controlButtonsChangeData(id, 'isFavorite');
      this.#films = currentButtonValueAndUpdatedData[1];
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedFavouriteButton, currentButtonValueAndUpdatedData[0]);
    }

    this._callbacks.controlButtonsUpdateView(id);
    this._callbacks.navigationMenuUpdateView();
  };

  closeFilmDetailsPopup = () => {
    bodyElement.classList.remove('hide-overflow');
    this.#filmDetailsPopupElement.classList.add('hidden');

    this.#filmDetailsContainerElement.textContent = '';
    this.#filmDetailsCommentsWrapElement.textContent = '';

    document.removeEventListener('click', this.#closeFilmDetailsPopupClickHandler);
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    document.removeEventListener('click', this.#controlButtonsOnTheFilmDetailsPopupClickHandler);
  }

  controlItemButtonOnTheFilmDetailsPopupToggleClass = (currentClickedButton, value) =>
    value ?
      currentClickedButton.classList.add('film-details__control-button--active') :
      currentClickedButton.classList.remove('film-details__control-button--active');


}

class FilmCardPresenter {
  _callbacks = {};

  #FilmDetailsPopupPresenter = null;

  #films = null;
  #topRatedSortFilms = null;
  #mostCommentedSortFilms = null;


  constructor (...callbacks) {
    this._callbacks.controlButtonsChangeData = callbacks[0];
    this._callbacks.navigationMenuUpdateView = callbacks[1];
    this._callbacks.controlButtonsUpdateView = this.controlButtonsUpdateView;

    this.#FilmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this._callbacks);

    this.filmsListContainer = document.querySelector('.films-list__container');
    this.topRatedFilmsListContainer = document.querySelector('.films-list__container.top-rated');
    this.mostCommentedFilmsListContainer = document.querySelector('.films-list__container.most-commented');

  }

  renderFilmCard (films, container) {
    films.forEach( (film, index) => {
      if (index >= INITIAL_FILMS_CARD_COUNT) {
        renderNodeElement(container, positionMarkup.BEFORE_END, new FilmCardMarkup(film, true));
        renderNodeElement(container.lastElementChild, positionMarkup.BEFORE_END, new ControlButtonsOnTheFilmCardMarkup(film));
      } else {
        renderNodeElement(container, positionMarkup.BEFORE_END, new FilmCardMarkup(film));
        renderNodeElement(container.lastElementChild, positionMarkup.BEFORE_END, new ControlButtonsOnTheFilmCardMarkup(film));
      }
    });
  }


  #controlButtonsOnTheFilmCardClickHandler = (evt) => {
    if (!evt.target.closest('.film-card__controls-item')) {
      return;
    }

    const currentClickedWatchlistButton = evt.target.closest('.film-card__controls-item--add-to-watchlist');
    const currentClickedWatchedButton = evt.target.closest('.film-card__controls-item--mark-as-watched');
    const currentClickedFavouriteButton = evt.target.closest('.film-card__controls-item--favorite');
    let id;

    if (currentClickedWatchlistButton) {
      id = +currentClickedWatchlistButton.closest('article').id;
      this.#films = this._callbacks.controlButtonsChangeData(id, 'isWatchlist')[1];
      this.controlButtonsUpdateView(id);
    }
    if (currentClickedWatchedButton) {
      id = +currentClickedWatchedButton.closest('article').id;
      this.#films = this._callbacks.controlButtonsChangeData(id, 'isWatched')[1];
      this.controlButtonsUpdateView(id);
    }
    if (currentClickedFavouriteButton) {
      id = +currentClickedFavouriteButton.closest('article').id;
      this.#films = this._callbacks.controlButtonsChangeData(id, 'isFavorite')[1];
      this.controlButtonsUpdateView(id);
    }

    this._callbacks.navigationMenuUpdateView();
  };

  controlButtonsUpdateView = (id) => {
    const currentRenderedFilmCards = document.querySelectorAll(`article[id="${id}"]`);
    currentRenderedFilmCards.forEach( (renderedFilm) => {
      const renderedFilmID = +renderedFilm.id;
      this.#films.forEach( (film) => {
        if (renderedFilmID === film.id) {
          replaceNodeElement(renderedFilm, new ControlButtonsOnTheFilmCardMarkup(film), renderedFilm.lastElementChild);
        }
      });
    });
  }

  #filmCardClickHandler = (evt) => {
    if (evt.target.closest('.film-card__controls-item') || !evt.target.closest('article[class^="film-card"]')) {
      return;
    }
    const currentIdFilmCard = +evt.target.closest('article[class^="film-card"]').getAttribute('id');
    this.#FilmDetailsPopupPresenter.init(currentIdFilmCard, this.#films);
  }

  clearFilmCards = () => {
    this.filmsListContainer.textContent = '';
    this.topRatedFilmsListContainer.textContent = '';
    this.mostCommentedFilmsListContainer.textContent = '';
  }

  init (films) {
    if (this.#films !== null) {
      this.clearFilmCards();
    }

    this.#films = films;
    this.#topRatedSortFilms = films.sort( (itemA, itemB) => itemB.rating - itemA.rating).slice(0,2);
    this.#mostCommentedSortFilms = films.sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length).slice(0,2);


    this.renderFilmCard(this.#films, this.filmsListContainer);
    this.renderFilmCard(this.#topRatedSortFilms, this.topRatedFilmsListContainer);
    this.renderFilmCard(this.#mostCommentedSortFilms, this.mostCommentedFilmsListContainer);

    document.addEventListener('click', this.#controlButtonsOnTheFilmCardClickHandler);
    document.addEventListener('click', this.#filmCardClickHandler);
  }

}

class FilmsListPresenter {
  #films = null;
  #filteredFilms = null;

  #FilmCardPresenter = null;

  #ProfileUserComponent = null;
  #NavigationMenuComponent = null;
  #FilmsCountComponent = null;
  #FilmsListComponent = null;
  #FilmDetailsPopupComponent = null;

  #ShowMoreButtonComponent = null;
  #LoadingFilmsListComponent = null;
  #SortListComponent = null;


  constructor (data) {
    this.#films = data;

    this.#ShowMoreButtonComponent = new ShowMoreButtonMarkup();
    this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
    this.#SortListComponent = new SortListMarkup();
    this.#FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
    this.#ProfileUserComponent = new ProfileUserMarkup();
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.#films);
    this.#FilmsCountComponent = new FilmsCountMarkup(this.#films.length);
  }

  init () {
    const currentMarkupNavigationMenu = document.querySelector('.main-navigation');
    const currentMarkupFilmsCount = document.querySelector('.footer__statistics');

    renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, this.#ProfileUserComponent);
    replaceNodeElement(mainBodyElement, this.#NavigationMenuComponent, currentMarkupNavigationMenu);
    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#SortListComponent);
    replaceNodeElement(footerStatisticBodyElement, this.#FilmsCountComponent, currentMarkupFilmsCount.firstElementChild);
    renderNodeElement(footerBodyElement, positionMarkup.BEFORE_END, this.#FilmDetailsPopupComponent);

    this.renderFilmsList(this.#films);
  }


  renderFilmsList (films) {
    this.#FilmsListComponent = new FilmsListMarkup();

    const currentFilmsListMarkup = document.querySelector('.films');
    currentFilmsListMarkup.remove();

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#FilmsListComponent);

    if (films.length > INITIAL_FILMS_CARD_COUNT) {
      const filmsListElement = this.#FilmsListComponent.element.querySelector('.films-list');
      renderNodeElement(filmsListElement, positionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
    }

    this.#FilmCardPresenter = new FilmCardPresenter(this.controlItemButtonChangeData, this.navigationMenuUpdateView);
    this.#FilmCardPresenter.init(films);
  }

  controlItemButtonChangeData = (id, controlItem) => {

    let clickedButton;
    this.#films.forEach( (film) => {
      if (film.id === id && controlItem === 'isWatchlist') {
        film.isWatchlist = !film.isWatchlist;
        clickedButton = film.isWatchlist;
      }
      if (film.id === id && controlItem === 'isWatched') {
        film.isWatched = !film.isWatched;
        clickedButton = film.isWatched;
      }
      if (film.id === id && controlItem === 'isFavorite') {
        film.isFavorite = !film.isFavorite;
        clickedButton = film.isFavorite;
      }
    });
    return [clickedButton, this.#films];
  }


  navigationMenuUpdateView = () => {
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.#films);
    replaceNodeElement(mainBodyElement, this.#NavigationMenuComponent, mainBodyElement.firstElementChild);
  }

}


export {INITIAL_FILMS_CARD_COUNT, FilmsListPresenter, FilmCardPresenter, FilmDetailsPopupPresenter};
