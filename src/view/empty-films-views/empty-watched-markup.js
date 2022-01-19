import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createEmptyWatchedListTemplate = () => `
<h2 class="films-list__title">There are no watched movies now</h2>
`;

class EmptyWatchedMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createEmptyWatchedListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {EmptyWatchedMarkup};
