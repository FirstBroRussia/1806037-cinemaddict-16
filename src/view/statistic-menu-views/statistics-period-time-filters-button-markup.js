import {AbstractView} from '/src/abstract-class/abstract-view.js';
import {createNodeElement} from '/src/utils/render-html-element.js';

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

export {StatisticsPeriodTimeFiltersButtonMarkup};
