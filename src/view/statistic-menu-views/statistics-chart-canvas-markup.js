import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {Chart, ChartDataLabels} from '/src/utils/util.js';
import {createNodeElement} from '/src/utils/render-html-element.js';

const createStatisticsChartCanvasTemplate = () => `
<div class="statistic__chart-wrap">
  <canvas class="statistic__chart" width="1000"></canvas>
</div>
`;

class StatisticsChartCanvasMarkup extends AbstractView {
  #genresListByFilmsCountMap = null;

  constructor (genresListByFilmsCountMap) {
    super();

    this.#genresListByFilmsCountMap = genresListByFilmsCountMap;

    this._template = createStatisticsChartCanvasTemplate;
    this._element = createNodeElement(this._template());

    this.#initMyChart();
  }

  #initMyChart = () => {
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

export {StatisticsChartCanvasMarkup};
