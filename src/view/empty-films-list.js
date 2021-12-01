import {createNodeElement} from '/src/utils/render-html-element.js';

const createEmptyFilmsListTemplate = () => `
<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>

      <!--
        Значение отображаемого текста зависит от выбранного фильтра:
          * All movies – 'There are no movies in our database'
          * Watchlist — 'There are no movies to watch now';
          * History — 'There are no watched movies now';
          * Favorites — 'There are no favorite movies now'.
      -->
    </section>
  </section>
`;

class EmptyFilmsListMarkup {
  #template = 'null';
  #element = 'null';

  constructor () {
    this.#template = createEmptyFilmsListTemplate;
    this.#element = createNodeElement(this.#template());
  }

  get getElement() {
    return this.#element;
  }

  removeElement() {
    this.#element = 'null';
  }
}

export {EmptyFilmsListMarkup};
