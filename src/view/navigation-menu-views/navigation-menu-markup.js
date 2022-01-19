import {createNodeElement} from '/src/utils/render-html-element.js';
import {AbstractView} from '/src/abstract-class/abstract-view.js';

const createNavigationMenuTemplate = () => `
<nav class="main-navigation">

  </nav>
`;

class NavigationMenuMarkup extends AbstractView {
  _currentActiveButton = null;

  constructor () {
    super();

    this._template = createNavigationMenuTemplate;
    this._element = createNodeElement(this._template());
  }

  setCurrentActiveButton = (element) => {
    if (this._currentActiveButton === null) {
      this._currentActiveButton = element;
      return;
    }
    this._currentActiveButton.classList.remove('main-navigation__item--active');
    this._currentActiveButton = element;
  }

  hideComponent () {
    this._element.classList.add('hidden');
  }

  showComponent () {
    this._element.classList.remove('hidden');
  }

}

export {NavigationMenuMarkup};
