import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const createSortListMenuTemplate = () => `
<ul class="sort">
<li><a href="#default" class="sort__button sort__button--active">Sort by default</a></li>
<li><a href="#date" class="sort__button">Sort by date</a></li>
<li><a href="#rating" class="sort__button">Sort by rating</a></li>
</ul>
`;

class SortListMarkup extends AbstractClass {
  constructor () {
    super();

    this._template = createSortListMenuTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {SortListMarkup};
