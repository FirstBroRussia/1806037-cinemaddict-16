import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createEmptyWatchlistTemplate = () => `
<h2 class="films-list__title">There are no movies to watch now</h2>
`;

export default class EmptyWatchlistMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createEmptyWatchlistTemplate;
    this._element = createNodeElement(this._template());
  }
}
