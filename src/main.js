import {filmsData} from '/src/mock/temporary-data.js';
import {createNavigationMenuTemplate} from '/src/view/navigation-menu.js';
import {createSortListMenuTemplate} from '/src/view/sort-list-menu.js';
import {createFilmsListTemplate} from '/src/view/films-list.js';
import {createFilmCardTemplate} from '/src/view/film-card.js';
import {createTitleProfileUserTemplate} from '/src/view/profile-user.js';
import {createFilmsCountTemplate} from '/src/view/films-count.js';
import {createFilmDetailsPopupTemplate, createFilmDetailsMarkupTemplate} from '/src/view/film-details-popup.js';
import {positionMarkup, renderMarkupHtmlElement} from '/src/utils/render-html-element.js';

const INITIAL_FILMS_CARD_COUNT = 5;

const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

let closePopupFilmDetailsButton;


renderMarkupHtmlElement(headerBodyElement, positionMarkup.BEFORE_END, createTitleProfileUserTemplate());
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, createNavigationMenuTemplate(filmsData));
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, createSortListMenuTemplate());
renderMarkupHtmlElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, createFilmsCountTemplate(filmsData.length));

function сreateFilmsList (films) {
  renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, createFilmsListTemplate());
  const filmsListContainer = document.querySelector('.films-list__container');
  const showMoreButton = document.querySelector('.films-list__show-more');
  const classHidden = 'hidden';

  if (films.length <= INITIAL_FILMS_CARD_COUNT) {
    showMoreButton.classList.add(classHidden);
  }

  films.forEach( (item, index) => {
    if (index >= INITIAL_FILMS_CARD_COUNT) {
      return renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, createFilmCardTemplate(item, classHidden));
    }

    return renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, createFilmCardTemplate(item));
  });

  showMoreButton.addEventListener('click', renderFilmsCardToShowMoreButtonClickHandler);
}
сreateFilmsList(filmsData);

function renderFilmsCardToShowMoreButtonClickHandler () {
  const showMoreButton = document.querySelector('.films-list__show-more');
  const filmsListWithClassToHidden = document.querySelectorAll('article[class="film-card hidden"]');

  if (filmsListWithClassToHidden.length <= INITIAL_FILMS_CARD_COUNT) {
    showMoreButton.classList.add('hidden');
    for (const card of filmsListWithClassToHidden) {
      card.classList.remove('hidden');
      showMoreButton.removeEventListener('click', renderFilmsCardToShowMoreButtonClickHandler);
    }

    return;
  }

  for (let index = 0; index < INITIAL_FILMS_CARD_COUNT; index++) {
    filmsListWithClassToHidden[index].classList.remove('hidden');
  }
}


const filmsCard = document.querySelector('.films');
filmsCard.addEventListener('click', openFilmDetailsPopupClickHandler);

const closeFilmDetailsPopupClickHandler = () => {
  const filmDetailsHTMLElement = footerBodyElement.querySelector('section[class="film-details"]');
  filmDetailsHTMLElement.remove();
  filmsCard.addEventListener('click', openFilmDetailsPopupClickHandler);
  closePopupFilmDetailsButton.removeEventListener('click', closeFilmDetailsPopupClickHandler);
};

function openFilmDetailsPopupClickHandler (evt) {
  if (evt.target.closest('.film-card__controls-item')) {
    return;
  }

  if (evt.target.closest('article[class^="film-card"]')) {
    filmsCard.removeEventListener('click', openFilmDetailsPopupClickHandler);

    const currentIdFilmCard = +evt.target.closest('article[class^="film-card"]').getAttribute('id');

    for (const filmData of filmsData) {
      if (filmData.id === currentIdFilmCard) {
        renderMarkupHtmlElement(footerBodyElement, positionMarkup.BEFORE_END, createFilmDetailsPopupTemplate());

        const filmDetailsContainer = document.querySelector('.film-details__top-container');
        renderMarkupHtmlElement(filmDetailsContainer, positionMarkup.BEFORE_END, createFilmDetailsMarkupTemplate(filmData));

        closePopupFilmDetailsButton = document.querySelector('.film-details__close-btn');

        closePopupFilmDetailsButton.addEventListener('click', closeFilmDetailsPopupClickHandler);
        break;
      }
    }
  }
}
