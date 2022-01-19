import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createGeneralFavoriteListTemplate = () => `
<h2 class="films-list__title ">Favorite list movies</h2>
`;

class GeneralFavoriteFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralFavoriteListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {GeneralFavoriteFilmsListTagMarkup};
