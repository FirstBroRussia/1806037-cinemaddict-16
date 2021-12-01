import {createNodeElement} from '/src/utils/render-html-element.js';

const createFilmsCountTemplate = (value) => `
<p>${value} movies inside</p>
`;

class FilmsCountMarkup {
  #template = 'null';
  #element = 'null';

  constructor (value) {
    this.#template = createFilmsCountTemplate;
    this.#element = createNodeElement(this.#template(value));
  }

  get getElement() {
    return this.#element;
  }

  removeElement() {
    this.#element = 'null';
  }
}

export {FilmsCountMarkup};
