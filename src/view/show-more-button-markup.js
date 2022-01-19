import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createShowMoreButtonTemplate = () => `
<button class="films-list__show-more">Show more</button>
`;


class ShowMoreButtonMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createShowMoreButtonTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {ShowMoreButtonMarkup};
