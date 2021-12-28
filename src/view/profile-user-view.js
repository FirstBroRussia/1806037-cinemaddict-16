import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-class.js';

const createTitleProfileUserTemplate = () => `
<section class="header__profile profile">
<p class="profile__rating">Movie Buff</p>
<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>
`;

class ProfileUserMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createTitleProfileUserTemplate;
    this._element = createNodeElement(this._template());
  }
}

export {ProfileUserMarkup};
