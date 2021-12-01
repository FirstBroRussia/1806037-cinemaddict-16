import {createNodeElement} from '/src/utils/render-html-element.js';

const createTitleProfileUserTemplate = () => `
<section class="header__profile profile">
<p class="profile__rating">Movie Buff</p>
<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>
`;

class ProfileUserMarkup {
  #template = 'null';
  #element = 'null';

  constructor () {
    this.#template = createTitleProfileUserTemplate;
    this.#element = createNodeElement(this.#template());
  }

  get getElement() {
    return this.#element;
  }

  removeElement() {
    this.#element = 'null';
  }
}

export {ProfileUserMarkup};
