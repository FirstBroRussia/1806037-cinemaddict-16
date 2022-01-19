import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';
import {FilterMode} from '/src/utils/util.js';

const createAllFilmsFilterTemplate = () => `
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
`;

export default class AllFilmsFilterMarkup extends AbstractView {
  #mainWrapComponent = null;

  constructor (mainWrapComponent) {
    super();

    this.#mainWrapComponent = mainWrapComponent;
    this._template = createAllFilmsFilterTemplate;
    this._element = createNodeElement(this._template());
    this.#mainWrapComponent.setCurrentActiveButton(this._element);
  }

  setAllMoviesFilterClickHandler = (event, callback) => {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.allMoviesFilterClick = callback;
    this._element.addEventListener(event, this.#hangAllMoviesHandler);
  }

  #hangAllMoviesHandler = (evt) => {
    if (this._element.closest('.main-navigation__item--active')) {
      return;
    }
    this.#mainWrapComponent.setCurrentActiveButton(this._element);
    this._element.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.allMoviesFilterClick(FilterMode.ALL_MOVIES);
  }
}
