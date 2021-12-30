import {createNodeElement} from '/src/utils/render-html-element.js';

class AbstractView {
  _callback = {};

  constructor () {
    if (new.target === AbstractView) {
      throw new Error('Нельзя создать экземпляр от данного Абстрактного класса, вы можете только создать потомков от него!');
    }
  }

  get template() {
    return this._template();
  }

  get element() {
    if (this._element === null) {
      this._element = createNodeElement(this.getTemplate);
    }

    return this._element;
  }

  addEventHandler(event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.respectiveHandler = callback;
    this._element.addEventListener(event, this.#hangFunctionHandler);
  }

  removeEventHandler(event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    if (callback === this._callback.respectiveHandler) {
      this._element.removeEventListener(event, this.#hangFunctionHandler);
    } else {
      throw new Error('Передайте правильный callback для удаления обработчика события!');
    }
  }

  #hangFunctionHandler = (evt) => {
    evt.preventDefault();
    this._callback.respectiveHandler(evt);
  };

  remove() {
    this._element.remove();
    this._element = null;
  }
}

export {AbstractView};
