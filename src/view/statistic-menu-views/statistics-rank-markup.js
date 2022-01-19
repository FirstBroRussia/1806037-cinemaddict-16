import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {FilmsWatchedValue} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';

const createStatisticsRankTemplate = (data) => {
  let markup;
  if (data.length >= FilmsWatchedValue.MIN_NOVICE_VALUE && data.length <= FilmsWatchedValue.MAX_NOVICE_VALUE) {
    markup = 'Novice';
  } else if (data.length >= FilmsWatchedValue.MIN_FAN_VALUE && data.length <= FilmsWatchedValue.MAX_FAN_VALUE) {
    markup = 'Fan';
  } else if (data.length >= FilmsWatchedValue.MOVIE_BUFF_VALUE) {
    markup = 'Movie Buff';
  }

  return `
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${markup}</span>
  </p>
  `;
};

class StatisticsRankMarkup extends AbstractView {
  constructor (data) {
    super();

    this._template = createStatisticsRankTemplate;
    this._element = createNodeElement(this._template(data));
  }
}

export {StatisticsRankMarkup};
