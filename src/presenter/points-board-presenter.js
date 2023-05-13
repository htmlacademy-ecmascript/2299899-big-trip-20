import SortView from '../view/sorting-view.js';
import PointsListView from '../view/trip-point-list-view.js';
// import PointCreationView from '../view/trip-point-creation-view.js';
import { render } from '../framework/render.js';
import TripPointPresenter from './trip-point-presenter.js';
import NoPointsView from '../view/no-points-view.js';

export default class PointsBoardPresenter {
  #container = null;
  #tripPointsModel = null;
  #tripPoints = [];
  #sortComponent = new SortView();
  #pointsListComponent = new PointsListView();
  #noPointsComponent = new NoPointsView();

  constructor({ container, tripPointsModel }) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
  }

  init() {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    this.#renderPointsBoard();
  }

  #renderPointsBoard() {
    const currentFilter = document.querySelector(
      'input[name="trip-filter"]:checked'
    );
    const currentFilterPointsAmount = currentFilter.dataset.tripPointsAmount;
    if (currentFilterPointsAmount !== '0') {
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
    render(this.#sortComponent, this.#container);
    render(this.#pointsListComponent, this.#container);
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i], this.#pointsListComponent);
    }
  }

  #renderTripPoint(tripPoint, tripPointsContainer) {
    const tripPointPresenter = new TripPointPresenter({
      container: tripPointsContainer,
    });
    tripPointPresenter.init(tripPoint);
  }
}
