import {filmsData} from '/src/mock/temporary-data.js';

import {FilmsListPresenter} from '/src/presenter/presenters.js';


const PrimaryActions = new Promise( (resolve) => {
  setTimeout( () => {
    resolve(filmsData);
  }, 1000);
});

PrimaryActions
  .then( (data) => {
    new FilmsListPresenter(data).init();
  });
