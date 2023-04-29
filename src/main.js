import FiltersView from './view/filters-view.js';
import { render } from './render';
import TripPointsPresenter from './presenter/trip-points-presenter.js';
import './mock/trip-points.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripPointsElement = document.querySelector('.trip-events');
const tripPointsPresenter = new TripPointsPresenter({ container: tripPointsElement });

render(new FiltersView(), filtersElement);
tripPointsPresenter.init();
