import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createGeneralFilmsListContainerTemplate = () => `
<div class="films-list__container">


</div>
`;

class GeneralFilmsListContainerMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createGeneralFilmsListContainerTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {GeneralFilmsListContainerMarkup};
