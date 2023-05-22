import SortView from '../view/sorting-view.js';
import PointsListView from '../view/trip-point-list-view.js';
// import PointCreationView from '../view/trip-point-creation-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import NoPointsView from '../view/no-points-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortTime, sortPrice } from '../utils/sorter.js';

export default class PointsBoardPresenter {
  #container = null;
  #tripPointsModel = null;
  #tripPoints = [];
  #tripPointsPresenters = new Map();
  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #noPointsComponent = new NoPointsView();
  #currentSortType = SortType.DAY;
  #sourcedBoardTripPoints = [];

  constructor({ container, tripPointsModel }) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
  }

  init() {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    this.#sourcedBoardTripPoints = [...this.#tripPointsModel.tripPoints];
    this.#renderPointsBoard();
  }

  #renderPointsBoard() {
    const currentFilter = document.querySelector(
      'input[name="trip-filter"]:checked'
    );
    const currentFilterPointsAmount = currentFilter.dataset.tripPointsAmount;
    if (currentFilterPointsAmount !== '0') {
      this.#renderSortComponent();
      this.#renderTripPoints();
    } else {
      this.#renderNoPointsMessage(currentFilter.value.toUpperCase());
    }
  }

  #renderNoPointsMessage(currentFilter) {
    this.#noPointsComponent.activeFilter = currentFilter;
    render(this.#noPointsComponent, this.#container);
  }

  #renderTripPoints() {
    this.#renderPointsListComponent();
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i], this.#pointsListComponent);
    }
  }

  #renderTripPoint(tripPoint, tripPointsContainer) {
    const tripPointPresenter = new TripPointPresenter({
      container: tripPointsContainer,
      onDataChange: this.#handleTripPointChange,
      onModeChange: this.#handleModeChange,
    });
    tripPointPresenter.init(tripPoint);
    this.#tripPointsPresenters.set(tripPoint.id, tripPointPresenter);
  }

  #renderSortComponent() {
    this.#sortComponent = new SortView({
      sortTypes: SortType,
      onSortTypeChange: this.#handleSortTypeChange,
      currentSorter: this.#currentSortType,
    });
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderPointsListComponent() {
    render(this.#pointsListComponent, this.#container);
  }

  #clearPointsBoard() {
    remove(this.#sortComponent);
    this.#tripPointsPresenters.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenters.clear();
  }

  #handleTripPointChange = (updatedTripPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTripPoint);
    this.#sourcedBoardTripPoints = updateItem(
      this.#sourcedBoardTripPoints,
      updatedTripPoint
    );
    this.#tripPointsPresenters.get(updatedTripPoint.id).init(updatedTripPoint);
  };

  #handleModeChange = () => {
    this.#tripPointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortTasks(sortType);
    this.#clearPointsBoard();
    this.#renderPointsBoard();
  };

  #sortTasks(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#tripPoints.sort(sortTime);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourcedBoardTripPoints];
    }
    this.#currentSortType = sortType;
  }
}
