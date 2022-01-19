import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {FilterMode} from '/src/utils/util.js';

const createFavoriteFilmsFilterTemplate = () => `
<a href="#favorites" class="main-navigation__item">Favorites </span></a>
`;

class FavoriteFilmsFilterMarkup extends AbstractView {
  #mainWrapComponent = null;

  constructor (mainWrapComponent) {
    super();

    this.#mainWrapComponent = mainWrapComponent;
    this._template = createFavoriteFilmsFilterTemplate;
    this._element = createNodeElement(this._template());
  }

  setFavoritesFilterClickHandler (event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.favoriteFilterClick = callback;
    this._element.addEventListener(event, this.#hangFavoritesHandler);
  }

  #hangFavoritesHandler = (evt) => {
    if (evt.target.closest('.main-navigation__item--active')) {
      return;
    }
    this.#mainWrapComponent.setCurrentActiveButton(this._element);
    this._element.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.favoriteFilterClick(FilterMode.FAVORITE);
  }
}

export {FavoriteFilmsFilterMarkup};
