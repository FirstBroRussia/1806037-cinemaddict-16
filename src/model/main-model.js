import {filmsData} from '/src/mock/temporary-data.js';

const data = filmsData.slice();

class MainModel {
  _observers = [];
  #filmsData = null;

  async getData () {
    const dataFromServer = await new Promise( (resolve) => {
      setTimeout( () => {
        resolve(data);
      }, 300);
    });
    this.#filmsData = dataFromServer;

    return this.#filmsData.slice();
  }

  async changeData (id, changedData) {
    for (let index = 0; index < data.length; index++) {
      if (data[index].id === id) {
        data[index] = changedData;
        break;
      }
    }

    await this.getData();
    this.observersNotify(id);
  }

  odserverAdd = (callback) => {
    this._observers.push(callback);
  };

  observersRemove = () => {
    this._observers = [];
  };

  observersNotify = (id) => {
    this._observers.forEach( (item) => item(this.#filmsData, id));
  };

}

export {MainModel};
