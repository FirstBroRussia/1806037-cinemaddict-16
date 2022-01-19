import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createExtraFilmsListTemplate = () => `
<section class="films-list films-list--extra">

</section>
`;

export default class ExtraFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createExtraFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}
