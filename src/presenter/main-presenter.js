/* eslint-disable no-unused-expressions */
import {headerBodyElement, mainBodyElement, footerStatisticBodyElement, filterMode, sortMode, methodsForPopup} from '/src/utils/util.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';
import {NavigationMenuMarkup, FilterWrapMarkup, AllFilmsFilterMarkup, WatchlistFilmsFilterMarkup, HistoryFilterMarkup, FavoriteFilmsFilterMarkup, StatsMarkup, WatchlistFilmsCountMarkup, WatchedFilmsCountMarkup, FavoriteFilmsCountMarkup} from '/src/view/navigation-menu-view.js';
import {MainModel} from '/src/model/main-model.js';
import {StatisticSmartView} from '/src/view/statistic-menu-view.js';

import {FilmsListPresenter} from '/src/presenter/films-list-presenter.js';
import {FilmDetailsPopupPresenter} from '/src/presenter/film-details-popup-presenter.js';

import {dayjs, ZERO_VALUE} from '/src/utils/util.js';

const NO_FILMS_VALUE = 0;

class MainPresenter {
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

  constructor () {
    this.#MainModel = new MainModel(this.#linkToServer);
    this.#MainModel.odserverAdd(this.#observerNotificationMainPresenter);

    this.#FilmsListPresenter = new FilmsListPresenter(this.#changeMasterData, this.#popupPresenter, this.deleteSectionElement);
  }

  async init (idFilm) {
    if (this.#films === null) {
      this.#LoadingFilmsListComponent = new LoadingFilmsListMarkup();
      renderNodeElement(mainBodyElement, positionMarkup.AFTER_BEGIN, this.#LoadingFilmsListComponent);

      this.#films = await this.#MainModel.getMovies();
      this.#primaryInit();
      return;
    }

    this.#films = await this.#MainModel.getMovies();
    this.#films === NO_FILMS_VALUE ? this.#SortListComponent.hideComponent() : this.#SortListComponent.showComponent();
    this.#updateView(idFilm);
  }

  #primaryInit = () => {
    const watchedFilms = this.#setWatchedFilms(this.#films);
    if (watchedFilms.length !== ZERO_VALUE) {
      this.#ProfileUserComponent = new ProfileUserMarkup(watchedFilms);
      renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, this.#ProfileUserComponent);
    }

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

    this.#SortListComponent.setDefaultSortClickHandler('click', this.#sortButtonClickHandler);
    this.#SortListComponent.setDateSortClickHandler('click', this.#sortButtonClickHandler);
    this.#SortListComponent.setRatingSortClickHandler('click', this.#sortButtonClickHandler);

    this.#AllFilmsFilterComponent.setAllMoviesFilterClickHandler('click', this.#filterButtonClickHandler);
    this.#WatchlistFilterComponent.setWatchlistFilterClickHandler('click', this.#filterButtonClickHandler);
    this.#HistoryFilmsFilterComponent.setHistoryFilterClickHandler('click', this.#filterButtonClickHandler);
    this.#FavoriteFilmsFilterComponent.setFavoritesFilterClickHandler('click', this.#filterButtonClickHandler);

    this.#StatsComponent.setStatsButtonClickHandler('click', this.#statsButtonClickHandler);

    renderNodeElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, this.#FilmsCountComponent);

    this.#selectedFilter = filterMode.ALL_MOVIES;
    this.#selectedSort = sortMode.DEFAULT;

    this.#setConvertedFilms();
    this.#FilmsListPresenter.init(this.#convertedFilms, this.#selectedFilter, this.#selectedSort);
  }


  #observerNotificationMainPresenter = (dataCollection) => {
    this.init(dataCollection.idFilm);
  }


  #changeMasterData = (method, dataList) => {
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


  #updateView = (id) => {
    this.#setConvertedFilms(this.#films);

    this.#profileUserUpdateView();
    this.#navigationMenuUpdateView();
    this.#filmsCountUpdateView();

    if (this.#convertedFilms.length === NO_FILMS_VALUE) {
      this.#SortListComponent.hideComponent();
    }
    this.#FilmsListPresenter.init(this.#convertedFilms, this.#selectedFilter, this.#selectedSort, id);
  }


  #profileUserUpdateView = () => {
    this.#ProfileUserComponent.remove();
    const watchedFilms = this.#setWatchedFilms(this.#films);
    if (watchedFilms.length === ZERO_VALUE) {
      return;
    }
    this.#ProfileUserComponent = new ProfileUserMarkup(watchedFilms);
    renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, this.#ProfileUserComponent);
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


  #filterButtonClickHandler = (clickButton) => {
    this.#selectedFilter = clickButton;
    this.#selectedSort = sortMode.DEFAULT;
    this.#SortListComponent.defaultSortButtonClickSimulation();

    this.init();
  }


  #sortButtonClickHandler = (clickButton) => {
    this.#selectedSort = clickButton;

    this.init();
  }


  #statsButtonClickHandler = () => {
    this.deleteSectionElement();
    this.#SortListComponent.hideComponent();

    this.#StatisticsSmartComponent = new StatisticSmartView(this.#films);
    renderNodeElement(mainBodyElement, positionMarkup.BEFORE_END, this.#StatisticsSmartComponent);
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


  #setConvertedFilms = () => {
    this.#convertedFilms = this.#getFilteredFilmsListSwitch(this.#films, this.#selectedFilter);
    this.#convertedFilms = this.#getSortFilmsListSwitch(this.#convertedFilms, this.#selectedSort);
  }

  #setWatchedFilms = () => this.#films.slice().filter( (film) => film.isWatched);

  #popupPresenter = async (method, dataList) => {
    if (method === methodsForPopup.CREATE) {
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
    } else if (method === methodsForPopup.DELETE) {
      this.#FilmDetailsPopupPresenter = null;
    }
  }

  deleteSectionElement = () => {
    const sectionElement = mainBodyElement.querySelectorAll('section');
    if (sectionElement !== null) {
      sectionElement.forEach( (element) => element.remove());
    }
  };

}

export {MainPresenter};
