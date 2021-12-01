import {createNodeElement} from '/src/utils/render-html-element.js';

const createLoadingFilmsListTemplate = () => `
<section class="films">
<section class="films-list">
  <h2 class="films-list__title">Loading...</h2>
</section>
</section>
`;

class LoadingFilmsListMarkup {
  #template = 'null';
  #element = 'null';

  constructor () {
    this.#template = createLoadingFilmsListTemplate;
    this.#element = createNodeElement(this.#template());
  }

  get getElement() {
    return this.#element;
  }

  removeElement() {
    this.#element = 'null';
  }
}

export {LoadingFilmsListMarkup};
