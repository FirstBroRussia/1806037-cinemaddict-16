import {he} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';
import dayjs from 'dayjs';


const createFilmDetailsCommentFromDataTemplate = (item) => `
<li id="${item.id}"class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-${item.emotion}">
    </span>
    <div class="film-details__comment-wrap">
      <p class="film-details__comment-text">${he.encode(item.comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${item.author}</span>
        <span class="film-details__comment-day">${dayjs(item.date).fromNow()}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
   </li>\n
`;

export default class FilmDetailsCommentFromDataMarkup extends AbstractView {
  #idComment = null;

  #deleteButtonElement = null;

  constructor(commentData, callback) {
    super();

    this.#idComment = commentData.id;
    this._callback.deleteButtonClick = callback;
    this._template = createFilmDetailsCommentFromDataTemplate;
    this._element = createNodeElement(this._template(commentData));

    this.#deleteButtonElement = this._element.querySelector('.film-details__comment-delete');
    this.addDeleteCommentButtonClickHandler();
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteButtonClick(this.#idComment, this.#updateDeleteButtonView);
  };

  addDeleteCommentButtonClickHandler() {
    this.#deleteButtonElement.addEventListener('click', this.#deleteButtonClickHandler);
  }

  #updateDeleteButtonView = (state) => {
    switch (state) {
      case 'deleting' : {
        this.#deleteButtonElement.textContent = 'Deleting...';
        break;
      }
      case 'default' : {
        this.#deleteButtonElement.textContent = 'Delete';
      }
    }
  }
}
