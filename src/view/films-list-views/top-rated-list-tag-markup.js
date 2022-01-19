import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createTopRatedTagTemplate = () => `
<h2 class="films-list__title">Top rated</h2>
`;

export default class TopRatedListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createTopRatedTagTemplate;
    this._element = createNodeElement(this._template());
  }
}
