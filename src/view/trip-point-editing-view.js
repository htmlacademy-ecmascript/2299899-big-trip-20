import {
  DATETIME_FORM_FORMAT,
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
        <input id="event-type-${eventType.toLocaleLowerCase()}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType.toLocaleLowerCase()}"
        ${checked}>
        <label class="event__type-label
        event__type-label--${eventType.toLocaleLowerCase()}"
        for="event-type-${eventType.toLocaleLowerCase()}">
        ${eventType}
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
    humanizeDate(tripPoint.timeStart, DATETIME_FORM_FORMAT)
  );
  const timeFinishEncoded = he.encode(
    humanizeDate(tripPoint.timeFinish, DATETIME_FORM_FORMAT)
  );
  const eventTypeListTemplate = createEventTypeListTemplate(tripPoint);
  const destinationListTemplate = createDestinationListTemplate(tripPoint);
  const offersTemplate =
    tripPoint.availableTypeOffers.length !== 0
      ? createOffersTemplate(tripPoint)
      : '';
  const destinationTemplate = tripPoint.destination.name
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
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">

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
            value="${timeStartEncoded}">
            &mdash;
            <label class="visually-hidden" for="event-end-time">To</label>
            <input class="event__input  event__input--time"
            id="event-end-time"
            type="text"
            name="event-end-time"
            value="${timeFinishEncoded}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price"
            id="event-price"
            type="number"
            min="0"
            name="event-price"
            value="${tripPoint.price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetButtonName}</button>
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
  #availableTypeOffers = [];

  constructor({
    tripPoint = BLANK_TRIP_POINT,
    availableDestinations = [],
    availableTypeOffers = [],
    action,
    onFormSubmit,
    onDeleteClick,
    onFormClose,
  }) {
    super();
    this._setState(PointEditingView.parseTripPointToState(tripPoint));
    this._setState({ availableDestinations, availableTypeOffers });
    this.#availableDestinations = availableDestinations;
    this.#availableTypeOffers = availableTypeOffers;
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
    evt.preventDefault();
    const eventType = evt.target.innerText;
    const offers = [];
    this._setState({ type: eventType });
    this.updateElement({ type: eventType, offers });
  };

  #chooseOfferHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.value;
    const isChecked = evt.target.checked;
    const offers = this._state.offers;
    if (isChecked) {
      offers.push(this.#availableTypeOffers.find((offer) => offer.id === offerId));
    } else {
      const element = offers.find((offer) => offer.Id === offerId);
      const index = offers.indexOf(element);
      offers.splice(index, 1);
    }
    this._setState({ offers });
  };

  #chooseCityHandler = (evt) => {
    evt.preventDefault();
    const inputCity = evt.target.value;
    const updatedDestination = this.#availableDestinations.find((destination) => destination.name === inputCity);
    if (updatedDestination) {
      this.updateElement({ destination: updatedDestination });
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
          onChange: this.#timeStartChangeHandler,
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
          onChange: this.#timeFinishChangeHandler,
        }
      );
    }
  }

  static parseTripPointToState(tripPoint) {
    return { ...tripPoint };
  }

  static parseStateToTripPoint(state) {
    const tripPoint = { ...state };
    delete tripPoint.availableDestinations;
    delete tripPoint.availableTypeOffers;
    return tripPoint;
  }
}
