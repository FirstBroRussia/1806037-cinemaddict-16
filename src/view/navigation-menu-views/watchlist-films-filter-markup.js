import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {FilterMode} from '/src/utils/util.js';

const createWatchlistFilmsFilterTemplate = () => `
<a href="#watchlist" class="main-navigation__item">Watchlist </span></a>
`;

class WatchlistFilmsFilterMarkup extends AbstractView {
  #mainWrapComponent = null;

  constructor (mainWrapComponent) {
    super();

    this.#mainWrapComponent = mainWrapComponent;
    this._template = createWatchlistFilmsFilterTemplate;
    this._element = createNodeElement(this._template());
  }

  setWatchlistFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.watchlistFilterClick = callback;
    this._element.addEventListener(event, this.#hangAWatchlistHandler);
  }

  #hangAWatchlistHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    this.#mainWrapComponent.setCurrentActiveButton(this._element);
    this._element.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.watchlistFilterClick(FilterMode.WATCHLIST);
  }
}

export {WatchlistFilmsFilterMarkup};
