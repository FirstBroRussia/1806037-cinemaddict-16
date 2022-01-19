import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createWatchedFilmsCountTemplate = (filmsData) => `
<span class="main-navigation__item-count">${filmsData.filter(({isWatched}) => isWatched).length}
`;

export default class WatchedFilmsCountMarkup extends AbstractView {
  constructor (filmsData) {
    super();

    this._template = createWatchedFilmsCountTemplate;
    this._element = createNodeElement(this._template(filmsData));
  }
}
