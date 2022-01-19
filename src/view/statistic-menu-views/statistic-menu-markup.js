import AbstractView from '/src/abstract-class/abstract-view.js';

import {createNodeElement} from '/src/utils/render-html-element.js';

const createStatisticMenuTemplate = () =>`
<section class="statistic">

</section>
`;

export default class StatisticMenuMarkup extends AbstractView {
  constructor () {
    super();

    this._template = createStatisticMenuTemplate;
    this._element = createNodeElement(this._template());
  }
}
