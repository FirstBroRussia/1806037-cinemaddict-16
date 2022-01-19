import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createFilmsDetailsCloseButtonMarkup = () => `
<div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
`;

class FilmDetailsCloseButtonMarkup extends AbstractView {
  constructor() {
    super();

    this._template = createFilmsDetailsCloseButtonMarkup();
    this._element = createNodeElement(this._template);
  }
}

export {FilmDetailsCloseButtonMarkup};
