import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createFilmCardTemplate = (film) => `
<article id="${film.id}" class="film-card">


</article>`;

class FilmCardMarkup extends AbstractView {
  constructor (filmData, classHidden) {
    super();

    this._template = createFilmCardTemplate;
    if (classHidden) {
      this._element = createNodeElement(this._template(filmData, 'hidden'));
    } else {
      this._element = createNodeElement(this._template(filmData));
    }
  }

  addEventHandler(event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.respectiveHandler = callback;
    this._element.addEventListener(event, this.#hangFunctionHandler);
  }


  #hangFunctionHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.closest('.film-card__controls')) {
      return;
    }
    this._callback.respectiveHandler(evt);
  };
}

export {FilmCardMarkup};
