import SortView from '../view/sorting-view.js';
import PointsListView from '../view/trip-point-list-view.js';
import PointCreationView from '../view/trip-point-creation-view.js';
import PointEditingView from '../view/trip-point-editing-view.js';
import PointElementView from '../view/trip-point-view.js';
import { render } from '../render.js';

export default class TripPointsPresenter {
  pointsList = new PointsListView();

  constructor({ container, tripPointsModel }) {
    this.container = container;
    this.tripPointsModel = tripPointsModel;
  }

  init() {
    this.tripPoints = [...this.tripPointsModel.getTripPoints()];
    render(new SortView(), this.container);
    render(this.pointsList, this.container);
    render(
      new PointCreationView({ tripPoint: this.tripPoints[0] }),
      this.pointsList.getElement()
    );
    render(new PointEditingView({ tripPoint: this.tripPoints[1] }), this.pointsList.getElement());
    for (let i = 2; i < this.tripPoints.length; i++) {
      render(
        new PointElementView({ tripPoint: this.tripPoints[i] }),
        this.pointsList.getElement()
      );
    }
  }
}
