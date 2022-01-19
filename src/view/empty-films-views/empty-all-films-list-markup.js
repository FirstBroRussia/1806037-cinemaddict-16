import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createEmptyAllFilmsListTemplate = () => `
<h2 class="films-list__title">There are no movies in our database</h2>
`;

export default class EmptyAllFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createEmptyAllFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}
