import AbstractView from '/src/abstract-class/abstract-view.js';

const PositionMarkup = {
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

const getNodeElement = (nodeElement) => nodeElement instanceof AbstractView ? nodeElement.element : nodeElement;

const renderNodeElement = (container, position, element) => {
  switch (position) {
    case 'beforebegin': return getNodeElement(container).before(getNodeElement(element));
    case 'afterbegin': return getNodeElement(container).prepend(getNodeElement(element));
    case 'beforeend': return getNodeElement(container).append(getNodeElement(element));
    case 'afterend': return getNodeElement(container).after(getNodeElement(element));
    default : throw new Error('Передайте валидное значение!');
  }
};

const replaceNodeElementWithoutParent = (newChildElement, oldChildElement) => {
  getNodeElement(oldChildElement).replaceWith(getNodeElement(newChildElement));
};

export {PositionMarkup, createNodeElement, renderNodeElement, replaceNodeElementWithoutParent};
