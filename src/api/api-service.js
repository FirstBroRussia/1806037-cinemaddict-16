import {nanoid, dayjs, METHODS_FOR_API} from '/src/utils/util.js';

const METHODS_FOR_FETCH = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const URL = {
  MOVIES: 'movies/',
  COMMENTS: 'comments/',
};

class ApiService {
  #authorization = null;
  #linkToServer = null;

  constructor (link) {
    this.#linkToServer = link;
    this.#authorization = `Basic ${nanoid(15)}`;
  }

  async getData (method, id) {
    const inputParameters = this.#actionsToDataSwitch(method, id);
    const link = `${this.#linkToServer}/${inputParameters.URL}`;
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);

    const response = await fetch(link, {
      method: inputParameters.REQUEST_METHOD,
      headers: headers,
      body: null,
    });

    try {
      const dataToServer = await response.json();

      return dataToServer;
    }
    catch (err) {
      throw new Error (`${response.status}: ${response.statusText}`);
    }
  }

  async updateData (method, id, changedData) {
    const inputParameters = this.#actionsToDataSwitch(method, id);
    const link = `${this.#linkToServer}/${inputParameters.URL}`;
    const body = JSON.stringify(changedData);
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);
    headers.append('Content-Type', 'application/json');

    const response = await fetch(link, {
      method: inputParameters.REQUEST_METHOD,
      headers: headers,
      body: body,
    });

    try {
      const responseOk = await response.ok;
      if (!responseOk) {
        throw response;
      }
      const filmsData = this.getData(METHODS_FOR_API.GET_MOVIES);

      return filmsData;
    }
    catch (err) {
      throw new Error (`${response.status}: ${response.statusText}`);
    }
  }

  #actionsToDataSwitch = (method, id) => {
    switch (method) {
      case 'getMovies': return ({REQUEST_METHOD: 'GET', URL: 'movies/'});
      case 'getComments' : return ({REQUEST_METHOD: 'GET', URL: `comments/${id}`});
      case 'putMovies' : return ({REQUEST_METHOD: 'PUT', URL: `movies/${id}`});
      case 'postComment' : return ({REQUEST_METHOD: 'POST', URL: `comments/${id}`});
      case 'deleteComment' : return ({REQUEST_METHOD: 'DELETE', URL: `comments/${id}`});
    }
  }
}

export {ApiService};
