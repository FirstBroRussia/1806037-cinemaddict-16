import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createWatchlistFilmsCountTemplate = (filmsData) => `
<span class="main-navigation__item-count">${filmsData.filter(({isWatchlist}) => isWatchlist).length}
`;

export default class WatchlistFilmsCountMarkup extends AbstractView {
  constructor (filmsData) {
    super();

    this._template = createWatchlistFilmsCountTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}
