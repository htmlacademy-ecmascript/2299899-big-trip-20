import { generateMockTripPoint } from '../mock/trip-point.js';
import { getRandomInt } from '../utils/utils.js';

const MOCK_TRIP_POINTS_MAX_AMOUNT = 7;

export default class TripPointsModel {
  #tripPoints = Array.from(
    { length: getRandomInt(MOCK_TRIP_POINTS_MAX_AMOUNT) },
    generateMockTripPoint
  );

  get tripPoints() {
    return this.#tripPoints;
  }
}
