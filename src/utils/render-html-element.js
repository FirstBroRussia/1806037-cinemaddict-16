import {AbstractClass} from '/src/abstract-class/abstract-class.js';

const positionMarkup = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const createNodeElement = (element) => {
  const newCreateElement = document.createElement('div');
  newCreateElement.insertAdjacentHTML('afterbegin', element);
  const newElement = newCreateElement.firstElementChild;
  newCreateElement.remove();

  return newElement;
};

const getNodeElement = (nodeElement) => nodeElement instanceof AbstractClass ? nodeElement.getElement : nodeElement;

const renderMarkupHtmlElement = (container, position, element) => {
  switch (position) {
    case 'beforebegin': return getNodeElement(container).before(getNodeElement(element));
    case 'afterbegin': return getNodeElement(container).prepend(getNodeElement(element));
    case 'beforeend': return getNodeElement(container).append(getNodeElement(element));
    case 'afterend': return getNodeElement(container).after(getNodeElement(element));
    default : throw new Error('Передайте валидное значение!');
  }
};

const replaceNodeElement = (parentNodeElement, newChildElement, oldChildElement) => {
  getNodeElement(parentNodeElement).replaceChild(getNodeElement(newChildElement), getNodeElement(oldChildElement));
};

export {positionMarkup, createNodeElement, renderMarkupHtmlElement, replaceNodeElement};
