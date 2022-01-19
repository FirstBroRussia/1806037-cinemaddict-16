import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createTopRatedFilmsListTemplate = () => `
<div class="films-list__container top-rated">


</div>
`;

export default class TopRatedFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createTopRatedFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}
