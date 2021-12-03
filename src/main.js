import {filmsData} from '/src/mock/temporary-data.js';

import {NavigationMenuMarkup} from '/src/view/navigation-menu.js';
import {SortListMarkup} from '/src/view/sort-list-menu.js';
import {FilmsListMarkup} from '/src/view/films-list.js';
import {FilmCardMarkup} from '/src/view/film-card.js';
import {ProfileUserMarkup} from '/src/view/profile-user.js';
import {FilmsCountMarkup} from '/src/view/films-count.js';
import {FilmDetailsPopupMarkup, FilmDetailCardMarkup, FilmDetailsCardFilterButtons, filmDetailsCommentsCountMarkup, filmDetailsCommentMarkup} from '/src/view/film-details-popup.js';
import {positionMarkup, renderMarkupHtmlElement} from '/src/utils/render-html-element.js';
import {onEscKeydown} from '/src/utils/util.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list.js';
import {ExtraFilmCardMarkup} from '/src/view/extra-films-list.js';

const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');

let filmsCard;

renderMarkupHtmlElement(headerBodyElement, positionMarkup.BEFORE_END, new ProfileUserMarkup().getElement);
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, new NavigationMenuMarkup(filmsData).getElement);
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, new SortListMarkup().getElement);
renderMarkupHtmlElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, new FilmsCountMarkup(filmsData.length).getElement);

renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, new LoadingFilmsListMarkup().getElement);

renderMarkupHtmlElement(footerBodyElement, positionMarkup.BEFORE_END, new FilmDetailsPopupMarkup().getElement);

const filmDetailsPopup = document.querySelector('.film-details');
const filmDetailsContainer = document.querySelector('.film-details__top-container');
const closePopupFilmDetailsButton = document.querySelector('.film-details__close-btn');
const filmDetailsCommentsWrap = document.querySelector('.film-details__comments-wrap');
const filmDetailsCommentsList = document.querySelector('.film-details__comments-list');


function renderFilmsCardToShowMoreButtonClickHandler () {
  const filmsList = document.querySelector('.films-list');
  const showMoreButton = document.querySelector('.films-list__show-more');
  const filmsListWithClassToHidden = document.querySelectorAll('article[class="film-card hidden"]');

  if (filmsListWithClassToHidden.length <= INITIAL_FILMS_CARD_COUNT) {
    filmsList.removeChild(showMoreButton);
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

function сreateFilmsList (films) {
  document.querySelector('.films').remove();
  renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, new FilmsListMarkup().getElement);

  if (films.length > INITIAL_FILMS_CARD_COUNT) {
    const filmsList = document.querySelector('.films-list');
    filmsList.append(new ShowMoreButtonMarkup().getElement);
  }

  const filmsListContainer = document.querySelector('.films-list__container');
  const showMoreButton = document.querySelector('.films-list__show-more');

  films.forEach( (item, index) => index >= INITIAL_FILMS_CARD_COUNT ?
    renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item, true).getElement) :
    renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item).getElement));

  const topRatedFilmsListContainer = document.querySelector('.films-list__container.top-rated');
  const mostCommentedFilmsListContainer = document.querySelector('.films-list__container.most-commented');

  films.sort( (itemA, itemB) => itemB.rating - itemA.rating)
    .slice(0,2)
    .forEach( (item) => topRatedFilmsListContainer.append(new ExtraFilmCardMarkup(item).getElement));

  films.sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length)
    .slice(0,2)
    .forEach( (item) => mostCommentedFilmsListContainer.append(new ExtraFilmCardMarkup(item).getElement));

  showMoreButton.addEventListener('click', renderFilmsCardToShowMoreButtonClickHandler);
}

setTimeout(() => {
  сreateFilmsList(filmsData);
  filmsCard = document.querySelector('.films');
  filmsCard.addEventListener('click', openFilmDetailsPopupClickHandler);
}, 3000);


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
        filmDetailsCommentsWrap.prepend(new filmDetailsCommentsCountMarkup(filmData).getElement);
        filmData.comments.forEach( (item) => filmDetailsCommentsList.append(new filmDetailsCommentMarkup(item).getElement));

        break;
      }
    }
    closePopupFilmDetailsButton.addEventListener('click', closeFilmDetailsPopupClickHandler);
    document.addEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
  }
}

function closeFilmDetailsPopupClickHandler () {
  bodyElement.classList.remove('hide-overflow');
  filmDetailsPopup.classList.add('hidden');

  const filmDetailsInfo = filmDetailsPopup.querySelector('.film-details__info-wrap');
  const filmDetailsFilterButtons = filmDetailsPopup.querySelector('.film-details__controls');
  const filmDetailsCommentsTitle = filmDetailsCommentsWrap.querySelector('.film-details__comments-title');

  filmDetailsContainer.removeChild(filmDetailsInfo);
  filmDetailsContainer.removeChild(filmDetailsFilterButtons);
  filmDetailsCommentsWrap.removeChild(filmDetailsCommentsTitle);
  filmDetailsCommentsList.textContent = '';

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
  const filmDetailsCommentsTitle = filmDetailsCommentsWrap.querySelector('.film-details__comments-title');

  filmDetailsContainer.removeChild(filmDetailsInfo);
  filmDetailsContainer.removeChild(filmDetailsFilterButtons);
  filmDetailsCommentsWrap.removeChild(filmDetailsCommentsTitle);
  filmDetailsCommentsList.textContent = '';

  filmsCard.addEventListener('click', openFilmDetailsPopupClickHandler);
  closePopupFilmDetailsButton.removeEventListener('click', closeFilmDetailsPopupClickHandler);
  document.removeEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
}
