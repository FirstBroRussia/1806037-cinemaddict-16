import {filmsData} from '/src/mock/temporary-data.js';

import {createNavigationMenuTemplate} from '/src/view/navigation-menu.js';
import {createSortListMenuTemplate} from '/src/view/sort-list-menu.js';
import {createFilmsListTemplate} from '/src/view/films-list.js';
import {createFilmCardTemplate, setClassToggleToControlButtonsForFilmCard, setMarkupCommentsCountField} from '/src/view/film-card.js';
import {createTitleProfileUserTemplate} from '/src/view/profile-user.js';
import {createFilmsCountTemplate} from '/src/view/films-count.js';
import {createFilmDetailsPopupTemplate, createFilmDetailsMarkupTemplate, setFilmDetailGenresMarkup, setClassToggleToControlButtonsForFilmDetails} from '/src/view/film-details-popup.js';
import '/src/mock/temporary-data.js';
import '/src/utils/util.js';

/* import {createStatisticMenuTemplate} from '/src/view/statistic-menu.js';
import {createEmptyFilmsListTemplate} from '/src/view/empty-films-list.js';
import {createShowMoreButtonTemplate} from '/src/view/show-more-button.js';
import {createExtraFilmsListTemplate} from '/src/view/extra-films-list.js';
import {createLoadingFilmsListTemplate} from '/src/view/loading-films-list.js'; */

const MAX_COUNT_FILMS_CARD_TO_SCREEN_IN_ONE_LINE = 5;

const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

headerBodyElement.insertAdjacentHTML('beforeend',createTitleProfileUserTemplate());
mainBodyElement.insertAdjacentHTML('beforeend', createNavigationMenuTemplate(filmsData));
mainBodyElement.insertAdjacentHTML('beforeend', createSortListMenuTemplate());
footerStatisticBodyElement.insertAdjacentHTML('beforeend', createFilmsCountTemplate(filmsData.length));


function getCreateListFilms (data) {
  mainBodyElement.insertAdjacentHTML('beforeend', createFilmsListTemplate());
  const filmsListContainer = document.querySelector('.films-list__container');
  data.forEach( (item) => {
    filmsListContainer.insertAdjacentHTML('beforeend', createFilmCardTemplate(item));
    setClassToggleToControlButtonsForFilmCard(item);
    setMarkupCommentsCountField(item);
  });
  const showMoreButton = document.querySelector('.films-list__show-more');

  function getRenderFilmsCardToShowMoreButton () {
    const filmsListWithClassToHidden = document.querySelectorAll('article[class="film-card hidden"]');
    if (filmsListWithClassToHidden.length <= MAX_COUNT_FILMS_CARD_TO_SCREEN_IN_ONE_LINE) {
      showMoreButton.classList.add('hidden');
      for (const card of filmsListWithClassToHidden) {
        card.classList.remove('hidden');
        showMoreButton.removeEventListener('click', getRenderFilmsCardToShowMoreButton);
      }
      return;
    }
    for (let index = 0; index < MAX_COUNT_FILMS_CARD_TO_SCREEN_IN_ONE_LINE; index++) {
      filmsListWithClassToHidden[index].classList.remove('hidden');
    }
  }
  getRenderFilmsCardToShowMoreButton();
  showMoreButton.addEventListener('click', getRenderFilmsCardToShowMoreButton);
}
getCreateListFilms(filmsData);


// mainBodyElement.insertAdjacentHTML('beforeend', createLoadingFilmsListTemplate());
// mainBodyElement.insertAdjacentHTML('beforeend', createStatisticMenuTemplate());
// mainBodyElement.insertAdjacentHTML('beforeend', createShowMoreButtonTemplate());
// mainBodyElement.insertAdjacentHTML('beforeend', createExtraFilmsListTemplate());
// mainBodyElement.insertAdjacentHTML('beforeend', createEmptyFilmsListTemplate());


const filmsCard = document.querySelector('.films');
filmsCard.addEventListener('click', getOpenFilmDetailsPopupClickHandler);

function getOpenFilmDetailsPopupClickHandler (evt) {
  if (evt.target.closest('.film-card__controls-item')) {
    return;
  }
  if (evt.target.closest('article[class^="film-card"]')) {
    filmsCard.removeEventListener('click', getOpenFilmDetailsPopupClickHandler);

    const currentIdFilmCard = +evt.target.closest('article[class^="film-card"]').getAttribute('id');
    for (const filmData of filmsData) {
      if (filmData.id === currentIdFilmCard) {
        footerBodyElement.insertAdjacentHTML('beforeend', createFilmDetailsPopupTemplate());
        const filmDetailsContainer = document.querySelector('.film-details__top-container');
        filmDetailsContainer.insertAdjacentHTML('beforeend', createFilmDetailsMarkupTemplate(filmData));
        setFilmDetailGenresMarkup(filmData);
        setClassToggleToControlButtonsForFilmDetails(filmData);

        const closePopupFilmDetailsButton = document.querySelector('.film-details__close-btn');

        const getCloseFilmDetailsPopupClickHandler = () => {
          const filmDetailsHTMLElement = footerBodyElement.querySelector('section[class="film-details"]');
          filmDetailsHTMLElement.remove();
          filmsCard.addEventListener('click', getOpenFilmDetailsPopupClickHandler);
          closePopupFilmDetailsButton.removeEventListener('click', getCloseFilmDetailsPopupClickHandler);
        };
        closePopupFilmDetailsButton.addEventListener('click', getCloseFilmDetailsPopupClickHandler);
        break;
      }
    }
  }
}
