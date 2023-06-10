import { INFO_DATE_FORMAT } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate } from '../utils/common.js';

const formatTripRoute = (tripRoute) => {
  switch (tripRoute.length) {
    case 0:
      return '';
    case 1:
      return tripRoute.at(0);
    case 2:
      return `${tripRoute.at(0)} — ${tripRoute.at(-1)}`;
    case 3:
      return `${tripRoute.at(0)} — ${tripRoute.at(1)} — ${tripRoute.at(-1)}`;
    default:
      return `${tripRoute.at(0)} — ... — ${tripRoute.at(-1)}`;
  }
};

const createTripInfoRemplate = (tripRoute, tripDates, tripTotalPrice) => {
  const route = formatTripRoute(tripRoute);
  const dates = tripDates.length > 1 ? `${humanizeDate(tripDates.at(0), INFO_DATE_FORMAT)}&nbsp;—&nbsp;${humanizeDate(tripDates.at(-1), INFO_DATE_FORMAT)}` : '';
  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: €&nbsp;<span class="trip-info__cost-value">${tripTotalPrice}</span>
      </p>
    </section>
  `;
};

export default class TripInfoView extends AbstractView {
  #tripRoute = null;
  #tripDates = null;
  #tripTotalPrice = 0;

  constructor({ tripRoute, tripDates, tripTotalPrice }) {
    super();
    this.#tripRoute = tripRoute;
    this.#tripDates = tripDates;
    this.#tripTotalPrice = tripTotalPrice;
  }

  get template() {
    return createTripInfoRemplate(
      this.#tripRoute,
      this.#tripDates,
      this.#tripTotalPrice
    );
  }
}
