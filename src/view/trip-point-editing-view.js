import { DATETIME_FORM_FORMAT, TRIP_POINTS_TYPES } from '../const.js';
import { MOCK_CITIES, MOCK_OFFERS } from '../mock/trip-point.js';
import { humanizeDate } from '../utils/utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const createEventTypeListTemplate = (tripPoint) =>
  TRIP_POINTS_TYPES.map((eventType) => {
    const checked = eventType === tripPoint.type ? 'checked' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${eventType.toLocaleLowerCase()}-2"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType.toLocaleLowerCase()}
        ${checked}">
        <label class="event__type-label
        event__type-label--${eventType.toLocaleLowerCase()}"
        for="event-type-${eventType.toLocaleLowerCase()}-2">
        ${eventType}
        </label>
      </div>
    `;
  }).join('');

const createDestinationListTemplate = () =>
  MOCK_CITIES.map((city) => `<option value="${city}"></option>`).join('');

const createOffersListTemplate = (tripPoint) =>
  MOCK_OFFERS.map((offer) => {
    const checked = tripPoint.offers.some(
      (element) => element.type === offer.type
    )
      ? 'checked'
      : '';
    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.type.toLowerCase()}-2"
      type="checkbox"
      name="event-offer-${offer.type.toLowerCase()}"
      ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.type.toLowerCase()}-2">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
    `;
  }).join('');

const createPhotoListTemplate = (tripPoint) =>
  tripPoint.destination.photos
    .map(
      (photo) => `
    <img class="event__photo"
    src="${photo}"
    alt="Event photo">`
    )
    .join('');

const createPointEditingTemplate = (tripPoint) => {
  const eventTypeListTemplate = createEventTypeListTemplate(tripPoint);
  const destinationListTemplate = createDestinationListTemplate();
  const offersListTemplate = createOffersListTemplate(tripPoint);
  const photoListTemplate = createPhotoListTemplate(tripPoint);
  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-2">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon"
              width="17" height="17"
              src="img/icons/${tripPoint.type}.png"
              alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-2" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypeListTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${tripPoint.type}
            </label>
            <input class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${tripPoint.destination.city}"
            list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${humanizeDate(tripPoint.timeStart, DATETIME_FORM_FORMAT)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${humanizeDate(tripPoint.timeFinish, DATETIME_FORM_FORMAT)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${tripPoint.price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersListTemplate}
            </div>
          </section>

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
        </section>
      </form>
    </li>
  `;
};

export default class PointEditingView extends AbstractView {
  #tripPoint = null;
  #handleFormSubmit = null;
  constructor({ tripPoint, onFormSubmit }) {
    super();
    this.#tripPoint = tripPoint;
    this.#handleFormSubmit = onFormSubmit;
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formSubmitHandler);
  }

  get template() {
    return createPointEditingTemplate(this.#tripPoint);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
