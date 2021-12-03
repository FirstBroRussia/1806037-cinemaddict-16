import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

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

class EmptyFilmsListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createEmptyFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {EmptyFilmsListMarkup};
