import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-class.js';

const createAllFilmsMarkupTemplate = () => `
<section class="films">

  </section>
`;

const createFilmsListTemplate = () => `
<section class="films-list">

     <!-- Кнопка ShowMoreButton -->
    </section>
`;

const createGeneralAllFilmsListTagTemplate = () => `
<h2 class="films-list__title">All movies</h2>
`;

const createGeneralWatchlistTagTemplate = () => `
<h2 class="films-list__title">List of movies to watch</h2>
`;

const createGeneralWatchedListTagTemplate = () => `
<h2 class="films-list__title">History viewed movies</h2>
`;

const createGeneralFavoriteListTemplate = () => `
<h2 class="films-list__title ">Favorite list movies</h2>
`;

const createGeneralFilmsListContainerTemplate = () => `
<div class="films-list__container">


</div>
`;

const createMostCommentedTagTemplate = () => `
<h2 class="films-list__title">Most commented</h2>
`;

const createTopRatedTagTemplate = () => `
<h2 class="films-list__title">Top rated</h2>
`;

const createExtraFilmsListTemplate = () => `
<section class="films-list films-list--extra">

</section>
`;

const createTopRatedFilmsListTemplate = () => `
<div class="films-list__container top-rated">


</div>
`;

const createMostCommentedFilmsListTemplate = () => `
<div class="films-list__container most-commented">


</div>
`;

class MostCommentedFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createMostCommentedFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class TopRatedFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createTopRatedFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class MostCommentedListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createMostCommentedTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

class TopRatedListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createTopRatedTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

class ExtraFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createExtraFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class GeneralFilmsListContainerMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralFilmsListContainerTemplate;
    this._element = createNodeElement(this._template());
  }
}

class GeneralFavoriteFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralFavoriteListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class GeneralWatchedFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralWatchedListTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

class GeneralWatchlistFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralWatchlistTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

class GeneralAllFilmsListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralAllFilmsListTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

class FilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class AllFilmsMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createAllFilmsMarkupTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {AllFilmsMarkup, FilmsListMarkup, TopRatedFilmsListMarkup, MostCommentedFilmsListMarkup, ExtraFilmsListMarkup, TopRatedListTagMarkup, MostCommentedListTagMarkup, GeneralAllFilmsListTagMarkup, GeneralFilmsListContainerMarkup, GeneralWatchlistFilmsListTagMarkup, GeneralWatchedFilmsListTagMarkup, GeneralFavoriteFilmsListTagMarkup};
