import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createShowMoreButtonTemplate = () => `
<button class="films-list__show-more">Show more</button>
`;


class ShowMoreButtonMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createShowMoreButtonTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {ShowMoreButtonMarkup};
