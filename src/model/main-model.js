/* eslint-disable camelcase */
import {dayjs, METHODS_FOR_API} from '/src/utils/util.js';
import {ApiService} from '/src/api/api-service.js';

class MainModel {
  _observers = [];
  #filmsData = null;

  #ApiService = null;

  constructor (link) {
    this.#ApiService = new ApiService(link);

  }

  async getData (method, id) {
    const dataList = await this.#ApiService.getData(method, id);
    if (method === 'getComments') {
      return dataList;
    }
    const filmsData = this.#adaptToClient(dataList);

    return filmsData;
  }

  async changeData (method, id, changedData) {
    const convertedChangedData = this.#adaptToServer(changedData);

    const updatedData = await this.#ApiService.updateData(method, id, convertedChangedData);
    const updatedConvertedData = this.#adaptToClient(updatedData);

    this.observersNotify(updatedConvertedData, id);
  }

  odserverAdd = (callback) => {
    this._observers.push(callback);
  };

  observersRemove = () => {
    this._observers = [];
  };

  observersNotify = (data, id) => {
    this._observers.forEach( (item) => item(data, id));
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
