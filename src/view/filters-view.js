import AbstractView from '../framework/view/abstract-view.js';

const createFiltersItemTemplate = (filter, currentFilterType) => `
  <div class="trip-filters__filter">
    <input id="filter-${filter.type}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="${filter.type}"
    data-trip-points-amount="${filter.count}"
    ${filter.type === currentFilterType ? 'checked' : ''}
    ${filter.count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">
    ${filter.type}
    </label>
  </div>
`;

const createFiltersTemplate = (filters, currentFilterType) => {
  const filtersItemsTemplate = filters
    .map((filter) => createFiltersItemTemplate(filter, currentFilterType))
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
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
