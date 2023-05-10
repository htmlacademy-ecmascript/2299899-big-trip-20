import AbstractView from '../framework/view/abstract-view.js';

const createFiltersItemTemplate = (filter, isChecked) => `
  <div class="trip-filters__filter">
    <input id="filter-${filter.type}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="everything"
    data-trip-points-amount="${filter.count}"
    ${isChecked ? 'checked' : ''}
    ${filter.count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">
    ${filter.type}
    </label>
  </div>
`;

const createFiltersTemplate = (filters) => {
  const filtersItemsTemplate = filters
    .map((filter, index) => createFiltersItemTemplate(filter, index === 0))
    .join('');
  return `
  <form class="trip-filters" action="#" method="get">
    ${filtersItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;
};

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
