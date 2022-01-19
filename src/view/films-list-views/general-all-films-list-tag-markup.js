import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createGeneralAllFilmsListTagTemplate = () => `
<h2 class="films-list__title">All movies</h2>
`;

export default class GeneralAllFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralAllFilmsListTagTemplate;
    this._element = createNodeElement(this._template());
  }
}
