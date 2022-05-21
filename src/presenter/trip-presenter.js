import { render, RenderPosition } from '../utils/render';
import PointsListView from '../view/points-list-view';
import NoTripPointsView from '../view/no-trip-points-view';
import TripSortView from '../view/trip-sort-view';
import PointPresenter from './point-presenter';
// import HeaderView from '../view/header-view';
import { updateItem } from '../utils/favorite';
import { SortType } from '../utils/const';
import { sortTaskByDay, sortTaskByDuration, sortTaskByPrice } from '../utils/point';

// const tripMainContainer = document.querySelector('.trip-main');

export default class TripPresenter {
  #mainElement = null;
  #tripPointsElement = null;

  #tripSortComponent = new TripSortView();
  #noTripPointsComponent = new NoTripPointsView();
  #tripPointsListElement = new PointsListView();

  #tripPoints = [];
  #infoTrip = null;
  #pointPresenter = new Map();

  #currentSortType = SortType.SORT_DAY;
  #sourcedTripPoints = [];

  constructor(mainElement) {
    this.#mainElement = mainElement;
    this.#tripPointsElement = this.#mainElement.querySelector('.trip-events');
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];
    this.#sourcedTripPoints = [...tripPoints];

    this.#renderMain();
  }

  #renderNoTasks = () => {
    render(this.#tripPointsElement, this.#noTripPointsComponent, RenderPosition.BEFOREEND);
  }

  #renderTripPointsListElement = () => {
    render(this.#tripPointsElement, this.#tripPointsListElement, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #sortTasks = (sortType) => {
    switch (sortType) {
      case SortType.SORT_DAY:
        this.#tripPoints.sort(sortTaskByDay);
        break;
      case SortType.SORT_TIME:
        this.#tripPoints.sort(sortTaskByDuration);
        break;
      case SortType.SORT_PRICE:
        this.#tripPoints.sort(sortTaskByPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clearPointList();
    this.#renderTripPointsList();
  }

  #renderSort = () => {
    render(this.#tripPointsElement, this.#tripSortComponent, RenderPosition.AFTERBEGIN);
    this.#tripSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderTripPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripPointsListElement, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderTripPointsList = () => {
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i]);
    }
  }

  // renderTrip = () => {
  //   if (this.point.length > 0) {
  //     this.#infoTrip = new HeaderView(this.point);
  //     render(tripMainContainer, this.#infoTrip, RenderPosition.AFTERBEGIN);

  //     if (this.point.length === 0) {
  //       this.#renderNoTasks();
  //       return;
  //     }

  //     const point = this.point.slice();

  //     this.#renderPoints(point);
  //   }
  // };

  // #renderPoints = (point) => {
  //   point.forEach((tripEvent) => this.#renderTripPoint(tripEvent));
  // };

  #renderMain = () => {
    if (this.#tripPoints.length === 0) {
      this.#renderNoTasks();
    } else {
      this.#renderSort();
      this.#renderTripPointsListElement();
      this.#sortTasks(this.#currentSortType);
      this.#renderTripPointsList();
      // this.renderTrip();
      // this.#renderPoints();
    }
  }

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#infoTrip.clear();
  }
}
