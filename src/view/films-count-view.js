import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-class.js';

const createFilmsCountTemplate = (value) => `
<p>${value} movies inside</p>
`;

class FilmsCountMarkup extends AbstractView {
  constructor (value) {
    super();

    this._template = createFilmsCountTemplate;
    this._element = createNodeElement(this._template(value));
  }
}

export {FilmsCountMarkup};
