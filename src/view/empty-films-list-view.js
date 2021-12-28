import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createEmptyAllFilmsListTemplate = () => `
<h2 class="films-list__title">There are no movies in our database</h2>
`;

const createEmptyWatchlistTemplate = () => `
<h2 class="films-list__title">There are no movies to watch now</h2>
`;

const createEmptyWatchedListTemplate = () => `
<h2 class="films-list__title">There are no watched movies now</h2>
`;

const createEmptyFavoriteListTemplate = () => `
<h2 class="films-list__title">There are no favorite movies now</h2>
`;

class EmptyFavoriteMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createEmptyFavoriteListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class EmptyWatchedMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createEmptyWatchedListTemplate;
    this._element = createNodeElement(this._template());
  }
}

class EmptyWatchlistMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createEmptyWatchlistTemplate;
    this._element = createNodeElement(this._template());
  }
}

class EmptyAllFilmsListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createEmptyAllFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {EmptyAllFilmsListMarkup, EmptyWatchlistMarkup, EmptyWatchedMarkup, EmptyFavoriteMarkup};
