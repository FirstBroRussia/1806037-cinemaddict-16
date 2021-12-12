import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createFilmsListTemplate = () => `
<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">


      </div>
     <!-- Кнопка ShowMoreButton -->
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container top-rated">


      </div>
      </section>

      <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container most-commented">


      </div>
    </section>
  </section>
`;

class FilmsListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {FilmsListMarkup};
