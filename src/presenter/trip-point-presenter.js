import { render, replace } from '../framework/render.js';
import PointEditingView from '../view/trip-point-editing-view.js';
import PointElementView from '../view/trip-point-view.js';

export default class TripPointPresenter {
  #container = null;
  #tripPoint = null;
  #tripPointComponent = null;
  #tripPointEditComponent = null;

  constructor({ container }) {
    this.#container = container;
  }

  init(tripPoint) {
    this.#tripPoint = tripPoint;
    this.#tripPointComponent = new PointElementView({
      tripPoint: this.#tripPoint,
      onEditClick: this.#handleEditClick,
    });
    this.#tripPointEditComponent = new PointEditingView({
      tripPoint: this.#tripPoint,
      onFormSubmit: this.#handleFormSubmit,
    });
    render(this.#tripPointComponent, this.#container.element);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToForm() {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
