import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createLoadingFilmsListTemplate = () => `
<section class="films">
<section class="films-list">
  <h2 class="films-list__title">Loading...</h2>
</section>
</section>
`;

class LoadingFilmsListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createLoadingFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {LoadingFilmsListMarkup};
