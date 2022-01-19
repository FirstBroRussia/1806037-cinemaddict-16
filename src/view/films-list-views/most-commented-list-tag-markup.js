import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createMostCommentedTagTemplate = () => `
<h2 class="films-list__title">Most commented</h2>
`;

class MostCommentedListTagMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createMostCommentedTagTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {MostCommentedListTagMarkup};
