import FiltersView from './view/filters-view.js';
import { render } from './framework/render.js';
import PointsBoardPresenter from './presenter/points-board-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import { generateFilter } from './mock/filter.js';
import { generateMockTripPoint } from './mock/trip-point.js';
import { getRandomInt } from './utils/utils.js';

const MOCK_TRIP_POINTS_MAX_AMOUNT = 7;

const mockTripPoints = Array.from(
  { length: getRandomInt(MOCK_TRIP_POINTS_MAX_AMOUNT) },
  generateMockTripPoint
);

const filtersElement = document.querySelector('.trip-controls__filters');
const tripPointsElement = document.querySelector('.trip-events');
const tripPointsModel = new TripPointsModel({ tripPoints: mockTripPoints });
const pointsBoardPresenter = new PointsBoardPresenter({
  container: tripPointsElement,
  tripPointsModel,
});
const filters = generateFilter(tripPointsModel.tripPoints);

render(new FiltersView({ filters }), filtersElement);
pointsBoardPresenter.init();
