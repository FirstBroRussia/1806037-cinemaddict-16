import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createLoadingFilmsListTemplate = () => `
<section class="films">
<section class="films-list">
  <h2 class="films-list__title">Loading...</h2>
</section>
</section>
`;

export default class LoadingFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createLoadingFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}
