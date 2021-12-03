import {createNodeElement} from '/src/utils/render-html-element.js';

const createShowMoreButtonTemplate = () => `
<button class="films-list__show-more">Show more</button>
`;

class ShowMoreButtonMarkup {
  #template = null;
  #element = null;

  constructor () {
    this.#template = createShowMoreButtonTemplate;
    this.#element = createNodeElement(this.#template());
  }

  get getElement() {
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export {ShowMoreButtonMarkup};
