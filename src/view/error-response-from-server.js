import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createErrorResponseForMainElementMarkupTemplate = () => `
<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">Error in receiving data from the server</h2>

  </section>
</section>
`;

const createErrorResponseForCommentsListMarkupTemplate = () => `
<ul class="film-details__comments-list">
<h2 class="error-respons">Error in receiving data from the server</h2>
</ul>
`;

class ErrorResponseForMainElementMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createErrorResponseForMainElementMarkupTemplate;
    this._element = createNodeElement(this._template());
  }

}

class ErrorResponseForCommentsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createErrorResponseForCommentsListMarkupTemplate;
    this._element = createNodeElement(this._template());
  }

}

export {ErrorResponseForMainElementMarkup, ErrorResponseForCommentsListMarkup};
