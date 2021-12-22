import {headerBodyElement, mainBodyElement, footerStatisticBodyElement, filterMode, sortMode} from '/src/utils/util.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {NavigationMenuMarkup, FilterWrapMarkup, AllFilmsFilterMarkup, WatchlistFilmsFilterMarkup, HistoryFilterMarkup, FavoriteFilmsFilterMarkup, StatsMarkup, WatchlistFilmsCountMarkup, WatchedFilmsCountMarkup, FavoriteFilmsCountMarkup} from '/src/view/navigation-menu-view.js';

import {FilmsListPresenter} from '/src/presenter/films-list-presenter.js';

class MainPresenter {
  #films = null;

  #selectedFilter = null;
  #selectedSort = null;

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

  #SortListComponent = null;

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
    this.#SortListComponent = new SortListMarkup();
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

    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#SortListComponent);

    this.#SortListComponent.setDefaultSortClickHandler('click', this.#defaultSortClickHandler);
    this.#SortListComponent.setDateSortClickHandler('click', this.#dataSortClickHandler);
    this.#SortListComponent.setRatingSortClickHandler('click', this.#ratingSortClickHandler);

    this.#AllFilmsFilterComponent.setAllMoviesFilterClickHandler('click', this.#allFilmsFilterClickHandler);
    this.#WatchlistFilterComponent.setWatchlistFilterClickHandler('click', this.#watchlistFilterClickHandler);
    this.#HistoryFilmsFilterComponent.setHistoryFilterClickHandler('click', this.#historyFilterClickHandler);
    this.#FavoriteFilmsFilterComponent.setFavoritesFilterClickHandler('click', this.#favoriteFilterClickHandler);

    renderNodeElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, this.#FilmsCountComponent);

    this.#FilmsListPresenter = new FilmsListPresenter(this.#changeMasterData);
    this.#FilmsListPresenter.init(this.#films, undefined, filterMode.ALL_MOVIES);
    this.#selectedFilter = filterMode.ALL_MOVIES;
  }

  #changeMasterData = (id, changedData, currentChange) => {
    for (let index = 0; index < this.#films.length; index++) {
      if (this.#films[index].id === id) {
        this.#films[index] = changedData;
        break;
      }
    }

    this.#updateView(id, currentChange);
  }


  #updateView = (id, currentChange) => {
    this.#navigationMenuUpdateView();

    this.#FilmsListPresenter.init(this.#films, id, undefined, currentChange);
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
    this.#selectedFilter = filterMode.ALL_MOVIES;
    this.#FilmsListPresenter.init(this.#films, undefined, this.#selectedFilter);
  }

  #watchlistFilterClickHandler = () => {
    this.#selectedFilter = filterMode.WATCHLIST;
    this.#FilmsListPresenter.init(this.#films, undefined, this.#selectedFilter);
  }

  #historyFilterClickHandler = () => {
    this.#selectedFilter = filterMode.HISTORY;
    this.#FilmsListPresenter.init(this.#films, undefined, this.#selectedFilter);
  }

  #favoriteFilterClickHandler = () => {
    this.#selectedFilter = filterMode.FAVORITE;
    this.#FilmsListPresenter.init(this.#films, undefined, this.#selectedFilter);
  }

  #defaultSortClickHandler = () => {
    this.#selectedSort = sortMode.DEFAULT;
    this.#FilmsListPresenter.init(this.#films, undefined, this.#selectedFilter, undefined, this.#selectedSort);
  }

  #dataSortClickHandler = () => {
    this.#selectedSort = sortMode.DATE;
    this.#FilmsListPresenter.init(this.#films, undefined, this.#selectedFilter, undefined, this.#selectedSort);
  }

  #ratingSortClickHandler = () => {
    this.#selectedSort = sortMode.RATING;
    this.#FilmsListPresenter.init(this.#films, undefined, this.#selectedFilter, undefined, this.#selectedSort);
  }

}

export {MainPresenter};
