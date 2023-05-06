import SortView from '../view/sorting-view.js';
import PointsListView from '../view/trip-point-list-view.js';
// import PointCreationView from '../view/trip-point-creation-view.js';
import PointEditingView from '../view/trip-point-editing-view.js';
import PointElementView from '../view/trip-point-view.js';
import { render, replace } from '../framework/render.js';

export default class TripPointsPresenter {
  #container = null;
  #tripPointsModel = null;
  #pointsList = new PointsListView();
  #tripPoints = [];

  constructor({ container, tripPointsModel }) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
  }

  init() {
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];
    render(new SortView(), this.#container);
    render(this.#pointsList, this.#container);
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  }

  #renderTripPoint(tripPoint) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const tripPointComponent = new PointElementView({
      tripPoint,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });
    const tripPointEditComponent = new PointEditingView({
      tripPoint,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    function replacePointToForm() {
      replace(tripPointEditComponent, tripPointComponent);
    }

    function replaceFormToPoint() {
      replace(tripPointComponent, tripPointEditComponent);
    }

    render(tripPointComponent, this.#pointsList.element);
  }
}
