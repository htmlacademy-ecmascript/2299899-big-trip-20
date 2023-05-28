import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import { generateId } from '../mock/trip-point.js';
import PointEditingView from '../view/trip-point-editing-view.js';

export default class NewTripPointPresenter {
  #tripPointsContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #newPointComponent = null;

  constructor({ container, onDataChange, onDestroy }) {
    this.#tripPointsContainer = container;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#newPointComponent !== null) {
      return;
    }
    this.#newPointComponent = new PointEditingView({
      action: UserAction.ADD_TRIP_POINT,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
    });
    render(
      this.#newPointComponent,
      this.#tripPointsContainer,
      RenderPosition.AFTERBEGIN
    );
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#newPointComponent);
    this.#newPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (tripPoint) => {
    this.#handleDataChange(
      UserAction.ADD_TRIP_POINT,
      UpdateType.MINOR,
      { id: generateId(), ...tripPoint }
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
