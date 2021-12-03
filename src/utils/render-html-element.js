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

const renderMarkupHtmlElement = (container, position, element) => {
  const parent = container instanceof AbstractClass ? container.getElement : container;
  const child = element instanceof AbstractClass ? element.getElement : element;
  switch (position) {
    case 'beforebegin': return parent.before(child);
    case 'afterbegin': return parent.prepend(child);
    case 'beforeend': return parent.append(child);
    case 'afterend': return parent.after(child);
    default : throw new Error('Передайте валидное значение!');
  }
};

const replaceNodeElement = (parentNodeElement, newChildElement, oldChildElement) => {
  parentNodeElement = parentNodeElement instanceof AbstractClass ? parentNodeElement.getElement : parentNodeElement;
  newChildElement = newChildElement instanceof AbstractClass ? newChildElement.getElement : newChildElement;
  oldChildElement = oldChildElement instanceof AbstractClass ? oldChildElement.getElement : oldChildElement;
  parentNodeElement.replaceChild(newChildElement, oldChildElement);
};

export {positionMarkup, createNodeElement, renderMarkupHtmlElement, replaceNodeElement};
