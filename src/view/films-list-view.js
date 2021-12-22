import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createAllFilmsMarkupTemplate = () => `
<section class="films">

  </section>
`;

const createFilmsListTemplate = () => `
<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">


      </div>
     <!-- Кнопка ShowMoreButton -->
    </section>
`;

const createTopRatedFilmsListTemplate = () => `
<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container top-rated">


      </div>
      </section>
`;

const createMostCommentedFilmsListTemplate = () => `
<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container most-commented">


      </div>
    </section>
`;

class MostCommentedFilmsListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createMostCommentedFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class TopRatedFilmsListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createTopRatedFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class FilmsListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class AllFilmsMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createAllFilmsMarkupTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup};
