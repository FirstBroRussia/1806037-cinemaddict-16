import {createNavigationMenuTemplate} from '/src/view/navigation-menu.js';
import {createStatisticMenuTemplate} from '/src/view/statistic-menu.js';
import {createSortListMenuTemplate} from '/src/view/sort-list-menu.js';
import {createFilmsListTemplate} from '/src/view/films-list.js';
import {createTitleProfileUserTemplate} from '/src/view/profile-user.js';
import {createFilmsCountTemplate} from '/src/view/films-count.js';
import {createFilmDetailsPopupTemplate} from '/src/view/film-details-popup.js';
import {createEmptyFilmsListTemplate} from '/src/view/empty-films-list.js';
import {createShowMoreButtonTemplate} from '/src/view/show-more-button.js';
import {createExtraFilmsListTemplate} from '/src/view/extra-films-list.js';
import {createLoadingFilmsListTemplate} from '/src/view/loading-films-list.js';


const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

headerBodyElement.insertAdjacentHTML('beforeend',createTitleProfileUserTemplate());


mainBodyElement.insertAdjacentHTML('beforeend', createNavigationMenuTemplate());

mainBodyElement.insertAdjacentHTML('beforeend', createLoadingFilmsListTemplate());

mainBodyElement.insertAdjacentHTML('beforeend', createSortListMenuTemplate());
mainBodyElement.insertAdjacentHTML('beforeend', createStatisticMenuTemplate());
mainBodyElement.insertAdjacentHTML('beforeend', createFilmsListTemplate());
mainBodyElement.insertAdjacentHTML('beforeend', createShowMoreButtonTemplate());
mainBodyElement.insertAdjacentHTML('beforeend', createExtraFilmsListTemplate());
mainBodyElement.insertAdjacentHTML('beforeend', createEmptyFilmsListTemplate());


footerStatisticBodyElement.insertAdjacentHTML('beforeend', createFilmsCountTemplate());
footerBodyElement.insertAdjacentHTML('beforeend', createFilmDetailsPopupTemplate());

const closePopupFilmDetailsButton = document.querySelector('.film-details__close-btn');
const filmDetailsPopup = document.querySelector('.film-details');

closePopupFilmDetailsButton.addEventListener('click', () => {
  filmDetailsPopup.style.display = 'none';
});
