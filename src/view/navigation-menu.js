import {createNodeElement} from '/src/utils/render-html-element.js';

const createNavigationMenuTemplate = (filmsData) => `
<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filmsData.filter(({isWatchlist}) => isWatchlist).length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filmsData.filter(({isWatched}) => isWatched).length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filmsData.filter(({isFavorite}) => isFavorite).length}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>
`;

class NavigationMenuMarkup {
  #template = 'null';
  #element = 'null';

  constructor (filmData) {
    this.#template = createNavigationMenuTemplate;
    this.#element = createNodeElement(this.#template(filmData));
  }

  get getElement() {
    return this.#element;
  }

  removeElement() {
    this.#element = 'null';
  }
}

export {NavigationMenuMarkup};
