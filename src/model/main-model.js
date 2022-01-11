/* eslint-disable camelcase */
import {ApiService} from '/src/api/api-service.js';

class MainModel {
  _observers = [];

  #APIService = null;

  constructor (link) {
    this.#APIService = new ApiService(link);

  }


  async getMovies () {
    const filmsData = await this.#APIService.getMovies();
    return this.#getAdaptToClient(filmsData);
  }


  async getComments (idFilm) {
    return await this.#APIService.getComments(idFilm);
  }


  async putMovies (idFilm, data) {
    const adaptData = this.#getAdaptToServer(data);
    let response = await this.#APIService.putMovies(idFilm, adaptData);
    response = {...response, data : this.#getAdaptToClient(response.data)};
    const dataCollection = {
      method: 'putMovies',
      response: response,
      idFilm: idFilm
    };
    this.observersNotify(dataCollection);
  }


  async postComment (idFilm, data) {
    const response = await this.#APIService.postComment(idFilm, data);
    const dataCollection = {
      method: 'postComment',
      response: response,
      idFilm: idFilm
    };
    this.observersNotify(dataCollection);
  }


  async deleteComment (idComment) {
    const response = await this.#APIService.deleteComment(idComment);
    const dataCollection = {
      method: 'deleteComment',
      response: response,
    };
    this.observersNotify(dataCollection);
  }


  odserverAdd = (callback) => {
    this._observers.push(callback);
  };


  observerRemove = (callback) => {
    for (let index = 0; index < this._observers.length; index++) {
      if (this._observers[index] === callback) {
        this._observers.splice(index, 1);
        break;
      }
    }
  }


  observersRemove = () => {
    this._observers = [];
  }


  observersNotify = (dataCollection) => {
    this._observers.forEach( (item) => item(dataCollection));
  };


  #getAdaptToClient = (dataList) => {
    if (Array.isArray(dataList)) {
      return dataList.slice().map( (item) => ({
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
      }));
    }
    return ({
      id: dataList.id,
      img: dataList.film_info.poster,
      name: dataList.film_info.title,
      originalName: dataList.film_info.alternative_title,
      rating: dataList.film_info.total_rating,
      director: dataList.film_info.director,
      screenwritters: dataList.film_info.writers,
      actors: dataList.film_info.actors,
      releaseFullFormat: dataList.film_info.release,
      duration: dataList.film_info.runtime,
      genre: dataList.film_info.genre,
      description: dataList.film_info.description,
      ageRating: dataList.film_info.age_rating,
      comments: dataList.comments,
      isWatchlist: dataList.user_details.watchlist,
      isWatched: dataList.user_details.already_watched,
      isFavorite: dataList.user_details.favorite,
      watchingDate: dataList.user_details.watching_date,
    });
  }


  #getAdaptToServer = (data) => ({
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
