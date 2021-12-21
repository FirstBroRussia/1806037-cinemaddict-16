import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createSortListMenuTemplate = () => `
<ul class="sort">
<li><a href="#default" class="sort__button sort__button--active">Sort by default</a></li>
<li><a href="#date" class="sort__button">Sort by date</a></li>
<li><a href="#rating" class="sort__button">Sort by rating</a></li>
</ul>
`;

class SortListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createSortListMenuTemplate;
    this._element = createNodeElement(this._template());
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
    this._element.querySelector('a[href="#default"]').addEventListener(event, this.#hangDateSortHandler);
  }

  setRatingSortClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.ratingSortClick = callback;
    this._element.querySelector('a[href="#default"]').addEventListener(event, this.#hangRatingSortHandler);
  }

  #hangDefaultSortHandler = (evt) => {
    evt.preventDefault();
    this._callback.defaultSortClick(evt);
  }

  #hangDateSortHandler = (evt) => {
    evt.preventDefault();
    this._callback.dateSortClick(evt);
  }

  #hangRatingSortHandler = (evt) => {
    evt.preventDefault();
    this._callback.ratingSortClick(evt);
  }

}

export {SortListMarkup};
