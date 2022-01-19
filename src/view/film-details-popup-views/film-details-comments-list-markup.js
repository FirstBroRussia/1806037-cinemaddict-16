import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createFilmDetailsCommentsListMarkupTemplate = () => `
  <ul class="film-details__comments-list">

  </ul>
`;

export default class FilmDetailsCommentsListMarkup extends AbstractView {
  constructor() {
    super();

    this._template = createFilmDetailsCommentsListMarkupTemplate;
    this._element = createNodeElement(this._template());
  }

  disabledCommentsListElement () {
    this._element.classList.add('element--disabled');
  }

  enabledCommentsListElement () {
    this._element.classList.remove('element--disabled');
  }
}
