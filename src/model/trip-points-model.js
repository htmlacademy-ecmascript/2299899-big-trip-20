import { generateMockTripPoint } from '../mock/trip-point.js';

const MOCK_TRIP_POINTS_AMOUNT = 5;

export default class TripPointsModel {
  tripPoints = Array.from(
    { length: MOCK_TRIP_POINTS_AMOUNT },
    generateMockTripPoint
  );

  getTripPoints() {
    return this.tripPoints;
  }
}
