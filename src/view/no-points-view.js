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

  constructor({ filterType }) {
    super();
    this.#activeFilter = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#activeFilter.toUpperCase());
  }
}
