import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createErrorResponseForCommentsListMarkupTemplate = () => `
<ul class="film-details__comments-list">
<h2 class="error-respons">Error in receiving data from the server</h2>
</ul>
`;

export default class ErrorResponseForCommentsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createErrorResponseForCommentsListMarkupTemplate;
    this._element = createNodeElement(this._template());
  }

}
