import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {FilterMode} from '/src/utils/util.js';

const createWatchedFilmsFilterTemplate = () => `
<a href="#history" class="main-navigation__item">History </span></a>
`;

class HistoryFilterMarkup extends AbstractView {
  #mainWrapComponent = null;

  constructor (mainWrapComponent) {
    super();

    this.#mainWrapComponent = mainWrapComponent;
    this._template = createWatchedFilmsFilterTemplate;
    this._element = createNodeElement(this._template());
  }

  setHistoryFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.historyFilterClick = callback;
    this._element.addEventListener(event, this.#hangHistoryHandler);
  }

  #hangHistoryHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    this.#mainWrapComponent.setCurrentActiveButton(this._element);
    this._element.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.historyFilterClick(FilterMode.HISTORY);
  }
}

export {HistoryFilterMarkup};
