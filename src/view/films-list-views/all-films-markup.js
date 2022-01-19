import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createAllFilmsMarkupTemplate = () => `
<section class="films">

  </section>
`;

export default class AllFilmsMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createAllFilmsMarkupTemplate;
    this._element = createNodeElement(this._template());
  }
}
