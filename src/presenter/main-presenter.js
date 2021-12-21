import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';


import {NavigationMenuMarkup, FilterWrapMarkup, AllFilmsFilterMarkup, WatchlistFilmsFilterMarkup, HistoryFilterMarkup, FavoriteFilmsFilterMarkup, StatsMarkup, WatchlistFilmsCountMarkup, WatchedFilmsCountMarkup, FavoriteFilmsCountMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup} from '/src/view/films-list-view.js';

import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';
import {EmptyFilmsListMarkup} from '/src/view/empty-films-list-view.js';


import {FilmsListPresenter} from '/src/presenter/films-list-presenter.js';

import {INITIAL_FILMS_CARD_COUNT, bodyElement, headerBodyElement, mainBodyElement, footerBodyElement, footerStatisticBodyElement, controlButtons} from '/src/main.js';

const modePresenter = {
  ALL_MOVIES: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',
};

class MainPresenter {
  #films = null;
  #watchlistFilms = null;
  #watchedFilms = null;
  #favoriteFilms = null;

  #FilmsListPresenter = null;

  #ProfileUserComponent = null;

  #NavigationMenuComponent = null;
  #FilterWrapComponent = null;
  #AllFilmsFilterComponent = null;
  #WatchlistFilterComponent = null;
  #WatchlistFilmsCountComponent = null;
  #HistoryFilmsFilterComponent = null;
  #HistoryFilmsCountComponent = null;
  #FavoriteFilmsFilterComponent = null;
  #FavoriteFilmsCountComponent = null;
  #StatsComponent = null;

  #FilmsCountComponent = null;


  constructor (films) {
    this.#films = films.slice();

    this.#ProfileUserComponent = new ProfileUserMarkup();
    this.#NavigationMenuComponent = new NavigationMenuMarkup();
    this.#FilterWrapComponent = new FilterWrapMarkup();
    this.#AllFilmsFilterComponent = new AllFilmsFilterMarkup();
    this.#WatchlistFilterComponent = new WatchlistFilmsFilterMarkup();
    this.#WatchlistFilmsCountComponent = new WatchlistFilmsCountMarkup(this.#films);
    this.#HistoryFilmsFilterComponent = new HistoryFilterMarkup();
    this.#HistoryFilmsCountComponent = new WatchedFilmsCountMarkup(this.#films);
    this.#FavoriteFilmsFilterComponent = new FavoriteFilmsFilterMarkup();
    this.#FavoriteFilmsCountComponent = new FavoriteFilmsCountMarkup(this.#films);
    this.#StatsComponent = new StatsMarkup();
    this.#FilmsCountComponent = new FilmsCountMarkup(this.#films.length);
  }

  init () {
    renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, this.#ProfileUserComponent);

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#NavigationMenuComponent);
    renderNodeElement(this.#NavigationMenuComponent, positionMarkup.BEFORE_END, this.#FilterWrapComponent);
    renderNodeElement(this.#NavigationMenuComponent, positionMarkup.BEFORE_END, this.#StatsComponent);
    renderNodeElement(this.#FilterWrapComponent, positionMarkup.BEFORE_END, this.#AllFilmsFilterComponent);
    renderNodeElement(this.#FilterWrapComponent, positionMarkup.BEFORE_END, this.#WatchlistFilterComponent);
    renderNodeElement(this.#WatchlistFilterComponent, positionMarkup.BEFORE_END, this.#WatchlistFilmsCountComponent);
    renderNodeElement(this.#FilterWrapComponent, positionMarkup.BEFORE_END, this.#HistoryFilmsFilterComponent);
    renderNodeElement(this.#HistoryFilmsFilterComponent, positionMarkup.BEFORE_END, this.#HistoryFilmsCountComponent);
    renderNodeElement(this.#FilterWrapComponent, positionMarkup.BEFORE_END, this.#FavoriteFilmsFilterComponent);
    renderNodeElement(this.#FavoriteFilmsFilterComponent, positionMarkup.BEFORE_END, this.#FavoriteFilmsCountComponent);


    this.#AllFilmsFilterComponent.setAllMoviesFilterClickHandler('click', this.#allFilmsFilterClickHandler);
    this.#WatchlistFilterComponent.setWatchlistFilterClickHandler('click', this.#watchlistFilterClickHandler);
    // this.#HistoryFilmsFilterComponent.setWatchlistFilterClickHandler('click', this.#watchlistFilterClickHandler);
    // this.#FavoriteFilmsFilterComponent.setWatchlistFilterClickHandler('click', this.#watchlistFilterClickHandler);

    renderNodeElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, this.#FilmsCountComponent);

    this.#FilmsListPresenter = new FilmsListPresenter(this.#changeMasterData);
    this.#FilmsListPresenter.render(this.#films);
  }

  #changeMasterData = (id, changedData) => {
    for (let index = 0; index < this.#films.length; index++) {
      if (this.#films[index].id === id) {
        this.#films[index] = changedData;
        break;
      }
    }

    this.#updateView(id);
  }


  #updateView = (id) => {
    this.#navigationMenuUpdateView();

    this.#FilmsListPresenter.render(this.#films, id);
  }

  #navigationMenuUpdateView = () => {
    const prevWatchlistFilmsCountComponent = this.#WatchlistFilmsCountComponent;
    const prevHistoryFilmsCountComponent = this.#HistoryFilmsCountComponent;
    const prevFavoriteFilmsCountComponent = this.#FavoriteFilmsCountComponent;

    this.#WatchlistFilmsCountComponent = new WatchlistFilmsCountMarkup(this.#films);
    this.#HistoryFilmsCountComponent = new WatchedFilmsCountMarkup(this.#films);
    this.#FavoriteFilmsCountComponent = new FavoriteFilmsCountMarkup(this.#films);

    replaceNodeElementWithoutParent(this.#WatchlistFilmsCountComponent, prevWatchlistFilmsCountComponent);
    replaceNodeElementWithoutParent(this.#HistoryFilmsCountComponent, prevHistoryFilmsCountComponent);
    replaceNodeElementWithoutParent(this.#FavoriteFilmsCountComponent, prevFavoriteFilmsCountComponent);
  }


  #allFilmsFilterClickHandler = () => {
    this.#FilmsListPresenter.render(this.#films, false, modePresenter.ALL_MOVIES);
  }

  #watchlistFilterClickHandler = () => {
    this.#watchlistFilms = this.#films.slice().filter( (film) => film.isWatchlist === true);
    this.#FilmsListPresenter.render(this.#watchlistFilms, false, modePresenter.WATCHLIST);
  }








}

export {MainPresenter};
