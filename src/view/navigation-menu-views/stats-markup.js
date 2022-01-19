import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createStatsTemplate = () => `
<a href="#stats" class="main-navigation__additional">Stats</a>
`;

export default class StatsMarkup extends AbstractView {
  #mainWrapComponent = null;

  constructor (mainWrapComponent) {
    super();

    this.#mainWrapComponent = mainWrapComponent;
    this._template = createStatsTemplate;
    this._element = createNodeElement(this._template());
  }

  setStatsButtonClickHandler = (event, callback) => {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.statsButtonClick = callback;
    this._element.addEventListener(event, this.#hangStatsButtonHandler);
  }

  #hangStatsButtonHandler = (evt) => {
    if (this._element.closest('.main-navigation__item--active')) {
      return;
    }
    this.#mainWrapComponent.setCurrentActiveButton(this._element);
    this._element.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.statsButtonClick(evt);
  }

}
