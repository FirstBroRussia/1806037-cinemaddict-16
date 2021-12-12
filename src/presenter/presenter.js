import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {FilmsListMarkup} from '/src/view/films-list-view.js';
import {FilmCardMarkup, ControlButtonOnTheFilmCardMarkup} from '/src/view/film-card-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {FilmDetailsPopupMarkup, FilmDetailInfoMarkup, FilmDetailsCardFilterButtons, FilmDetailsCommentsCountMarkup, FilmDetailsCommentMarkup, FilmDetailsNewCommentMarkup, FilmDetailsCloseButtonMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';
import {onEscKeydown} from '/src/utils/util.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';

const INITIAL_FILMS_CARD_COUNT = 5;

class Presenter {
  #films = null;
  #filteredFilms = null;

  #bodyElement = document.querySelector('body');
  #headerBodyElement = document.querySelector('.header');
  #mainBodyElement = document.querySelector('.main');
  #footerBodyElement = document.querySelector('.footer');
  #footerStatisticBodyElement = document.querySelector('.footer__statistics');

  #ShowMoreButtonComponent = new ShowMoreButtonMarkup();
  #LoadingFilmsListComponent = new LoadingFilmsListMarkup();
  #SortListComponent = new SortListMarkup();
  #FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
  #FilmDetailsCloseButtonComponent = new FilmDetailsCloseButtonMarkup();

  #ProfileUserComponent = null;
  #NavigationMenuComponent = null;
  #FilmsCountComponent = null;
  #FilmsListComponent = null;
  #FilmsCardComponent = null;

  #FilmDetailsInfoComponent = null;
  #FilmDetailsFilterButtonsComponent = null;
  #FilmDetailsFilmsCountComponent = null;
  #FilmDetailsCommentsComponent = null;
  #FilmDetailsNewCommentComponent = null;

  #filmDetailsContainer = null;
  #closePopupFilmDetailsButton = null;
  #filmDetailsCommentsWrap = null;


  constructor (data) {
    this.#films = data;
  }

  setComponents () {
    this.#ProfileUserComponent = new ProfileUserMarkup();
    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.#films);
    this.#FilmsCountComponent = new FilmsCountMarkup(this.#films.length);
  }

  getPrimaryMarkup = () => {
    const currentMarkupNavigationMenu = document.querySelector('.main-navigation');
    const currentMarkupFilmsCount = document.querySelector('.footer__statistics');

    renderNodeElement(this.#headerBodyElement, positionMarkup.BEFORE_END, this.#ProfileUserComponent);

    replaceNodeElement(this.#mainBodyElement, this.#NavigationMenuComponent, currentMarkupNavigationMenu);

    renderNodeElement(this.#mainBodyElement, positionMarkup.BEFORE_END, this.#SortListComponent);

    replaceNodeElement(this.#footerStatisticBodyElement, this.#FilmsCountComponent, currentMarkupFilmsCount.firstElementChild);

    renderNodeElement(this.#footerBodyElement, positionMarkup.BEFORE_END, this.#FilmDetailsPopupComponent);
  }

  selectedElementsBySelectors () {
    this.#filmDetailsContainer = this.#FilmDetailsPopupComponent.getElement.querySelector('.film-details__top-container');
    this.#filmDetailsCommentsWrap = this.#FilmDetailsPopupComponent.getElement.querySelector('.film-details__comments-wrap');
  }

  renderFilmCard (films, container) {
    films.forEach( (item, index) => {
      if (index >= INITIAL_FILMS_CARD_COUNT) {
        this.#FilmsCardComponent = new FilmCardMarkup(item, true);
        renderNodeElement(container, positionMarkup.BEFORE_END, this.#FilmsCardComponent);
        renderNodeElement(container.lastElementChild, positionMarkup.BEFORE_END, new ControlButtonOnTheFilmCardMarkup(item));
      } else {
        this.#FilmsCardComponent = new FilmCardMarkup(item);
        renderNodeElement(container, positionMarkup.BEFORE_END, this.#FilmsCardComponent);
        renderNodeElement(container.lastElementChild, positionMarkup.BEFORE_END, new ControlButtonOnTheFilmCardMarkup(item));
      }
    });
    this.#FilmsCardComponent = null;
  }

  renderFilmsList (films) {
    this.#FilmsListComponent = new FilmsListMarkup();

    const currentFilmsListMarkup = document.querySelector('.films');
    currentFilmsListMarkup.remove();

    renderNodeElement(this.#mainBodyElement, positionMarkup.BEFORE_END, this.#FilmsListComponent);

    if (films.length > INITIAL_FILMS_CARD_COUNT) {
      const filmsListElement = this.#FilmsListComponent.getElement.querySelector('.films-list');
      renderNodeElement(filmsListElement, positionMarkup.BEFORE_END, this.#ShowMoreButtonComponent);
      this.#ShowMoreButtonComponent.addEventHandler('click', this.#renderFilmsCardToShowMoreButtonClickHandler);
    }

    const filmsListContainer = this.#FilmsListComponent.getElement.querySelector('.films-list__container');

    this.renderFilmCard(films, filmsListContainer);
    this.#filteredFilms = films;

    const topRatedFilmsListContainer = this.#FilmsListComponent.getElement.querySelector('.films-list__container.top-rated');
    const mostCommentedFilmsListContainer = this.#FilmsListComponent.getElement.querySelector('.films-list__container.most-commented');

    const topRatedSortFilms = films.sort( (itemA, itemB) => itemB.rating - itemA.rating)
      .slice(0,2);
    this.renderFilmCard(topRatedSortFilms, topRatedFilmsListContainer);

    const mostCommentedSortFilms = films.sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length)
      .slice(0,2);
    this.renderFilmCard(mostCommentedSortFilms, mostCommentedFilmsListContainer);
  }

  closeFilmDetailsPopup () {
    this.updateControlButtonsView();

    this.#bodyElement.classList.remove('hide-overflow');
    this.#FilmDetailsPopupComponent.getElement.classList.add('hidden');

    this.#filmDetailsContainer.textContent = '';
    this.#filmDetailsCommentsWrap.textContent = '';

    this.#FilmDetailsPopupComponent.removeEventHandler('click', this.#closeFilmDetailsPopupClickHandler);
    document.removeEventListener('keydown', this.#closeFilmDetailsPopupKeydownHandler);
    document.removeEventListener('click', this.#controlButtonsOnTheFilmDetailsPopupClickHandler);
    this.#FilmsListComponent.addEventHandler('click', this.#openFilmDetailsPopupClickHandler);
  }

  // ПРОЧЕЕ

  controlItemButtonOnTheFilmDetailsPopupToggleClass = (currentClickedButton, value) =>
    value ?
      currentClickedButton.classList.add('film-details__control-button--active') :
      currentClickedButton.classList.remove('film-details__control-button--active');

  // ОБРАБОТЧИКИ

  #renderFilmsCardToShowMoreButtonClickHandler = () => {
    const filmsListWithClassToHidden = this.#FilmsListComponent.getElement.querySelectorAll('article[class="film-card hidden"]');

    if (filmsListWithClassToHidden.length <= INITIAL_FILMS_CARD_COUNT) {
      this.#ShowMoreButtonComponent.getElement.remove();
      this.#ShowMoreButtonComponent.removeEventHandler('click', this.#renderFilmsCardToShowMoreButtonClickHandler);

      for (const filmCard of filmsListWithClassToHidden) {
        filmCard.classList.remove('hidden');
      }

      return;
    }

    for (let index = 0; index < INITIAL_FILMS_CARD_COUNT; index++) {
      filmsListWithClassToHidden[index].classList.remove('hidden');
    }
  }

  #openFilmDetailsPopupClickHandler = (evt) => {
    if (evt.target.closest('.film-card__controls-item') || !evt.target.closest('article[class^="film-card"]')) {
      return;
    }

    this.#FilmsListComponent.removeEventHandler('click', this.#openFilmDetailsPopupClickHandler);
    this.#bodyElement.classList.add('hide-overflow');
    this.#FilmDetailsPopupComponent.getElement.classList.remove('hidden');


    const currentIdFilmCard = +evt.target.closest('article[class^="film-card"]').getAttribute('id');

    for (const film of this.#films) {
      if (film.id === currentIdFilmCard) {
        this.#FilmDetailsInfoComponent = new FilmDetailInfoMarkup(film);
        this.#FilmDetailsFilterButtonsComponent = new FilmDetailsCardFilterButtons(film);
        this.#FilmDetailsFilmsCountComponent = new FilmDetailsCommentsCountMarkup(film);
        this.#FilmDetailsCommentsComponent = new FilmDetailsCommentMarkup(film);
        this.#FilmDetailsNewCommentComponent = new FilmDetailsNewCommentMarkup();

        renderNodeElement(this.#filmDetailsContainer, positionMarkup.BEFORE_END, this.#FilmDetailsCloseButtonComponent);
        renderNodeElement(this.#filmDetailsContainer, positionMarkup.BEFORE_END, this.#FilmDetailsInfoComponent);
        renderNodeElement(this.#filmDetailsContainer, positionMarkup.BEFORE_END, this.#FilmDetailsFilterButtonsComponent);
        renderNodeElement(this.#filmDetailsCommentsWrap, positionMarkup.AFTER_BEGIN, this.#FilmDetailsFilmsCountComponent);
        renderNodeElement(this.#filmDetailsCommentsWrap, positionMarkup.BEFORE_END, this.#FilmDetailsCommentsComponent);
        renderNodeElement(this.#filmDetailsCommentsWrap, positionMarkup.BEFORE_END, this.#FilmDetailsNewCommentComponent);

        break;
      }
    }

    this.#FilmDetailsPopupComponent.addEventHandler('click', this.#closeFilmDetailsPopupClickHandler);
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
      this.controlItemButtonChangeData(id, 'isWatchlist');
      this.updateControlButtonsView();
    }
    if (currentClickedWatchedButton) {
      id = +currentClickedWatchedButton.closest('article').id;
      this.controlItemButtonChangeData(id, 'isWatched');
      this.updateControlButtonsView();
    }
    if (currentClickedFavouriteButton) {
      id = +currentClickedFavouriteButton.closest('article').id;
      this.controlItemButtonChangeData(id, 'isFavorite');
      this.updateControlButtonsView();
    }

    this.#NavigationMenuComponent =  new NavigationMenuMarkup(this.#films);
    replaceNodeElement(this.#mainBodyElement, this.#NavigationMenuComponent, this.#mainBodyElement.firstElementChild);
  };

  #controlButtonsOnTheFilmDetailsPopupClickHandler = (evt) => {
    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    const currentClickedWatchlistButton = evt.target.closest('.film-details__control-button--watchlist');
    const currentClickedWatchedButton = evt.target.closest('.film-details__control-button--watched');
    const currentClickedFavouriteButton = evt.target.closest('.film-details__control-button--favorite');

    let id;
    let currentValueChangeableFeature;

    if (currentClickedWatchlistButton) {
      id = +currentClickedWatchlistButton.closest('.film-details__controls').id;
      currentValueChangeableFeature = this.controlItemButtonChangeData(id, 'isWatchlist');
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedWatchlistButton, currentValueChangeableFeature);
    }
    if (currentClickedWatchedButton) {
      id = +currentClickedWatchedButton.closest('.film-details__controls').id;
      currentValueChangeableFeature = this.controlItemButtonChangeData(id, 'isWatched');
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedWatchedButton, currentValueChangeableFeature);
    }
    if (currentClickedFavouriteButton) {
      id = +currentClickedFavouriteButton.closest('.film-details__controls').id;
      currentValueChangeableFeature = this.controlItemButtonChangeData(id, 'isFavorite');
      this.controlItemButtonOnTheFilmDetailsPopupToggleClass(currentClickedFavouriteButton, currentValueChangeableFeature);
    }
  };


  // ОБНОВЛЕНИЕ ДАННЫХ

  controlItemButtonChangeData (id, controlItem) {

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
    return clickedButton;
  }

  //ОБНОВЛЕНИЕ ВЬЮШЕК

  updateControlButtonsView () {
    const currentRenderedFilmCards = this.#FilmsListComponent.getElement.querySelectorAll('article[class^="film-card"]');
    currentRenderedFilmCards.forEach( (renderedFilm) => {
      const renderedFilmID = +renderedFilm.id;
      this.#films.forEach( (film) => {
        if (renderedFilmID === film.id) {
          replaceNodeElement(renderedFilm, new ControlButtonOnTheFilmCardMarkup(film), renderedFilm.lastElementChild);
        }
      });
    });

    this.#NavigationMenuComponent = new NavigationMenuMarkup(this.#films);
    replaceNodeElement(this.#mainBodyElement, this.#NavigationMenuComponent, this.#mainBodyElement.firstElementChild);
  }
  // INITIALIZATION

  init () {
    this.setComponents();
    this.getPrimaryMarkup();
    this.selectedElementsBySelectors();

    this.renderFilmsList(this.#films);
    this.#FilmsListComponent.addEventHandler('click', this.#openFilmDetailsPopupClickHandler);

    document.addEventListener('click', this.#controlButtonsOnTheFilmCardClickHandler);
  }

}

export {Presenter};
