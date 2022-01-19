import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createEmptyFavoriteListTemplate = () => `
<h2 class="films-list__title">There are no favorite movies now</h2>
`;

class EmptyFavoriteMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createEmptyFavoriteListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {EmptyFavoriteMarkup};
