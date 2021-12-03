class AbstractClass {
  _callback = {};

  constructor () {
    if (new.target === AbstractClass) {
      throw new Error('Нельзя создать экземпляр от данного Абстрактного класса, вы можете только создать потомков от него!');
    }
  }

  get getTemplate() {
    return this._template();
  }

  get getElement() {
    return this._element;
  }

  addHangEventHandler(event, callback) {
    if (typeof event !== 'string') {
      throw new Error('Параметр "event" должен быть типом данных "string"');
    }
    this._callback.respectiveHandler = callback;
    this._element.addEventListener(event, this.#hangFunctionHandler);
  }

  removeHangEventHandler(event, callback) {
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

  removeElement() {
    this._element = null;
  }
}

export {AbstractClass};
