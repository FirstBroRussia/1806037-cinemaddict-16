import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const filmDetailsCommentsCountTemplate = (commentsData) => `
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>
`;

export default class FilmDetailsCommentsCountMarkup extends AbstractView {
  constructor(commentsData) {
    super();

    this._template = filmDetailsCommentsCountTemplate;
    this._element = createNodeElement(this._template(commentsData));
  }
}

