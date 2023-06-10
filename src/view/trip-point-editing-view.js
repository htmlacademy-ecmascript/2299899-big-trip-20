import {
  DateTimeFormat,
  TRIP_POINTS_TYPES,
  UserAction,
} from '../const.js';
import { humanizeDate } from '../utils/common.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { BLANK_TRIP_POINT } from '../const.js';
import he from 'he';

const createEventTypeListTemplate = (tripPoint) =>
  TRIP_POINTS_TYPES.map((eventType) => {
    const checked = eventType === tripPoint.type ? 'checked' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${eventType}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${checked}>
        <label class="event__type-label
        event__type-label--${eventType}"
        for="event-type-${eventType}">
        ${eventType[0].toUpperCase() + eventType.slice(1)}
        </label>
      </div>
    `;
  }).join('');

const createDestinationListTemplate = (tripPoint) =>
  tripPoint.availableDestinations
    .map((destination) => `<option value="${destination.name}"></option>`)
    .join('');

const createOffersListTemplate = (tripPoint) =>
  tripPoint.availableTypeOffers
    .map((offer) => {
      const checked = tripPoint.offers.find(
        (searchedOffer) => searchedOffer.id === offer.id
      )
        ? 'checked'
        : '';
      return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        name="event-offer-${offer.id}"
        value="${offer.id}"
        ${checked}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
      `;
    })
    .join('');

const createOffersTemplate = (tripPoint) => {
  const offersListTemplate = createOffersListTemplate(tripPoint);
  return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersListTemplate}
        </div>
      </section>
    `;
};

const createPhotoListTemplate = (tripPoint) =>
  tripPoint.destination.pictures
    .map(
      (picture) => `
    <img class="event__photo"
    src="${picture.src}"
    alt="${picture.description}">`
    )
    .join('');

const createDestinationTemplate = (tripPoint) => {
  const photoListTemplate = createPhotoListTemplate(tripPoint);
  return `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
          ${tripPoint.destination.description}
          </p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photoListTemplate}
            </div>
          </div>
        </section>
      `;
};

const createPointEditingTemplate = (tripPoint, action) => {
  const resetButtonName =
    action === UserAction.UPDATE_TRIP_POINT ? 'Delete' : 'Cancel';
  const timeStartEncoded = he.encode(
    humanizeDate(tripPoint.timeStart, DateTimeFormat.FORM_DATE_TIME)
  );
  const timeFinishEncoded = he.encode(
    humanizeDate(tripPoint.timeFinish, DateTimeFormat.FORM_DATE_TIME)
  );
  const eventTypeListTemplate = createEventTypeListTemplate(tripPoint);
  const destinationListTemplate = createDestinationListTemplate(tripPoint);
  const offersTemplate =
    tripPoint.availableTypeOffers.length !== 0
      ? createOffersTemplate(tripPoint)
      : '';
  const destinationTemplate = tripPoint.destination.name && (tripPoint.destination.description || tripPoint.destination.pictures.length !== 0)
    ? createDestinationTemplate(tripPoint)
    : '';
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon"
              width="17" height="17"
              src="img/icons/${tripPoint.type}.png"
              alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox"
            ${tripPoint.isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypeListTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination">
              ${tripPoint.type}
            </label>
            <input class="event__input  event__input--destination"
            id="event-destination"
            type="text"
            name="event-destination"
            value="${he.encode(tripPoint.destination.name)}"
            list="destination-list"
            required
            ${tripPoint.isDisabled ? 'disabled' : ''}
            >
            <datalist id="destination-list">
              ${destinationListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time">From</label>
            <input class="event__input  event__input--time"
            id="event-start-time"
            type="text"
            name="event-start-time"
            value="${timeStartEncoded}"
            ${tripPoint.isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time">To</label>
            <input class="event__input  event__input--time"
            id="event-end-time"
            type="text"
            name="event-end-time"
            value="${timeFinishEncoded}"
            ${tripPoint.isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price"
            id="event-price"
            type="number"
            min="1"
            name="event-price"
            value="${tripPoint.price}"
            ${tripPoint.isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${tripPoint.isDisabled ? 'disabled' : ''}>
          ${tripPoint.isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${tripPoint.isDisabled ? 'disabled' : ''}>
          ${tripPoint.isDeleting ? 'Deleting...' : resetButtonName}
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationTemplate}
        </section>
      </form>
    </li>
  `;
};

export default class PointEditingView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleFormClose = null;
  #datepicker = null;
  #action = UserAction.UPDATE_TRIP_POINT;
  #availableDestinations = [];
  #availableOffers = [];
  #availableTypeOffers = [];

  constructor({
    tripPoint = BLANK_TRIP_POINT,
    availableDestinations = [],
    availableOffers = [],
    action,
    onFormSubmit,
    onDeleteClick,
    onFormClose,
  }) {
    super();
    this._setState(PointEditingView.parseTripPointToState(tripPoint));
    this.#availableDestinations = availableDestinations;
    this.#availableOffers = availableOffers;
    const availableTypeOffers = this.#availableOffers.find(
      (offer) => offer.type === this._state.type
    ).offers;
    this.#availableTypeOffers = availableTypeOffers;
    this._setState({ availableDestinations, availableTypeOffers });
    this.#action = action;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleFormClose = onFormClose;
    this._restoreHandlers();
  }

  get template() {
    return createPointEditingTemplate(this._state, this.#action);
  }

  removeElement() {
    super.removeElement();
    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(tripPoint) {
    this.updateElement(PointEditingView.parseTripPointToState(tripPoint));
  }

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleFormClose);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#chooseTripPointTypeHandler);
    if (this._state.availableTypeOffers.length !== 0) {
      this.element
        .querySelector('.event__available-offers')
        .addEventListener('change', this.#chooseOfferHandler);
    }
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('input', this.#chooseCityHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#changePriceHandler);
    this.#setDatepickerTimeStart();
    this.#setDatepickerTimeFinish();
  }

  #updateAvailableTypeOffers() {
    const availableTypeOffers = this.#availableOffers.find(
      (offer) => offer.type === this._state.type.toLowerCase()
    ).offers;
    this.#availableTypeOffers = availableTypeOffers;
    this._setState({ availableTypeOffers });
    return availableTypeOffers;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditingView.parseStateToTripPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(
      PointEditingView.parseStateToTripPoint(this._state)
    );
  };

  #changePriceHandler = (evt) => {
    evt.preventDefault();
    const price = evt.target.valueAsNumber;
    this._setState({ price });
  };

  #chooseTripPointTypeHandler = (evt) => {
    if (evt.target.closest('.event__type-label')) {
      evt.preventDefault();
      const eventType = evt.target.innerText.toLowerCase();
      const offers = [];
      this._setState({ type: eventType });
      const availableTypeOffers = this.#updateAvailableTypeOffers();
      this.updateElement({
        type: eventType,
        offers,
        availableTypeOffers,
      });
    }
  };

  #chooseOfferHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.value;
    const isChecked = evt.target.checked;
    const offers = [...this._state.offers];
    if (isChecked) {
      const foundOffer = this.#availableTypeOffers.find((offer) => offer.id === offerId);
      offers.push(foundOffer);
    } else {
      const element = offers.find((offer) => offer.id === offerId);
      const index = offers.indexOf(element);
      offers.splice(index, 1);
    }
    this._setState({ offers });
  };

  #chooseCityHandler = (evt) => {
    evt.preventDefault();
    const inputCity = evt.target.value;
    const updatedDestination = this.#availableDestinations.find(
      (destination) => destination.name === inputCity
    );
    if (updatedDestination) {
      evt.target.setCustomValidity('');
      this.updateElement({ destination: updatedDestination });
    } else {
      evt.target.setCustomValidity('Сity must be on the list');
    }
  };

  #timeStartChangeHandler = ([userDate]) => {
    this.updateElement({
      timeStart: userDate,
    });
  };

  #timeFinishChangeHandler = ([userDate]) => {
    this.updateElement({
      timeFinish: userDate,
    });
  };

  #setDatepickerTimeStart() {
    if (this._state.timeStart) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-start-time'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.timeStart,
          onClose: this.#timeStartChangeHandler,
          maxDate: this._state.timeFinish,
          minuteIncrement: 1,
        }
      );
    }
  }

  #setDatepickerTimeFinish() {
    if (this._state.timeFinish) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-end-time'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.timeFinish,
          onClose: this.#timeFinishChangeHandler,
          minDate: this._state.timeStart,
          minuteIncrement: 1,
        }
      );
    }
  }

  static parseTripPointToState(tripPoint) {
    return {
      ...tripPoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToTripPoint(state) {
    const tripPoint = { ...state };
    delete tripPoint.availableDestinations;
    delete tripPoint.availableTypeOffers;
    delete tripPoint.isDisabled;
    delete tripPoint.isSaving;
    delete tripPoint.isDeleting;
    return tripPoint;
  }
}
