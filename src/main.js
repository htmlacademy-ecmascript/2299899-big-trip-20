import FiltersView from './view/filters-view.js';
import { render } from './framework/render.js';
import TripPointsPresenter from './presenter/trip-points-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import { generateFilter } from './mock/filter.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripPointsElement = document.querySelector('.trip-events');
const tripPointsModel = new TripPointsModel();
const tripPointsPresenter = new TripPointsPresenter({
  container: tripPointsElement,
  tripPointsModel,
});
const filters = generateFilter(tripPointsModel.tripPoints);

render(new FiltersView({ filters }), filtersElement);
tripPointsPresenter.init();
