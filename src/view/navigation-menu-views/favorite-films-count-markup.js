import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createFavoriteFilmsCountTemplate = (filmsData) => `
<span class="main-navigation__item-count">${filmsData.filter(({isFavorite}) => isFavorite).length}
`;

class FavoriteFilmsCountMarkup extends AbstractView {
  constructor (filmsData) {
    super();

    this._template = createFavoriteFilmsCountTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}

export {FavoriteFilmsCountMarkup};
