import {filmsData} from '/src/mock/temporary-data.js';
import {MainPresenter} from '/src/presenter/main-presenter.js';

const PrimaryActions = new Promise( (resolve) => {
  setTimeout( () => {
    resolve(filmsData);
  }, 1000);
});

PrimaryActions
  .then( (data) => {
    new MainPresenter(data).init();
  });

