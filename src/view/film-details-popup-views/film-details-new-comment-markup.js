import {twoKeysPressFunction} from '/src/helpers/two-keys-handlers.js';
import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';
import {PositionMarkup, renderNodeElement} from '/src/utils/render-html-element.js';
import {setNewCommentElementValid} from '/src/helpers/new-comment-submit-validation.js';

const createFolmDetailsNewCommentMarkup = () => `
<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>

      </div>
`;

export default class FilmDetailsNewCommentMarkup extends AbstractView {
  #newComment = null;

  #currentCheckedButton = null;
  #newCommentTextInputElement = null;
  #bigEmojiElement = null;

  constructor(callback) {
    super();

    this._callback.submitNewComment = callback;
    this._template = createFolmDetailsNewCommentMarkup();
    this._element = createNodeElement(this._template);

    this.#bigEmojiElement = this._element.querySelector('.film-details__add-emoji-label');
    this.#newCommentTextInputElement = this._element.querySelector('.film-details__comment-input');

    this.addHandlers();
  }

  addHandlers = () => {
    this._element.querySelector('.film-details__emoji-list').addEventListener('click', this.#smileButtonClickHandler);
    twoKeysPressFunction(this.#submitNewComment);
  }

  #smileButtonClickHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('label')) {
      return;
    }
    if (this.#currentCheckedButton !== null) {
      this.#currentCheckedButton.checked = false;
    }
    const inputElement = evt.target.closest('label').control;
    inputElement.checked = true;
    this.#currentCheckedButton = inputElement;

    const currentEmojiLabel = evt.target.closest('img');

    const newImgElement = document.createElement('img');
    newImgElement.setAttribute('src', currentEmojiLabel.getAttribute('src'));
    newImgElement.classList.add('limitation-border');

    this.#bigEmojiElement.textContent = '';
    renderNodeElement(this.#bigEmojiElement, PositionMarkup.BEFORE_END, newImgElement);
  }

  #validationCheck = (newCommentInputElement, currentCheckedEmotionButton) => {
    setNewCommentElementValid(newCommentInputElement, currentCheckedEmotionButton);
    if (!newCommentInputElement.validity.valid) {
      return false;
    }
    return true;
  }


  #submitNewComment = () => {
    if (!this.#validationCheck(this.#newCommentTextInputElement, this.#currentCheckedButton)) {
      return;
    }

    const emotion = this.#currentCheckedButton.value;
    const comment = this.#newCommentTextInputElement.value;
    this.#newComment = {emotion: emotion, comment: comment};

    this._callback.submitNewComment(this.#newComment);
  }

}
