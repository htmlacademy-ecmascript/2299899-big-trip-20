import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypeMessages } from '../const.js';

const createNoPointsTemplate = (activeFilter) => {
  const noPointMessage = FilterTypeMessages[activeFilter];
  return `
  <p class="trip-events__msg">${noPointMessage}</p>
`;
};

export default class NoPointsView extends AbstractView {
  #activeFilter = null;

  get template() {
    return createNoPointsTemplate(this.#activeFilter);
  }

  get activeFilter() {
    return this.#activeFilter;
  }

  set activeFilter(filter) {
    this.#activeFilter = filter;
  }
}
