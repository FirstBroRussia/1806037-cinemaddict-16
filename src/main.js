import {headerBodyElement, mainElement, footerStatisticBodyElement} from '/src/utils/util.js';

import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {positionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';


import {filmsData} from '/src/mock/temporary-data.js';
import {FilmsListPresenter} from '/src/presenter/films-list-presenter.js';


const PrimaryActions = new Promise( (resolve) => {
  setTimeout( () => {
    resolve(filmsData);
  }, 1000);
});

PrimaryActions
  .then( (data) => {
    primaryInit(data);
    new FilmsListPresenter(data).render();
  });


function primaryInit (data) {
  const ProfileUserComponent = new ProfileUserMarkup();
  const NavigationMenuComponent = new NavigationMenuMarkup(data);
  const SortListComponent = new SortListMarkup();
  const FilmsCountComponent = new FilmsCountMarkup(data.length);


  renderNodeElement(headerBodyElement, positionMarkup.BEFORE_END, ProfileUserComponent);
  renderNodeElement(mainElement, positionMarkup.BEFORE_END, NavigationMenuComponent);
  renderNodeElement(mainElement, positionMarkup.BEFORE_END, SortListComponent);
  renderNodeElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, FilmsCountComponent);
}
