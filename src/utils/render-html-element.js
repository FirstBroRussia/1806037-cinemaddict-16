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
  switch (position) {
    case 'beforebegin': return container.before(element);
    case 'afterbegin': return container.prepend(element);
    case 'beforeend': return container.append(element);
    case 'afterend': return container.after(element);
  }
};

export {positionMarkup, createNodeElement, renderMarkupHtmlElement};
