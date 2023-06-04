import { render, replace, remove } from '../framework/render.js';
import PointEditingView from '../view/trip-point-editing-view.js';
import PointElementView from '../view/trip-point-view.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  #container = null;
  #tripPoint = null;
  #tripPointComponent = null;
  #tripPointEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #availableDestinations = [];
  #availableOffers = [];

  constructor({
    container,
    onDataChange,
    onModeChange,
    availableDestinations,
    availableOffers,
  }) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#availableDestinations = availableDestinations;
    this.#availableOffers = availableOffers;
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
      availableDestinations: this.#availableDestinations,
      availableOffers: this.#availableOffers,
      action: UserAction.UPDATE_TRIP_POINT,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onFormClose: this.#handleFormClose,
    });

    if (
      prevTripPointComponent === null ||
      prevTripPointEditComponent === null
    ) {
      render(this.#tripPointComponent, this.#container.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointComponent, prevTripPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }
    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#tripPointEditComponent.reset(this.#tripPoint);
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#tripPointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#tripPointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#tripPointComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#tripPointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#tripPointEditComponent.shake(resetFormState);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#tripPointEditComponent.reset(this.#tripPoint);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_TRIP_POINT,
      UpdateType.MINOR,
      update
    );
  };

  #handleDeleteClick = (tripPoint) => {
    this.#handleDataChange(
      UserAction.DELETE_TRIP_POINT,
      UpdateType.MINOR,
      tripPoint
    );
  };

  #handleFormClose = () => {
    this.resetView();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_TRIP_POINT, UpdateType.MINOR, {
      ...this.#tripPoint,
      isFavorite: !this.#tripPoint.isFavorite,
    });
  };
}
