import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {Chart, ChartDataLabels, dayjs, ZERO_VALUE, MIN_NOVICE_VALUE, MAX_NOVICE_VALUE, MIN_FAN_VALUE, MAX_FAN_VALUE, MOVIE_BUFF_VALUE} from '/src/utils/util.js';
import {createNodeElement, positionMarkup, renderNodeElement, replaceNodeElementWithoutParent} from '/src/utils/render-html-element.js';

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

const createStatisticMenuTemplate = () =>`
<section class="statistic">

</section>
`;

const createStatisticsRankTemplate = (data) => {
  let markup;
  if (data.length >= MIN_NOVICE_VALUE && data.length <= MAX_NOVICE_VALUE) {
    markup = 'Novice';
  } else if (data.length >= MIN_FAN_VALUE && data.length <= MAX_FAN_VALUE) {
    markup = 'Fan';
  } else if (data.length >= MOVIE_BUFF_VALUE) {
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

const createStatisticsPeriodTimeFiltersButtonTemplate = () => `
<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
  <p class="statistic__filters-description">Show stats:</p>

  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time">
  <label for="statistic-all-time" class="statistic__filters-label">All time</label>

  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
  <label for="statistic-today" class="statistic__filters-label">Today</label>

  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
  <label for="statistic-week" class="statistic__filters-label">Week</label>

  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
  <label for="statistic-month" class="statistic__filters-label">Month</label>

  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
  <label for="statistic-year" class="statistic__filters-label">Year</label>
</form>
`;

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

const createStatisticsChartCanvasTemplate = () => `
<div class="statistic__chart-wrap">
  <canvas class="statistic__chart" width="1000"></canvas>
</div>
`;

class StatisticsRankMarkup extends AbstractView {
  constructor (data) {
    super();

    this._template = createStatisticsRankTemplate;
    this._element = createNodeElement(this._template(data));
  }
}

class StatisticsPeriodTimeFiltersButtonMarkup extends AbstractView {
  #currentCheckedButton = null;

  constructor (callback, checkedButton) {
    super();

    this._callback.getCurrentClickedButton = callback;
    this._template = createStatisticsPeriodTimeFiltersButtonTemplate;
    this._element = createNodeElement(this._template());

    if (checkedButton) {
      this.#currentCheckedButton = this._element.querySelector(`input[value="${checkedButton}"]`);
      this.#currentCheckedButton.checked = true;
    } else {
      this.#currentCheckedButton = this._element.querySelector('input[value="all-time"]');
      this.#currentCheckedButton.checked = true;
    }
    this.initFilterButtonsClickHandler();
  }

  initFilterButtonsClickHandler = () => {
    this._element.addEventListener('click', this.#filterButtonsClickHandler);
  }

  #filterButtonsClickHandler = (evt) => {
    evt.preventDefault();
    const currentInputButton = evt.target.control;
    if (!currentInputButton || currentInputButton === this.#currentCheckedButton) {
      return;
    }
    this.#currentCheckedButton = currentInputButton;

    this._callback.getCurrentClickedButton(this.#currentCheckedButton.value);
  }

}

class StatisticsInfoMarkup extends AbstractView {
  constructor (filmsData, genresListByFilmsCountMap) {
    super();

    this._template = createStatisticsInfoTemplate;
    this._element = createNodeElement(this._template(filmsData, genresListByFilmsCountMap));
  }
}

class StatisticsChartCanvasMarkup extends AbstractView {
  #genresListByFilmsCountMap = null;

  constructor (genresListByFilmsCountMap) {
    super();

    this.#genresListByFilmsCountMap = genresListByFilmsCountMap;

    this._template = createStatisticsChartCanvasTemplate;
    this._element = createNodeElement(this._template());

    this.initMyChart();
  }

  initMyChart () {
    const BAR_HEIGHT = 50;

    const genresTitle = Array.from(this.#genresListByFilmsCountMap.keys());
    const filmsCountByGenresTitle = Array.from(this.#genresListByFilmsCountMap.values());

    const statisticCtx = this._element.querySelector('.statistic__chart');

    statisticCtx.height = BAR_HEIGHT * this.#genresListByFilmsCountMap.size;

    new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: [...genresTitle],
        datasets: [{
          data: [...filmsCountByGenresTitle],
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}


class StatisticMenuMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createStatisticMenuTemplate;
    this._element = createNodeElement(this._template());
  }
}


class StatisticSmartView extends AbstractView {
  #data = null;

  #StatisticMenuComponent = null;
  #StatisticsRankMarkupComponent = null;
  #StatisticsPeriodTimeFiltersButtonMarkupComponent = null;
  #StatisticsInfoMarkupComponent = null;
  #StatisticsChartCanvasMarkupComponent = null;

  get element () {
    return this.#StatisticMenuComponent.element;
  }

  constructor (data) {
    super();

    this.#data = data.slice().filter( (film) => film.isWatched);
    const filmsByGenresMap = this.#setGenresListByFilmsCountMap(this.#data);

    this.#StatisticMenuComponent = new StatisticMenuMarkup();
    if (this.#data.length !== ZERO_VALUE) {
      this.#StatisticsRankMarkupComponent = new StatisticsRankMarkup(this.#data);
      renderNodeElement(this.#StatisticMenuComponent, positionMarkup.BEFORE_END, this.#StatisticsRankMarkupComponent);
    }
    this.#StatisticsPeriodTimeFiltersButtonMarkupComponent = new StatisticsPeriodTimeFiltersButtonMarkup(this.#getValueOnClickedFilterButtons);
    this.#StatisticsInfoMarkupComponent = new StatisticsInfoMarkup(this.#data, filmsByGenresMap);
    this.#StatisticsChartCanvasMarkupComponent = new StatisticsChartCanvasMarkup(filmsByGenresMap);

    renderNodeElement(this.#StatisticMenuComponent, positionMarkup.BEFORE_END, this.#StatisticsPeriodTimeFiltersButtonMarkupComponent);
    renderNodeElement(this.#StatisticMenuComponent, positionMarkup.BEFORE_END, this.#StatisticsInfoMarkupComponent);
    renderNodeElement(this.#StatisticMenuComponent, positionMarkup.BEFORE_END, this.#StatisticsChartCanvasMarkupComponent);

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

    this.#StatisticsPeriodTimeFiltersButtonMarkupComponent = new StatisticsPeriodTimeFiltersButtonMarkup(this.#getValueOnClickedFilterButtons, checkedButton);
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

  #getValueOnClickedFilterButtons = (value) => {
    const convertedData = this.#periodTimeSwitch(value);
    this.#updateView(convertedData, value);
  }

}

export {StatisticSmartView};
