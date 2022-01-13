import {nanoid} from '/src/utils/util.js';

class ApiService {
  #authorization = null;
  #linkToServer = null;

  constructor (link) {
    this.#linkToServer = link;
    this.#authorization = `Basic ${nanoid(15)}`;
  }


  async getData (method, dataList) {
    const {link, request, headers, body} = this.#setBodyRequest(method, dataList);

    const response = await this.#requestFromServer(link, request, headers, body);

    try {
      const dataToServer = await response.json();

      return dataToServer;
    }
    catch (err) {
      throw new Error (`${response.status}: ${response.statusText}`);
    }
  }

  async changeData (method, dataList) {

    const {link, request, headers, body} = this.#setBodyRequest(method, dataList);

    const response = await this.#requestFromServer(link, request, headers, body);

    let resultResponse;

    try {
      resultResponse = await response.json();
    } catch {
      resultResponse = null;
    }

    return {
      responseOk: response.ok,
      data: resultResponse,
    };
  }


  #requestFromServer = (link, request, headers, body) => fetch(link, {
    method: request,
    headers: headers,
    body: body
  })

  #setBodyRequest = (method, dataList) => {
    switch (method) {
      case 'getMovies' : {
        const link = `${this.#linkToServer}movies/`;
        const request = 'GET';
        const headers = new Headers();
        headers.append('Authorization', this.#authorization);
        const body = null;
        return {link, request, headers, body};
      }
      case 'getComments' : {
        const {idFilm} = dataList;
        const link = `${this.#linkToServer}comments/${idFilm}`;
        const request = 'GET';
        const headers = new Headers();
        headers.append('Authorization', this.#authorization);
        const body = null;
        return {link, request, headers, body};
      }
      case 'putMovies' : {
        const {idFilm, data} = dataList;
        const link = `${this.#linkToServer}movies/${idFilm}`;
        const request = 'PUT';
        const headers = new Headers();
        headers.append('Authorization', this.#authorization);
        headers.append('Content-Type', 'application/json');
        const body = JSON.stringify(data);
        return {link, request, headers, body};
      }
      case 'postComment' : {
        const {idFilm, data} = dataList;
        const link = `${this.#linkToServer}comments/${idFilm}`;
        const request = 'POST';
        const headers = new Headers();
        headers.append('Authorization', this.#authorization);
        headers.append('Content-Type', 'application/json');
        const body = JSON.stringify(data);
        return {link, request, headers, body};
      }
      case 'deleteComment' : {
        const {idComment} = dataList;
        const link = `${this.#linkToServer}comments/${idComment}`;
        const request = 'DELETE';
        const headers = new Headers();
        headers.append('Authorization', this.#authorization);
        headers.append('Content-Type', 'application/json');
        const body = null;
        return {link, request, headers, body};
      }
    }
  }

}

export {ApiService};
