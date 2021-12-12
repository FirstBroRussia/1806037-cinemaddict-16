import {filmsData} from '/src/mock/temporary-data.js';

import {Presenter} from '/src/presenter/presenter.js';

const PrimaryActions = new Promise( (resolve) => {
  setTimeout( () => {
    resolve(filmsData);
  }, 3000);
});

PrimaryActions
  .then( (data) => new Presenter(data).init());
