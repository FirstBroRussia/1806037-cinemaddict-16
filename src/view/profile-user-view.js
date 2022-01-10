import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const ZERO_VALUE = 0;
const MIN_NOVICE_VALUE = 1;
const MAX_NOVICE_VALUE = 10;
const MIN_FAN_VALUE = 11;
const MAX_FAN_VALUE = 20;
const MOVIE_BUFF_VALUE = 21;


const createTitleProfileUserTemplate = (data) => {
  let markup;
  if (data.length === ZERO_VALUE) {
    return `<section class="header__profile profile">

    </section>`;
  } else if (data.length >= MIN_NOVICE_VALUE && data.length <= MAX_NOVICE_VALUE) {
    markup = 'Novice';
  } else if (data.length >= MIN_FAN_VALUE && data.length <= MAX_FAN_VALUE) {
    markup = 'Fan';
  } else if (data.length >= MOVIE_BUFF_VALUE) {
    markup = 'Movie Buff';
  }


  return `
  <section class="header__profile profile">
  <p class="profile__rating">${markup}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
  `;
};

class ProfileUserMarkup extends AbstractView {
  constructor (data) {
    super();

    this._template = createTitleProfileUserTemplate;
    this._element = createNodeElement(this._template(data));
  }
}

export {ProfileUserMarkup};
