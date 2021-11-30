const positionMarkup = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend',
};

const renderMarkupHtmlElement = (container, position, element) => {
  const createElement = document.createElement('div');
  createElement.insertAdjacentHTML('afterbegin', element);
  const newElement = createElement.firstElementChild;
  createElement.remove();

  switch (position) {
    case 'beforebegin': return container.before(newElement);
    case 'afterbegin': return container.prepend(newElement);
    case 'beforeend': return container.append(newElement);
    case 'afterend': return container.after(newElement);
  }
};

export {positionMarkup, renderMarkupHtmlElement};
