import AbstractView from '../framework/view/abstract-view.js';

const createSortItem = (sortType, isChecked) => `
  <div class="trip-sort__item  trip-sort__item--${sortType}">
    <input
      id="sort-${sortType}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${sortType}"
      ${isChecked ? 'checked' : ''}
      ${sortType === 'event' || sortType === 'offers' ? 'disabled' : ''}
    >
    <label
      class="trip-sort__btn"
      for="sort-${sortType}"
      data-sort-type="${sortType}"
    >
      ${sortType.charAt(0).toUpperCase()}${sortType.slice(1)}
    </label>
  </div>
`;

const createSortTemplate = (sortTypes, currentSorter) => {
  const sortItemsTemplate = Object.values(sortTypes)
    .map((sortType) => createSortItem(sortType, sortType === currentSorter))
    .join('');
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>
  `;
};

export default class SortingView extends AbstractView {
  #sortTypes = null;
  #handleSortTypeChange = null;
  #currentSorter = 'day';

  constructor({ sortTypes, onSortTypeChange, currentSorter }) {
    super();
    this.#sortTypes = sortTypes;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSorter = currentSorter;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortTypes, this.#currentSorter);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
