import {nanoid} from '/src/utils/util.js';

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

  async updateData (method, changedData, idFilm, idComment) {
    let inputParameters;
    let body;

    if (method === 'deleteComment') {
      inputParameters = this.#actionsToDataSwitch(method, idComment);
      body = null;
    } else {
      inputParameters = this.#actionsToDataSwitch(method, idFilm);
      body = JSON.stringify(changedData);
    }

    const link = `${this.#linkToServer}/${inputParameters.URL}`;
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);
    headers.append('Content-Type', 'application/json');

    const response = await fetch(link, {
      method: inputParameters.REQUEST_METHOD,
      headers: headers,
      body: body,
    });

    console.log(await response.json());

    return await response.status;
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
