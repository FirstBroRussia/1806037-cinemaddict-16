import {filmsData} from '/src/mock/temporary-data.js';

import {NavigationMenuMarkup} from '/src/view/navigation-menu-view.js';
import {SortListMarkup} from '/src/view/sort-list-menu-view.js';
import {FilmsListMarkup} from '/src/view/films-list-view.js';
import {FilmCardMarkup} from '/src/view/film-card-view.js';
import {ProfileUserMarkup} from '/src/view/profile-user-view.js';
import {FilmsCountMarkup} from '/src/view/films-count-view.js';
import {FilmDetailsPopupMarkup, FilmDetailCardMarkup, FilmDetailsCardFilterButtons, filmDetailsCommentsCountMarkup, filmDetailsCommentMarkup} from '/src/view/film-details-popup-view.js';
import {positionMarkup, renderMarkupHtmlElement} from '/src/utils/render-html-element.js';
import {onEscKeydown} from '/src/utils/util.js';
import {ShowMoreButtonMarkup} from '/src/view/show-more-button-view.js';
import {LoadingFilmsListMarkup} from '/src/view/loading-films-list-view.js';

const INITIAL_FILMS_CARD_COUNT = 5;

const bodyElement = document.querySelector('body');
const headerBodyElement = document.querySelector('.header');
const mainBodyElement = document.querySelector('.main');
const footerBodyElement = document.querySelector('.footer');
const footerStatisticBodyElement = document.querySelector('.footer__statistics');


const ProfileUserComponent = new ProfileUserMarkup();
const NavigationMenuComponent = new NavigationMenuMarkup(filmsData);
const SortListComponent = new SortListMarkup();
const FilmsCountComponent = new FilmsCountMarkup(filmsData.length);
const LoadingFilmsListComponent = new LoadingFilmsListMarkup();
const FilmDetailsPopupComponent = new FilmDetailsPopupMarkup();
const ShowMoreButtonComponent = new ShowMoreButtonMarkup();
const FilmsListComponent = new FilmsListMarkup();


renderMarkupHtmlElement(headerBodyElement, positionMarkup.BEFORE_END, ProfileUserComponent);
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, NavigationMenuComponent);
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, SortListComponent);
renderMarkupHtmlElement(footerStatisticBodyElement, positionMarkup.BEFORE_END, FilmsCountComponent);
renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, LoadingFilmsListComponent);
renderMarkupHtmlElement(footerBodyElement, positionMarkup.BEFORE_END, FilmDetailsPopupComponent);

const filmDetailsContainer = FilmDetailsPopupComponent.getElement.querySelector('.film-details__top-container');
const closePopupFilmDetailsButton = FilmDetailsPopupComponent.getElement.querySelector('.film-details__close-btn');
const filmDetailsCommentsWrap = FilmDetailsPopupComponent.getElement.querySelector('.film-details__comments-wrap');
const filmDetailsCommentsList = FilmDetailsPopupComponent.getElement.querySelector('.film-details__comments-list');


function сreateFilmsList (films) {
  LoadingFilmsListComponent.getElement.remove();
  renderMarkupHtmlElement(mainBodyElement, positionMarkup.BEFORE_END, FilmsListComponent);

  if (films.length > INITIAL_FILMS_CARD_COUNT) {
    FilmsListComponent.getElement.querySelector('.films-list').append(ShowMoreButtonComponent.getElement);
    ShowMoreButtonComponent.addEventHandler('click', renderFilmsCardToShowMoreButtonClickHandler);
  }

  const filmsListContainer = FilmsListComponent.getElement.querySelector('.films-list__container');

  films.forEach( (item, index) => index >= INITIAL_FILMS_CARD_COUNT ?
    renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item, true)) :
    renderMarkupHtmlElement(filmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item)));

  const topRatedFilmsListContainer = FilmsListComponent.getElement.querySelector('.films-list__container.top-rated');
  const mostCommentedFilmsListContainer = FilmsListComponent.getElement.querySelector('.films-list__container.most-commented');

  films.sort( (itemA, itemB) => itemB.rating - itemA.rating)
    .slice(0,2)
    .forEach( (item) => renderMarkupHtmlElement(topRatedFilmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item)));

  films.sort( (itemA, itemB) => itemB.comments.length - itemA.comments.length)
    .slice(0,2)
    .forEach( (item) => renderMarkupHtmlElement(mostCommentedFilmsListContainer, positionMarkup.BEFORE_END, new FilmCardMarkup(item)));
}

setTimeout(() => {
  сreateFilmsList(filmsData);
  FilmsListComponent.addEventHandler('click', openFilmDetailsPopupClickHandler);
}, 3000);

function renderFilmsCardToShowMoreButtonClickHandler () {
  const filmsList = FilmsListComponent.getElement.querySelector('.films-list');
  const filmsListWithClassToHidden = FilmsListComponent.getElement.querySelectorAll('article[class="film-card hidden"]');

  if (filmsListWithClassToHidden.length <= INITIAL_FILMS_CARD_COUNT) {
    filmsList.removeChild(ShowMoreButtonComponent.getElement);
    for (const card of filmsListWithClassToHidden) {
      card.classList.remove('hidden');
      ShowMoreButtonComponent.removeEventHandler('click', renderFilmsCardToShowMoreButtonClickHandler);
    }

    return;
  }

  for (let index = 0; index < INITIAL_FILMS_CARD_COUNT; index++) {
    filmsListWithClassToHidden[index].classList.remove('hidden');
  }
}

function openFilmDetailsPopupClickHandler (evt) {
  if (evt.target.closest('.film-card__controls-item')) {
    return;
  }

  if (evt.target.closest('article[class^="film-card"]')) {
    bodyElement.classList.add('hide-overflow');
    FilmDetailsPopupComponent.getElement.classList.remove('hidden');

    FilmsListComponent.removeEventHandler('click', openFilmDetailsPopupClickHandler);

    const currentIdFilmCard = +evt.target.closest('article[class^="film-card"]').getAttribute('id');

    for (const filmData of filmsData) {
      if (filmData.id === currentIdFilmCard) {
        renderMarkupHtmlElement(filmDetailsContainer, positionMarkup.BEFORE_END, new FilmDetailCardMarkup(filmData));
        renderMarkupHtmlElement(filmDetailsContainer, positionMarkup.BEFORE_END, new FilmDetailsCardFilterButtons(filmData));
        renderMarkupHtmlElement(filmDetailsCommentsWrap, positionMarkup.AFTER_BEGIN, new filmDetailsCommentsCountMarkup(filmData));
        filmData.comments.forEach( (item) => renderMarkupHtmlElement(filmDetailsCommentsList, positionMarkup.BEFORE_END, new filmDetailsCommentMarkup(item)));

        break;
      }
    }
    closePopupFilmDetailsButton.addEventListener('click', closeFilmDetailsPopupClickHandler);
    document.addEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
  }
}

function closeFilmDetailsPopupClickHandler () {
  bodyElement.classList.remove('hide-overflow');
  FilmDetailsPopupComponent.getElement.classList.add('hidden');

  const filmDetailsInfo = FilmDetailsPopupComponent.getElement.querySelector('.film-details__info-wrap');
  const filmDetailsFilterButtons = FilmDetailsPopupComponent.getElement.querySelector('.film-details__controls');
  const filmDetailsCommentsTitle = FilmDetailsPopupComponent.getElement.querySelector('.film-details__comments-title');

  filmDetailsContainer.removeChild(filmDetailsInfo);
  filmDetailsContainer.removeChild(filmDetailsFilterButtons);
  filmDetailsCommentsWrap.removeChild(filmDetailsCommentsTitle);
  filmDetailsCommentsList.textContent = '';

  FilmsListComponent.addEventHandler('click', openFilmDetailsPopupClickHandler);
  document.removeEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
}

function closeFilmDetailsPopupKeydownHandler (evt) {
  if (!onEscKeydown(evt)) {
    return;
  }
  bodyElement.classList.remove('hide-overflow');
  FilmDetailsPopupComponent.getElement.classList.add('hidden');

  const filmDetailsInfo = FilmDetailsPopupComponent.getElement.querySelector('.film-details__info-wrap');
  const filmDetailsFilterButtons = FilmDetailsPopupComponent.getElement.querySelector('.film-details__controls');
  const filmDetailsCommentsTitle = filmDetailsCommentsWrap.querySelector('.film-details__comments-title');

  filmDetailsContainer.removeChild(filmDetailsInfo);
  filmDetailsContainer.removeChild(filmDetailsFilterButtons);
  filmDetailsCommentsWrap.removeChild(filmDetailsCommentsTitle);
  filmDetailsCommentsList.textContent = '';

  FilmsListComponent.addEventHandler('click', openFilmDetailsPopupClickHandler);
  closePopupFilmDetailsButton.removeEventListener('click', closeFilmDetailsPopupClickHandler);
  document.removeEventListener('keydown', closeFilmDetailsPopupKeydownHandler);
}

export {openFilmDetailsPopupClickHandler};

// Пробная функция для нажатия кнопок фильтров
const filterButtons = document.querySelector('.main-navigation__items');

function closureFn () {
  let currentClickedFilterButton = document.querySelector('.main-navigation__item--active');
  return function () {
    filterButtons.addEventListener('click', (evt) => {
      currentClickedFilterButton.classList.remove('main-navigation__item--active');
      currentClickedFilterButton = evt.target.closest('.main-navigation__item');
      currentClickedFilterButton.classList.add('main-navigation__item--active');
    });
  };
}

closureFn()();
