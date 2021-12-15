import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';
import {INITIAL_FILMS_CARD_COUNT} from '/src/presenter/presenters.js';

const createShowMoreButtonTemplate = () => `
<button class="films-list__show-more">Show more</button>
`;


class ShowMoreButtonMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createShowMoreButtonTemplate;
    this._element = createNodeElement(this._template());
  }

  #renderFilmsCardToShowMoreButtonClickHandler = () => {
    const filmsListWithClassToHidden = document.querySelectorAll('article[class="film-card hidden"]');

    if (filmsListWithClassToHidden.length <= INITIAL_FILMS_CARD_COUNT) {
      this._element.remove();
      this.removeEventHandler('click', this.#renderFilmsCardToShowMoreButtonClickHandler);

      for (const filmCard of filmsListWithClassToHidden) {
        filmCard.classList.remove('hidden');
      }

      return;
    }

    for (let index = 0; index < INITIAL_FILMS_CARD_COUNT; index++) {
      filmsListWithClassToHidden[index].classList.remove('hidden');
    }
  }

  get getElement () {
    this.addEventHandler('click', this.#renderFilmsCardToShowMoreButtonClickHandler);
    return this._element;
  }

}

export {ShowMoreButtonMarkup};
