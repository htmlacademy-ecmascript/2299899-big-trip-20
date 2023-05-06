import FiltersView from './view/filters-view.js';
import { render } from './framework/render.js';
import TripPointsPresenter from './presenter/trip-points-presenter.js';
import TripPointsModel from './model/trip-points-model.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripPointsElement = document.querySelector('.trip-events');
const tripPointsModel = new TripPointsModel();
const tripPointsPresenter = new TripPointsPresenter({
  container: tripPointsElement,
  tripPointsModel,
});

render(new FiltersView(), filtersElement);
tripPointsPresenter.init();
