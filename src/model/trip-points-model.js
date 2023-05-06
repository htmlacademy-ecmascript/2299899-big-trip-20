import { generateMockTripPoint } from '../mock/trip-point.js';

const MOCK_TRIP_POINTS_AMOUNT = 7;

export default class TripPointsModel {
  #tripPoints = Array.from(
    { length: MOCK_TRIP_POINTS_AMOUNT },
    generateMockTripPoint
  );

  get tripPoints() {
    return this.#tripPoints;
  }
}
