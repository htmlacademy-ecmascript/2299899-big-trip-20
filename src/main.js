import PointsBoardPresenter from './presenter/points-board-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPointsApiService from './trip-points-api-service.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const AUTHORIZATION = 'Basic mg0jinee09ug34nf9v-j9834dwfp-2';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const tripInfoElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripPointsElement = document.querySelector('.trip-events');

const tripPointsModel = new TripPointsModel({
  tripPointsApiService: new TripPointsApiService(END_POINT, AUTHORIZATION),
});
const tripInfoPresenter = new TripInfoPresenter({
  container: tripInfoElement,
  tripPointsModel,
});
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

tripPointsModel.init();
tripInfoPresenter.init();
filterPresenter.init();
pointsBoardPresenter.init();
