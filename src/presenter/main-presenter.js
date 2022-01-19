/* eslint-disable no-unused-expressions */
import {headerBodyElement, mainBodyElement, footerStatisticBodyElement} from '/src/main.js';
import {dayjs, ZERO_VALUE, FilterMode, SortMode, MethodsForPopup, errorResponse} from '/src/utils/util.js';
import {PositionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';

import LoadingFilmsListMarkup from '/src/view/loading-films-list-markup.js';
import ProfileUserMarkup from '/src/view/profile-user-markup.js';
import SortListMarkup from '/src/view/sort-list-markup.js';
import FilmsCountMarkup from '/src/view/films-count-markup.js';
import NavigationMenuMarkup from '/src/view/navigation-menu-views/navigation-menu-markup.js';
import FilterWrapMarkup from '/src/view/navigation-menu-views/filter-wrap-markup.js';
import AllFilmsFilterMarkup from '/src/view/navigation-menu-views/all-films-filter-markup.js';
import WatchlistFilmsFilterMarkup from '/src/view/navigation-menu-views/watchlist-films-filter-markup.js';
import HistoryFilterMarkup from '/src/view/navigation-menu-views/history-filter-markup.js';
import FavoriteFilmsFilterMarkup from '/src/view/navigation-menu-views/favorite-films-filter-markup.js';
import StatsMarkup from '/src/view/navigation-menu-views/stats-markup.js';
import WatchlistFilmsCountMarkup from '/src/view/navigation-menu-views/watchlist-films-count-markup.js';
import WatchedFilmsCountMarkup from '/src/view/navigation-menu-views/watched-films-count-markup.js';
import FavoriteFilmsCountMarkup from '/src/view/navigation-menu-views/favorite-films-count-markup.js';
import MainModel from '/src/model/main-model.js';
import StatisticSmartView from '/src/view/statistic-menu-views/statistic-smart-view.js';
import ErrorResponseForMainElementMarkup from '/src/view/error-response-from-server-views/error-response-for-main-element-markup.js';

import FilmsListPresenter from '/src/presenter/films-list-presenter.js';
import FilmDetailsPopupPresenter from '/src/presenter/film-details-popup-presenter.js';

export default class MainPresenter {
  #linkToServer = 'https://16.ecmascript.pages.academy/cinemaddict/';

  #films = null;
  #convertedFilms = null;

  #selectedFilter = null;
  #selectedSort = null;

  #MainModel = null;
  #FilmsListPresenter = null;
  #StatisticsSmartComponent = null;

  #FilmDetailsPopupPresenter = null;

  #ProfileUserComponent = null;

  #LoadingFilmsListComponent = null;

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

  #ErrorResponseForMainElementComponent = null;


  constructor () {
    this.#MainModel = new MainModel(this.#linkToServer);
    this.#MainModel.odserverAdd(this.observerNotificationMainPresenter);

    this.#FilmsListPresenter = new FilmsListPresenter(this._changeMasterData, this._popupPresenter, this._deleteSectionElement);
  }

  async init (idFilm) {
    let response;
    if (this.#films === null) {
      this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
      renderNodeElement(mainBodyElement, PositionMarkup.BEFORE_END, this.#LoadingFilmsListComponent);

      response = await this.#MainModel.getMovies();
      if (response === errorResponse) {
        this.#setErrorReceivingDataMarkup();
        return;
      }
      this.#films = response;
      this.#primaryInit();
      return;
    }

    response = await this.#MainModel.getMovies();
    if (response === errorResponse) {
      this.#setErrorReceivingDataMarkup();
      return;
    }
    this.#films = response;
    this.#films.length === ZERO_VALUE ? this.#SortListComponent.hideComponent() : this.#SortListComponent.showComponent();
    this.#updateView(idFilm);
  }

  observerNotificationMainPresenter = (dataCollection) => {
    this.init(dataCollection.idFilm);
  }

  #setConvertedFilms = () => {
    this.#convertedFilms = this.#getFilteredFilmsListSwitch(this.#films, this.#selectedFilter);
    this.#convertedFilms = this.#getSortFilmsListSwitch(this.#convertedFilms, this.#selectedSort);
  }

  #primaryInit = () => {
    const watchedFilms = this.#setWatchedFilms(this.#films);
    if (watchedFilms.length !== ZERO_VALUE) {
      this.#ProfileUserComponent = new ProfileUserMarkup(watchedFilms);
      renderNodeElement(headerBodyElement, PositionMarkup.BEFORE_END, this.#ProfileUserComponent);
    }

    this.#NavigationMenuComponent = new NavigationMenuMarkup();
    this.#FilterWrapComponent = new FilterWrapMarkup();
    this.#AllFilmsFilterComponent = new AllFilmsFilterMarkup(this.#NavigationMenuComponent);

    this.#WatchlistFilterComponent = new WatchlistFilmsFilterMarkup(this.#NavigationMenuComponent);
    this.#WatchlistFilmsCountComponent = new WatchlistFilmsCountMarkup(this.#films);

    this.#HistoryFilmsFilterComponent = new HistoryFilterMarkup(this.#NavigationMenuComponent);
    this.#HistoryFilmsCountComponent = new WatchedFilmsCountMarkup(this.#films);

    this.#FavoriteFilmsFilterComponent = new FavoriteFilmsFilterMarkup(this.#NavigationMenuComponent);
    this.#FavoriteFilmsCountComponent = new FavoriteFilmsCountMarkup(this.#films);

    this.#StatsComponent = new StatsMarkup(this.#NavigationMenuComponent);

    this.#SortListComponent = new SortListMarkup();

    this.#FilmsCountComponent = new FilmsCountMarkup(this.#films.length);

    renderNodeElement(mainBodyElement, PositionMarkup.BEFORE_END, this.#NavigationMenuComponent);
    renderNodeElement(this.#NavigationMenuComponent, PositionMarkup.BEFORE_END, this.#FilterWrapComponent);
    renderNodeElement(this.#NavigationMenuComponent, PositionMarkup.BEFORE_END, this.#StatsComponent);
    renderNodeElement(this.#FilterWrapComponent, PositionMarkup.BEFORE_END, this.#AllFilmsFilterComponent);
    renderNodeElement(this.#FilterWrapComponent, PositionMarkup.BEFORE_END, this.#WatchlistFilterComponent);
    renderNodeElement(this.#WatchlistFilterComponent, PositionMarkup.BEFORE_END, this.#WatchlistFilmsCountComponent);
    renderNodeElement(this.#FilterWrapComponent, PositionMarkup.BEFORE_END, this.#HistoryFilmsFilterComponent);
    renderNodeElement(this.#HistoryFilmsFilterComponent, PositionMarkup.BEFORE_END, this.#HistoryFilmsCountComponent);
    renderNodeElement(this.#FilterWrapComponent, PositionMarkup.BEFORE_END, this.#FavoriteFilmsFilterComponent);
    renderNodeElement(this.#FavoriteFilmsFilterComponent, PositionMarkup.BEFORE_END, this.#FavoriteFilmsCountComponent);

    renderNodeElement(mainBodyElement, PositionMarkup.BEFORE_END, this.#SortListComponent);

    this.#SortListComponent.setDefaultSortClickHandler('click', this._sortButtonClickHandler);
    this.#SortListComponent.setDateSortClickHandler('click', this._sortButtonClickHandler);
    this.#SortListComponent.setRatingSortClickHandler('click', this._sortButtonClickHandler);

    this.#AllFilmsFilterComponent.setAllMoviesFilterClickHandler('click', this._filterButtonClickHandler);
    this.#WatchlistFilterComponent.setWatchlistFilterClickHandler('click', this._filterButtonClickHandler);
    this.#HistoryFilmsFilterComponent.setHistoryFilterClickHandler('click', this._filterButtonClickHandler);
    this.#FavoriteFilmsFilterComponent.setFavoritesFilterClickHandler('click', this._filterButtonClickHandler);

    this.#StatsComponent.setStatsButtonClickHandler('click', this._statisticButtonClickHandler);

    renderNodeElement(footerStatisticBodyElement, PositionMarkup.BEFORE_END, this.#FilmsCountComponent);

    this.#selectedFilter = FilterMode.ALL_MOVIES;
    this.#selectedSort = SortMode.DEFAULT;

    this.#setConvertedFilms();
    this.#FilmsListPresenter.render(this.#convertedFilms, this.#selectedFilter, this.#selectedSort);
  }

  #updateView = (id) => {
    this.#setConvertedFilms(this.#films);

    this.#profileUserUpdateView();
    this.#navigationMenuUpdateView();
    this.#filmsCountUpdateView();

    if (this.#convertedFilms.length === ZERO_VALUE) {
      this.#SortListComponent.hideComponent();
    }
    this.#FilmsListPresenter.render(this.#convertedFilms, this.#selectedFilter, this.#selectedSort, id);
  }

  #profileUserUpdateView = () => {
    this.#ProfileUserComponent.remove();
    const watchedFilms = this.#setWatchedFilms(this.#films);
    if (watchedFilms.length === ZERO_VALUE) {
      return;
    }
    this.#ProfileUserComponent = new ProfileUserMarkup(watchedFilms);
    renderNodeElement(headerBodyElement, PositionMarkup.BEFORE_END, this.#ProfileUserComponent);
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

  #filmsCountUpdateView = () => {
    const prevFilmsCountComponent = this.#FilmsCountComponent;
    this.#FilmsCountComponent = new FilmsCountMarkup(this.#convertedFilms.length);
    replaceNodeElementWithoutParent(this.#FilmsCountComponent, prevFilmsCountComponent);
  }

  #getFilteredFilmsListSwitch = (films, value) => {
    switch (value) {
      case 'all' : return films.slice();
      case 'watchlist' : return films.slice().filter( (film) => film.isWatchlist);
      case 'history' : return films.slice().filter( (film) => film.isWatched);
      case 'favorite' : return films.slice().filter( (film) => film.isFavorite);
    }
  }

  #getSortFilmsListSwitch = (films, sort) => {
    switch (sort) {
      case 'default' : return films.slice();
      case 'date' : return films.slice().sort( (itemA, itemB) => {
        const currentTime = dayjs(dayjs().format());
        const itemATime = currentTime.diff(dayjs(itemA.releaseFullFormat.date).format());
        const itemBTime = currentTime.diff(dayjs(itemB.releaseFullFormat.date).format());
        return itemATime - itemBTime;
      });
      case 'rating' : return films.slice().sort( (itemA, itemB) => itemB.rating - itemA.rating);
    }
  }

  #setWatchedFilms = () => this.#films.slice().filter( (film) => film.isWatched);

  #setErrorReceivingDataMarkup = () => {
    this.#ErrorResponseForMainElementComponent = new ErrorResponseForMainElementMarkup();
    this.#NavigationMenuComponent !== null ? this.#NavigationMenuComponent.hideComponent() : '';
    this.#SortListComponent !== null ? this.#SortListComponent.hideComponent() : '';
    this._deleteSectionElement();
    renderNodeElement(mainBodyElement, PositionMarkup.BEFORE_END, this.#ErrorResponseForMainElementComponent);
  }

  _changeMasterData = (method, dataList) => {
    const {idFilm, idComment, data} = dataList;
    switch (method) {
      case 'putMovies' : {
        this.#MainModel.putMovies(idFilm, data);
        break;
      }
      case 'postComment' : {
        this.#MainModel.postComment(idFilm, data);
        break;
      }
      case 'deleteComment' : this.#MainModel.deleteComment(idFilm, idComment);
    }
  }

  _filterButtonClickHandler = (clickButton) => {
    this.#selectedFilter = clickButton;
    this.#selectedSort = SortMode.DEFAULT;
    this.#SortListComponent.defaultSortButtonClickSimulation();

    this.init();
  }

  _sortButtonClickHandler = (clickButton) => {
    this.#selectedSort = clickButton;

    this.init();
  }

  _statisticButtonClickHandler = () => {
    this._deleteSectionElement();
    this.#SortListComponent.hideComponent();

    this.#StatisticsSmartComponent = new StatisticSmartView(this.#films);
    renderNodeElement(mainBodyElement, PositionMarkup.BEFORE_END, this.#StatisticsSmartComponent);
  }

  _popupPresenter = async (method, dataList) => {
    if (method === MethodsForPopup.CREATE) {
      const {data, callbacks} = dataList;
      if (this.#FilmDetailsPopupPresenter !== null) {
        const prevPopupPresenter = this.#FilmDetailsPopupPresenter;
        this.#FilmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this.#MainModel, ...callbacks);
        await this.#FilmDetailsPopupPresenter.init(data);
        prevPopupPresenter.closeFilmDetailsPopup();
        return;
      }
      this.#FilmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this.#MainModel, ...callbacks);
      this.#FilmDetailsPopupPresenter.init(data);
    } else if (method === MethodsForPopup.DELETE) {
      this.#FilmDetailsPopupPresenter = null;
    }
  }

  _deleteSectionElement = () => {
    const sectionElement = mainBodyElement.querySelectorAll('section');
    if (sectionElement !== null) {
      sectionElement.forEach( (element) => element.remove());
    }
  };

}
