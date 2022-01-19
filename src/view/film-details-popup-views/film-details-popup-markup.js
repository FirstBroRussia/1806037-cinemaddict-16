import {createNodeElement} from '/src/utils/render-html-element.js';
import AbstractView from '/src/abstract-class/abstract-view.js';

const createFilmDetailsPopupTemplate = () => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">


    </div>


    <div class="film-details__bottom-container">

    </div>
  </form>
</section>
`;

export default class FilmDetailsPopupMarkup extends AbstractView {
  #formElement = null;

  constructor() {
    super();

    this._template = createFilmDetailsPopupTemplate;
    this._element = createNodeElement(this._template());
    this.#formElement = this._element.querySelector('.film-details__inner');
  }

  formElementDisabled () {
    this.#formElement.classList.add('element--disabled');
  }

  formElementEnabled () {
    this.#formElement.classList.remove('element--disabled');
  }

}
