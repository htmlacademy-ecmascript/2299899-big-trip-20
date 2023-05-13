import { render, replace, remove } from '../framework/render.js';
import PointEditingView from '../view/trip-point-editing-view.js';
import PointElementView from '../view/trip-point-view.js';

export default class TripPointPresenter {
  #container = null;
  #tripPoint = null;
  #tripPointComponent = null;
  #tripPointEditComponent = null;
  #handleDataChange = null;

  constructor({ container, onDataChange }) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
  }

  init(tripPoint) {
    this.#tripPoint = tripPoint;
    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#tripPointComponent = new PointElementView({
      tripPoint: this.#tripPoint,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#tripPointEditComponent = new PointEditingView({
      tripPoint: this.#tripPoint,
      onFormSubmit: this.#handleFormSubmit,
    });

    if (
      prevTripPointComponent === null ||
      prevTripPointEditComponent === null
    ) {
      render(this.#tripPointComponent, this.#container.element);
      return;
    }

    if (this.#container.element.contains(prevTripPointComponent.element)) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }
    if (this.#container.element.contains(prevTripPointEditComponent.element)) {
      replace(this.#tripPointComponent, prevTripPointEditComponent);
    }
    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
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

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#tripPoint,
      isFavorite: !this.#tripPoint.isFavorite,
    });
  };
}
