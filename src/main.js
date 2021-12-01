import {filmsData} from '/src/mock/temporary-data.js';

import {NavigationMenuMarkup} from '/src/view/navigation-menu.js';
import {SortListMarkup} from '/src/view/sort-list-menu.js';
import {FilmsListMarkup} from '/src/view/films-list.js';
import {FilmCardMarkup} from '/src/view/film-card.js';
import {ProfileUserMarkup} from '/src/view/profile-user.js';
import {FilmsCountMarkup} from '/src/view/films-count.js';
import {FilmDetailsPopupMarkup, FilmDetailCardMarkup, FilmDetailsCardFilterButtons} from '/src/view/film-details-popup.js';
import {positionMarkup, renderMarkupHtmlElement} from '/src/utils/render-html-element.js';
import {onEscKeydown} from '/src/utils/util.js';


const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');


renderMarkupHtmlElement(headerBodyElement, positionMarkup.BEFORE_END, new ProfileUserMarkup().getElement);
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, new NavigationMenuMarkup(filmsData).getElement);
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, new SortListMarkup().getElement);
renderMarkupHtmlElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, new FilmsCountMarkup(filmsData.length).getElement);

renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, new FilmsListMarkup().getElement);
renderMarkupHtmlElement(footerBodyElement, positionMarkup.BEFORE_END, new FilmDetailsPopupMarkup().getElement);

const filmDetailsPopup = document.querySelector('.film-details');
const filmDetailsContainer = document.querySelector('.film-details__top-container');
const closePopupFilmDetailsButton = document.querySelector('.film-details__close-btn');

function сreateFilmsList (films) {
  const filmsListContainer = document.querySelector('.films-list__container');
  const showMoreButton = document.querySelector('.films-list__show-more');
  const addClassHidden = true;
  const removeClassHidden = false;


  if (films.length <= INITIAL_FILMS_CARD_COUNT) {
    showMoreButton.classList.add(addClassHidden);
  }

  films.forEach( (item, index) => index >= INITIAL_FILMS_CARD_COUNT ?
    renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item, addClassHidden).getElement) :
    renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item, removeClassHidden).getElement));

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

function closeFilmDetailsPopupClickHandler () {
  bodyElement.classList.remove('hide-overflow');
  filmDetailsPopup.classList.add('hidden');

  const filmDetailsInfo = filmDetailsPopup.querySelector('.film-details__info-wrap');
  const filmDetailsFilterButtons = filmDetailsPopup.querySelector('.film-details__controls');

  filmDetailsContainer.removeChild(filmDetailsInfo);
  filmDetailsContainer.removeChild(filmDetailsFilterButtons);

  filmsCard.addEventListener('click', openFilmDetailsPopupClickHandler);
  document.removeEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
}

function closeFilmDetailsPopupKeydownHandler (evt) {
  if (!onEscKeydown(evt)) {
    return;
  }
  bodyElement.classList.remove('hide-overflow');
  filmDetailsPopup.classList.add('hidden');

  const filmDetailsInfo = filmDetailsPopup.querySelector('.film-details__info-wrap');
  const filmDetailsFilterButtons = filmDetailsPopup.querySelector('.film-details__controls');

  filmDetailsContainer.removeChild(filmDetailsInfo);
  filmDetailsContainer.removeChild(filmDetailsFilterButtons);

  filmsCard.addEventListener('click', openFilmDetailsPopupClickHandler);
  closePopupFilmDetailsButton.removeEventListener('click', closeFilmDetailsPopupClickHandler);
  document.removeEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
}

function openFilmDetailsPopupClickHandler (evt) {
  if (evt.target.closest('.film-card__controls-item')) {
    return;
  }

  if (evt.target.closest('article[class^="film-card"]')) {
    bodyElement.classList.add('hide-overflow');
    filmDetailsPopup.classList.remove('hidden');

    filmsCard.removeEventListener('click', openFilmDetailsPopupClickHandler);

    const currentIdFilmCard = +evt.target.closest('article[class^="film-card"]').getAttribute('id');

    for (const filmData of filmsData) {
      if (filmData.id === currentIdFilmCard) {
        filmDetailsContainer.appendChild(new FilmDetailCardMarkup(filmData).getElement);
        filmDetailsContainer.appendChild(new FilmDetailsCardFilterButtons(filmData).getElement);

        break;
      }
    }
    closePopupFilmDetailsButton.addEventListener('click', closeFilmDetailsPopupClickHandler);
    document.addEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
  }
}
