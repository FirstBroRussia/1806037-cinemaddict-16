import {createMenuNavigationElement} from '/src/view/menu-navigation.js';
import {createMenuStatisticElement} from '/src/view/menu-statistic.js';
import {createMenuSortListElement} from '/src/view/menu-sort-list.js';
import {createFilmsListElement} from '/src/view/films-list.js';
import {createProfileUserTitleElement} from '/src/view/profile-user.js';
import {createQuantityOfFilmsElement} from '/src/view/quantity-of-films.js';
import {createPopupFilmDetailsElement} from '/src/view/popup-film-details.js';
import {createFilmsListEmptyElement} from '/src/view/films-list-empty.js';
import {createShowMoreButtonElement} from '/src/view/button-show-more.js';
import {createFilmsListExtraElement} from '/src/view/films-list-extra.js';
import {createFilmsListLoadingElement} from '/src/view/loading-films-list.js';


const headerBodyElement = document.querySelector('.header'); // звание отрисовать
const mainBodyElement = document.querySelector('.main'); // меню + сортировка + контент
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics'); // кол-во фильмов

headerBodyElement.insertAdjacentHTML('beforeend',createProfileUserTitleElement());


mainBodyElement.insertAdjacentHTML('beforeend', createMenuNavigationElement());

mainBodyElement.insertAdjacentHTML('beforeend', createFilmsListLoadingElement());

mainBodyElement.insertAdjacentHTML('beforeend', createMenuSortListElement());
mainBodyElement.insertAdjacentHTML('beforeend', createMenuStatisticElement());
mainBodyElement.insertAdjacentHTML('beforeend', createFilmsListElement());
mainBodyElement.insertAdjacentHTML('beforeend', createShowMoreButtonElement());
mainBodyElement.insertAdjacentHTML('beforeend', createFilmsListExtraElement());
mainBodyElement.insertAdjacentHTML('beforeend', createFilmsListEmptyElement());


footerStatisticBodyElement.insertAdjacentHTML('beforeend', createQuantityOfFilmsElement());
footerBodyElement.insertAdjacentHTML('beforeend', createPopupFilmDetailsElement());

// обработчик для попапа чтоб закрывался при нажатии на крестик
const closePopupFilmDetailsButton = document.querySelector('.film-details');
closePopupFilmDetailsButton.addEventListener('click', () => {
  closePopupFilmDetailsButton.style.display = 'none';
});
