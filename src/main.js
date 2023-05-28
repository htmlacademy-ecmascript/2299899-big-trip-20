import PointsBoardPresenter from './presenter/points-board-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import { generateMockTripPoint } from './mock/trip-point.js';
import { getRandomInt } from './utils/common.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const MOCK_TRIP_POINTS_MAX_AMOUNT = 7;

const mockTripPoints = Array.from(
  { length: getRandomInt(MOCK_TRIP_POINTS_MAX_AMOUNT) },
  generateMockTripPoint
);

const filtersElement = document.querySelector('.trip-controls__filters');
const tripPointsElement = document.querySelector('.trip-events');
const tripPointsModel = new TripPointsModel({ tripPoints: mockTripPoints });
const filterModel = new FilterModel();
const pointsBoardPresenter = new PointsBoardPresenter({
  container: tripPointsElement,
  tripPointsModel,
  filterModel,
});
const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filterModel,
  tripPointsModel,
});

filterPresenter.init();
pointsBoardPresenter.init();
