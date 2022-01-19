import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createGeneralWatchlistTagTemplate = () => `
<h2 class="films-list__title">List of movies to watch</h2>
`;

class GeneralWatchlistFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralWatchlistTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {GeneralWatchlistFilmsListTagMarkup};
