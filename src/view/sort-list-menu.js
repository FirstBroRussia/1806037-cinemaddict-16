import {createNodeElement} from '/src/utils/render-html-element.js';

const createSortListMenuTemplate = () => `
<ul class="sort">
<li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
<li><a href="#" class="sort__button">Sort by date</a></li>
<li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>
`;

class SortListMarkup {
  #template = null;
  #element = null;

  constructor () {
    this.#template = createSortListMenuTemplate;
    this.#element = createNodeElement(this.#template());
  }

  get getElement() {
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export {SortListMarkup};
