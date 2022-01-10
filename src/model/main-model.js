/* eslint-disable camelcase */
import {ApiService} from '/src/api/api-service.js';

class MainModel {
  _observers = [];
  #filmsData = null;

  #APIService = null;

  constructor (link) {
    this.#APIService = new ApiService(link);

  }

  async getData (methodAPI, id) {
    const dataList = await this.#APIService.getData(methodAPI, id);
    if (methodAPI === 'getComments') {
      return dataList;
    }
    const filmsData = this.#adaptToClient(dataList);

    return filmsData;
  }

  #adaptToServerSwitch = (method, changedData) => {
    switch (method) {
      case 'postComment': return changedData;
      case 'deleteComment': return null;
      default : return this.#adaptToServer(changedData);
    }
  }

  async changeData (methodAPI, changedData, idFilm, idComment) {
    const adaptChangedDataToServer = this.#adaptToServerSwitch(methodAPI, changedData);

    const responseStatus = await this.#APIService.updateData(methodAPI, adaptChangedDataToServer, idFilm, idComment);

    this.observersNotify(responseStatus, idFilm, methodAPI);
  }

  odserverAdd = (callback) => {
    this._observers.push(callback);
  };

  observersRemove = () => {
    this._observers = [];
  };

  observersNotify = (responseStatus, idFilm, idComment, method) => {
    this._observers.forEach( (item) => item(responseStatus, idFilm, idComment, method));
  };

  #adaptToClient = (dataList) => dataList.slice().map( (item) => ({
    id: item.id,
    img: item.film_info.poster,
    name: item.film_info.title,
    originalName: item.film_info.alternative_title,
    rating: item.film_info.total_rating,
    director: item.film_info.director,
    screenwritters: item.film_info.writers,
    actors: item.film_info.actors,
    releaseFullFormat: item.film_info.release,
    duration: item.film_info.runtime,
    genre: item.film_info.genre,
    description: item.film_info.description,
    ageRating: item.film_info.age_rating,
    comments: item.comments,
    isWatchlist: item.user_details.watchlist,
    isWatched: item.user_details.already_watched,
    isFavorite: item.user_details.favorite,
    watchingDate: item.user_details.watching_date,
  }))

  #adaptToServer = (data) => ({
    id: data.id,
    comments: data.comments,
    film_info: {
      poster: data.img,
      title: data.name,
      alternative_title: data.originalName,
      total_rating: data.rating,
      director: data.director,
      writers: data.screenwritters,
      actors: data.actors,
      release: data.releaseFullFormat,
      runtime: data.duration,
      genre: data.genre,
      description: data.description,
      age_rating: data.ageRating,
    },
    user_details: {
      watchlist: data.isWatchlist,
      already_watched: data.isWatched,
      favorite: data.isFavorite,
      watching_date: data.watchingDate,
    },
  })

}

export {MainModel};
