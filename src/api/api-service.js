import {nanoid} from '/src/utils/util.js';

class ApiService {
  #authorization = null;
  #linkToServer = null;

  constructor (link) {
    this.#linkToServer = link;
    this.#authorization = `Basic ${nanoid(15)}`;
  }

  async getMovies () {
    const link = `${this.#linkToServer}movies/`;
    const request = 'GET';
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);
    const body = null;

    const response = await this.#getResponseFromServer(link, request, headers, body);

    try {
      const dataToServer = await response.json();

      return dataToServer;
    }
    catch (err) {
      throw new Error (`${response.status}: ${response.statusText}`);
    }
  }


  async getComments (idFilm) {
    const link = `${this.#linkToServer}comments/${idFilm}`;
    const request = 'GET';
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);
    const body = null;

    const response = await this.#getResponseFromServer(link, request, headers, body);

    try {
      const dataToServer = await response.json();

      return dataToServer;
    }
    catch (err) {
      throw new Error (`${response.status}: ${response.statusText}`);
    }
  }


  async putMovies (idFilm, data) {
    const link = `${this.#linkToServer}movies/${idFilm}`;
    const request = 'PUT';
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);

    const response = await this.#getResponseFromServer(link, request, headers, body);

    let resultResponse;

    try {
      resultResponse = await response.json();
    } catch {
      resultResponse = null;
    }

    return {
      responseStatus: response.status,
      data: resultResponse,
    };
  }


  async postComment (idFilm, data) {
    const link = `${this.#linkToServer}comments/${idFilm}`;
    const request = 'POST';
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);
    headers.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);

    const response = await this.#getResponseFromServer(link, request, headers, body);

    let resultResponse;

    try {
      resultResponse = await response.json();
    } catch {
      resultResponse = null;
    }

    return {
      responseStatus: response.status,
      data: resultResponse,
    };
  }


  async deleteComment (idComments) {
    const link = `${this.#linkToServer}comments/${idComments}`;
    const request = 'DELETE';
    const headers = new Headers();
    headers.append('Authorization', this.#authorization);
    headers.append('Content-Type', 'application/json');
    const body = null;

    const response = await this.#getResponseFromServer(link, request, headers, body);

    let resultResponse;

    try {
      resultResponse = await response.json();
    } catch {
      resultResponse = null;
    }

    return {
      responseStatus: response.status,
      data: resultResponse,
    };
  }


  #getResponseFromServer = (link, request, headers, body) => fetch(link, {
    method: request,
    headers: headers,
    body: body
  })

}

export {ApiService};
