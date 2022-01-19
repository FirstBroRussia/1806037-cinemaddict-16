import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createFiltersWrapTemplate = () => `
<div class="main-navigation__items">

</div>
`;

export default class FilterWrapMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createFiltersWrapTemplate;
    this._element = createNodeElement(this._template());
  }
}
