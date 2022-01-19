import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createFilmsCountTemplate = (value) => `
<p>${value} movies inside</p>
`;

export default class FilmsCountMarkup extends AbstractView {
  constructor (value) {
    super();

    this._template = createFilmsCountTemplate;
    this._element = createNodeElement(this._template(value));
  }
}
