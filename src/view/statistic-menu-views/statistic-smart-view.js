import {dayjs, ZERO_VALUE} from '/src/utils/util.js';
import {PositionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';

import AbstractView from '/src/abstract-class/abstract-view.js';
import StatisticMenuMarkup from '/src/view/statistic-menu-views/statistic-menu-markup.js';
import StatisticsRankMarkup from '/src/view/statistic-menu-views/statistics-rank-markup.js';
import StatisticsPeriodTimeFiltersButtonMarkup from '/src/view/statistic-menu-views/statistics-period-time-filters-button-markup.js';
import StatisticsInfoMarkup from '/src/view/statistic-menu-views/statistics-info-markup.js';
import StatisticsChartCanvasMarkup from '/src/view/statistic-menu-views/statistics-chart-canvas-markup.js';

export default class StatisticSmartView extends AbstractView {
  #data = null;

  #StatisticMenuComponent = null;
  #StatisticsRankMarkupComponent = null;
  #StatisticsPeriodTimeFiltersButtonMarkupComponent = null;
  #StatisticsInfoMarkupComponent = null;
  #StatisticsChartCanvasMarkupComponent = null;

  constructor (data) {
    super();

    this.#data = data.slice().filter( (film) => film.isWatched);
    const filmsByGenresMap = this.#setGenresListByFilmsCountMap(this.#data);

    this.#StatisticMenuComponent = new StatisticMenuMarkup();
    if (this.#data.length !== ZERO_VALUE) {
      this.#StatisticsRankMarkupComponent = new StatisticsRankMarkup(this.#data);
      renderNodeElement(this.#StatisticMenuComponent, PositionMarkup.BEFORE_END, this.#StatisticsRankMarkupComponent);
    }
    this.#StatisticsPeriodTimeFiltersButtonMarkupComponent = new StatisticsPeriodTimeFiltersButtonMarkup(this._getValueOnClickedFilterButtons);
    this.#StatisticsInfoMarkupComponent = new StatisticsInfoMarkup(this.#data, filmsByGenresMap);
    this.#StatisticsChartCanvasMarkupComponent = new StatisticsChartCanvasMarkup(filmsByGenresMap);

    renderNodeElement(this.#StatisticMenuComponent, PositionMarkup.BEFORE_END, this.#StatisticsPeriodTimeFiltersButtonMarkupComponent);
    renderNodeElement(this.#StatisticMenuComponent, PositionMarkup.BEFORE_END, this.#StatisticsInfoMarkupComponent);
    renderNodeElement(this.#StatisticMenuComponent, PositionMarkup.BEFORE_END, this.#StatisticsChartCanvasMarkupComponent);

  }

  get element () {
    return this.#StatisticMenuComponent.element;
  }

  #setGenresListByFilmsCountMap = (films) => {
    let filmsByGenresMap = new Map();

    films.forEach( (film) => {
      film.genre.forEach( (genre) => {
        filmsByGenresMap.set(genre, 0);
      });
    });

    films.forEach( (film) => {
      film.genre.forEach( (genre) => {
        for (const item of filmsByGenresMap) {
          const itemKey = item[0];
          let itemValue;
          if (itemKey === genre) {
            itemValue = Number(item[1]) + 1;
            filmsByGenresMap.set(itemKey, itemValue);
          }
        }
      });
    });

    const arrayMap = Array.from(filmsByGenresMap)
      .sort( (itemA, itemB) => itemB[1] - itemA[1]);

    filmsByGenresMap = new Map(arrayMap);

    return filmsByGenresMap;
  }

  #updateView = (data, checkedButton) => {
    const filmsByGenresMap = this.#setGenresListByFilmsCountMap(data);

    const prevStatisticsPeriodTimeFiltersButtonMarkupComponent = this.#StatisticsPeriodTimeFiltersButtonMarkupComponent;
    const prevStatisticsInfoMarkupComponent = this.#StatisticsInfoMarkupComponent;
    const prevStatisticsChartCanvasMarkupComponent = this.#StatisticsChartCanvasMarkupComponent;

    this.#StatisticsPeriodTimeFiltersButtonMarkupComponent = new StatisticsPeriodTimeFiltersButtonMarkup(this._getValueOnClickedFilterButtons, checkedButton);
    this.#StatisticsInfoMarkupComponent = new StatisticsInfoMarkup(data, filmsByGenresMap);
    this.#StatisticsChartCanvasMarkupComponent = new StatisticsChartCanvasMarkup(filmsByGenresMap);

    replaceNodeElementWithoutParent(this.#StatisticsPeriodTimeFiltersButtonMarkupComponent, prevStatisticsPeriodTimeFiltersButtonMarkupComponent);
    replaceNodeElementWithoutParent(this.#StatisticsInfoMarkupComponent, prevStatisticsInfoMarkupComponent);
    replaceNodeElementWithoutParent(this.#StatisticsChartCanvasMarkupComponent, prevStatisticsChartCanvasMarkupComponent);
  }

  #periodTimeSwitch = (value) => {
    const currentTime = dayjs(dayjs().format());
    let convertedData;
    let diffBetweenDate;
    let convertedTime;

    switch (value) {
      case 'all-time' : return this.#data;
      case 'today' : {
        diffBetweenDate = 0;
        convertedData = this.#data.slice().filter( (item) => {
          convertedTime = dayjs(item.watchingDate).format();
          if (currentTime.diff(convertedTime, 'day') !== diffBetweenDate) {
            return false;
          }
          return true;
        });
        return convertedData;
      }
      case 'week' : {
        diffBetweenDate = 7;
        convertedData = this.#data.slice().filter( (item) => {
          convertedTime = dayjs(item.watchingDate).format();
          if (Number(currentTime.diff(convertedTime, 'day')) > diffBetweenDate) {
            return false;
          }
          return true;
        });
        return convertedData;
      }
      case 'month' : {
        diffBetweenDate = 30;
        convertedData = this.#data.slice().filter( (item) => {
          convertedTime = dayjs(item.watchingDate).format();
          if (Number(currentTime.diff(convertedTime, 'day')) > diffBetweenDate) {
            return false;
          }
          return true;
        });
        return convertedData;
      }
      case 'year' : {
        diffBetweenDate = 365;
        convertedData = this.#data.slice().filter( (item) => {
          convertedTime = dayjs(item.watchingDate).format();
          if (Number(currentTime.diff(convertedTime, 'day')) > diffBetweenDate) {
            return false;
          }
          return true;
        });
        return convertedData;
      }
    }
  }

  _getValueOnClickedFilterButtons = (value) => {
    const convertedData = this.#periodTimeSwitch(value);
    this.#updateView(convertedData, value);
  }

}
