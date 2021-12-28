import {sortMode} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-class.js';

const createSortListMenuTemplate = () => `
<ul class="sort">
<li><a href="#default" class="sort__button sort__button--active">Sort by default</a></li>
<li><a href="#date" class="sort__button">Sort by date</a></li>
<li><a href="#rating" class="sort__button">Sort by rating</a></li>
</ul>
`;

class SortListMarkup extends AbstractView {
  _currentActiveButton = null;
  constructor () {
    super();

    this._template = createSortListMenuTemplate;
    this._element = createNodeElement(this._template());
    this._currentActiveButton = this._element.querySelector('.sort__button--active');
  }

  defaultSortButtonClickSimulation () {
    this._element.querySelector('a[href="#default"]').click();
  }

  hideComponent () {
    this._element.classList.add('hidden');
  }

  showComponent () {
    this._element.classList.remove('hidden');
  }

  setDefaultSortClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.defaultSortClick = callback;
    this._element.querySelector('a[href="#default"]').addEventListener(event, this.#hangDefaultSortHandler);
  }

  setDateSortClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.dateSortClick = callback;
    this._element.querySelector('a[href="#date"]').addEventListener(event, this.#hangDateSortHandler);
  }

  setRatingSortClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.ratingSortClick = callback;
    this._element.querySelector('a[href="#rating"]').addEventListener(event, this.#hangRatingSortHandler);
  }

  #hangDefaultSortHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.sort__button--active')) {
      return;
    }
    this._currentActiveButton.classList.remove('sort__button--active');
    this._currentActiveButton = evt.target.closest('.sort__button');
    this._currentActiveButton.classList.add('sort__button--active');
    this._callback.defaultSortClick(sortMode.DEFAULT);
  }

  #hangDateSortHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.sort__button--active')) {
      return;
    }
    this._currentActiveButton.classList.remove('sort__button--active');
    this._currentActiveButton = evt.target.closest('.sort__button');
    this._currentActiveButton.classList.add('sort__button--active');
    this._callback.dateSortClick(sortMode.DATE);
  }

  #hangRatingSortHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.sort__button--active')) {
      return;
    }
    this._currentActiveButton.classList.remove('sort__button--active');
    this._currentActiveButton = evt.target.closest('.sort__button');
    this._currentActiveButton.classList.add('sort__button--active');
    this._callback.ratingSortClick(sortMode.RATING);
  }

}

export {SortListMarkup};
