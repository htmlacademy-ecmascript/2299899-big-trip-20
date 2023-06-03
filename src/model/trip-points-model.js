import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class TripPointsModel extends Observable {
  #tripPointsAPiService = null;
  #tripPoints = [];
  #destinations = [];
  #offers = [];

  constructor({ tripPointsApiService }) {
    super();
    this.#tripPointsAPiService = tripPointsApiService;
  }

  get tripPoints() {
    return this.#tripPoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const tripPoints = await this.#tripPointsAPiService.tripPoints;
      this.#destinations = await this.#tripPointsAPiService.destinations;
      this.#offers = await this.#tripPointsAPiService.offers;
      this.#tripPoints = tripPoints.map((tripPoint) => {
        const offers = this.#offers.find(
          (offer) => offer.type === tripPoint.type
        );
        const adaptedTripPoint = this.#adaptToClient(
          tripPoint,
          this.#destinations,
          offers.offers
        );
        return adaptedTripPoint;
      });
    } catch (err) {
      this.#tripPoints = [];
      this.#destinations = [];
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updateTripPoint(updateType, update) {
    const index = this.#tripPoints.findIndex(
      (tripPoint) => tripPoint.id === update.id
    );
    if (index === -1) {
      throw new Error('Can\'t update unexisting trip point');
    }
    try {
      const response = await this.#tripPointsAPiService.updateTripPoint(update);
      const updatedTripPoint = this.#adaptToClient(response);
      this.#tripPoints = [...this.#tripPoints];
      this.#tripPoints[index] = updatedTripPoint;
      this._notify(updateType, updatedTripPoint);
    } catch (err) {
      throw new Error('Can\'t update trip point');
    }
  }

  addTripPoint(updateType, update) {
    this.#tripPoints = [update, ...this.#tripPoints];
    this._notify(updateType, update);
  }

  deleteTripPoint(updateType, update) {
    const index = this.#tripPoints.findIndex(
      (tripPoint) => tripPoint.id === update.id
    );
    if (index === -1) {
      throw new Error('Can\'t delete unexisting trip point');
    }
    this.#tripPoints.splice(index, 1);
    this._notify(updateType);
  }

  #adaptToClient(tripPoint, destinations, offers) {
    const adaptedTripPoint = {
      ...tripPoint,
      timeStart: tripPoint['date_from'],
      timeFinish: tripPoint['date_to'],
      price: tripPoint['base_price'],
      isFavorite: tripPoint['is_favorite'],
    };
    const adaptedDestination = destinations.find(
      (destination) => destination.id === tripPoint.destination
    );
    adaptedTripPoint.destination = adaptedDestination;
    const adaptedOffers = [];
    adaptedTripPoint.offers.forEach((offerId) =>
      adaptedOffers.push(offers.find((offer) => offer.id === offerId))
    );
    adaptedTripPoint.offers = adaptedOffers;
    delete adaptedTripPoint['date_from'];
    delete adaptedTripPoint['date_to'];
    delete adaptedTripPoint['base_price'];
    delete adaptedTripPoint['is_favorite'];
    return adaptedTripPoint;
  }
}
