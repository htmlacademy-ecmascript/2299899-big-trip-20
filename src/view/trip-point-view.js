import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { humanizeDate } from '../utils/common.js';
import { DATE_FORMAT, TIME_FORMAT, TIME_DELTA_FORMAT } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

dayjs.extend(duration);

const getTimeDelta = (tripPoint) => {
  const timeDuration = dayjs.duration(
    tripPoint.timeFinish.diff(tripPoint.timeStart)
  );
  let timeDelta = timeDuration.format(TIME_DELTA_FORMAT);
  for (let i = 1; i < 3; i++) {
    if (timeDelta.slice(0, 2) === '00') {
      timeDelta = timeDelta.slice(4);
    }
  }
  return timeDelta;
};

const createOffersListTemplate = (tripPoint) =>
  tripPoint.offers
    .map(
      (offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `
    )
    .join('');

const createPointElementTemplate = (tripPoint) => {
  const favoriteClassName = tripPoint.isFavorite
    ? '  event__favorite-btn--active'
    : '';
  const timeDelta = getTimeDelta(tripPoint);
  const offersListTemplate = createOffersListTemplate(tripPoint);
  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${tripPoint.timeStart}">
        ${humanizeDate(tripPoint.timeStart, DATE_FORMAT)}
        </time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42"
          src="img/icons/${tripPoint.type}.png"
          alt="Event type icon">
        </div>
        <h3 class="event__title">
        ${tripPoint.type} ${tripPoint.destination.city}
        </h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${tripPoint.timeStart}">
            ${humanizeDate(tripPoint.timeStart, TIME_FORMAT)}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${tripPoint.timeFinish}">
            ${humanizeDate(tripPoint.timeFinish, TIME_FORMAT)}
            </time>
          </p>
          <p class="event__duration">
          ${timeDelta}
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${tripPoint.price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersListTemplate}
        </ul>
        <button class="event__favorite-btn${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class PointElementView extends AbstractView {
  #tripPoint = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ tripPoint, onEditClick, onFavoriteClick }) {
    super();
    this.#tripPoint = tripPoint;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointElementTemplate(this.#tripPoint);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
