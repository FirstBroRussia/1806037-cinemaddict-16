import {FilmCardMarkup, ControlButtonsOnTheFilmCardMarkup} from '/src/view/film-card-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement} from '/src/utils/render-html-element.js';
import {INITIAL_FILMS_CARD_COUNT} from '/src/main.js';

import {FilmDetailsPopupPresenter} from '/src/presenter/film-details-popup-presenter.js';


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

export {FilmCardPresenter};
