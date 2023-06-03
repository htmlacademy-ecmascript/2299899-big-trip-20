import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class TripPointsApiService extends ApiService {
  get tripPoints() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }

  async updateTripPoint(tripPoint) {
    const response = await this._load({
      url: `points/${tripPoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  #adaptToServer(tripPoint) {
    const adaptedTripPoint = {
      ...tripPoint,
      'date_from': tripPoint.timeStart,
      'date_to': tripPoint.timeFinish,
      'base_price': tripPoint.price,
      'is_favorite': tripPoint.isFavorite,
    };
    adaptedTripPoint.destination = adaptedTripPoint.destination.id;
    adaptedTripPoint.offers = adaptedTripPoint.offers.map((offer) => offer.id);
    delete adaptedTripPoint.timeStart;
    delete adaptedTripPoint.timeFinish;
    delete adaptedTripPoint.price;
    delete adaptedTripPoint.isFavorite;
    return adaptedTripPoint;
  }
}
