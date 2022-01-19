import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createGeneralWatchedListTagTemplate = () => `
<h2 class="films-list__title">History viewed movies</h2>
`;

class GeneralWatchedFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralWatchedListTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {GeneralWatchedFilmsListTagMarkup};
