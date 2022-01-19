import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {ZERO_VALUE} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';

const HOUR_IN_MINUTES = 60;

const createDurationCountMarkup = (duration) => {
  if (duration < HOUR_IN_MINUTES) {
    return `${duration} <span class="statistic__item-description">m`;
  }
  if (duration % HOUR_IN_MINUTES === 0) {
    return `${duration / HOUR_IN_MINUTES} <span class="statistic__item-description">h`;
  }
  return `${Math.trunc(duration / HOUR_IN_MINUTES)} <span class="statistic__item-description">h</span> ${duration % 60} <span class="statistic__item-description">m`;
};

const createStatisticsInfoTemplate = (filmsData, genresListByFilmsCountMap) => {
  let generalDuration = 0;

  filmsData.forEach( (film) => {
    generalDuration += Number(film.duration);
  });

  return `
<ul class="statistic__text-list">
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">You watched</h4>
    <p class="statistic__item-text">${filmsData.length} <span class="statistic__item-description">${filmsData.length === 1 ? 'movie' : 'movies'}</span></p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Total duration</h4>
    <p class="statistic__item-text">${createDurationCountMarkup(generalDuration)}</p>
  </li>
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Top genre</h4>
    <p class="statistic__item-text">${genresListByFilmsCountMap.size === ZERO_VALUE ? 'not' : `${Array.from(genresListByFilmsCountMap)[0][0]}`}</p>
  </li>
</ul>
`;
};

class StatisticsInfoMarkup extends AbstractView {
  constructor (filmsData, genresListByFilmsCountMap) {
    super();

    this._template = createStatisticsInfoTemplate;
    this._element = createNodeElement(this._template(filmsData, genresListByFilmsCountMap));
  }
}

export {StatisticsInfoMarkup};
