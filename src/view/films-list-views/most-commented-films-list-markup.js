import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createMostCommentedFilmsListTemplate = () => `
<div class="films-list__container most-commented">


</div>
`;

class MostCommentedFilmsListMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createMostCommentedFilmsListTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {MostCommentedFilmsListMarkup};
