import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createFilmsListTemplate = () => `
<section class="films-list">

     <!-- Кнопка ShowMoreButton -->
    </section>
`;

export default class FilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}
