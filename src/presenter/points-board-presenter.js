import SortView from '../view/sorting-view.js';
import PointsListView from '../view/trip-point-list-view.js';
import NewTripPointPresenter from './new-point-presenter.js';
import TripPointPresenter from './trip-point-presenter.js';
import NoPointsView from '../view/no-points-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortTime, sortPrice } from '../utils/sorter.js';
import { filter } from '../utils/filter.js';

export default class PointsBoardPresenter {
  #container = null;
  #tripPointsModel = null;
  #tripPointsPresenters = new Map();
  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #noPointsComponent = null;
  #currentSortType = SortType.DAY;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #newTripPointPresenter = null;

  constructor({ container, tripPointsModel, filterModel, onNewPointDestroy }) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
    this.#filterModel = filterModel;
    this.#newTripPointPresenter = new NewTripPointPresenter({
      container: this.#pointsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });
    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  createTripPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#tripPointsModel.tripPoints.length === 0) {
      remove(this.#noPointsComponent);
      this.#renderPointsListComponent();
    }
    this.#newTripPointPresenter.init();
  }

  get tripPoints() {
    this.#filterType = this.#filterModel.filter;
    const tripPoints = this.#tripPointsModel.tripPoints;
    const filteredTripPoints = filter[this.#filterType](tripPoints);
    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredTripPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredTripPoints.sort(sortPrice);
    }
    return filteredTripPoints;
  }

  init() {
    this.#renderPointsBoard();
  }

  #renderPointsBoard() {
    const currentFilterPointsAmount = this.#tripPointsModel.tripPoints.length;
    if (currentFilterPointsAmount) {
      this.#renderSortComponent();
      this.#renderTripPoints();
    } else {
      this.#renderNoPointsMessage(this.#filterType.toUpperCase());
    }
  }

  #renderNoPointsMessage() {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType,
    });
    render(this.#noPointsComponent, this.#container);
  }

  #renderTripPoints() {
    this.#renderPointsListComponent();
    const tripPoints = this.tripPoints;
    for (let i = 0; i < tripPoints.length; i++) {
      this.#renderTripPoint(tripPoints[i], this.#pointsListComponent);
    }
  }

  #renderTripPoint(tripPoint, tripPointsContainer) {
    const tripPointPresenter = new TripPointPresenter({
      container: tripPointsContainer,
      onDataChange: this.#handleViewAction,
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

  #clearPointsBoard({ resetSortType = false } = {}) {
    this.#newTripPointPresenter.destroy();
    this.#tripPointsPresenters.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#noPointsComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    this.#newTripPointPresenter.destroy();
    this.#tripPointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointsBoard();
    this.#renderPointsBoard();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsBoard();
        this.#renderPointsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsBoard({ resetSortType: true });
        this.#renderPointsBoard();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TRIP_POINT:
        this.#tripPointsModel.updateTripPoint(updateType, update);
        break;
      case UserAction.ADD_TRIP_POINT:
        this.#tripPointsModel.addTripPoint(updateType, update);
        break;
      case UserAction.DELETE_TRIP_POINT:
        this.#tripPointsModel.deleteTripPoint(updateType, update);
        break;
    }
  };
}
