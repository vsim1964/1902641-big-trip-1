import { render, RenderPosition } from '../utils/render';
import PointsListView from '../view/points-list-view';
import NoTripPointsView from '../view/no-trip-points-view';
import TripSortView from '../view/trip-sort-view';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';
// import HeaderView from '../view/header-view';
import { FilterType, SortType, UpdateType, UserAction } from '../utils/const';
import { sortTaskByDay, sortTaskByDuration, sortTaskByPrice } from '../utils/point';
import {filter} from '../utils/filter';
// const tripMainContainer = document.querySelector('.trip-main');

export default class TripPresenter {
  #mainElement = null;
  #tripPointsElement = null;

  #pointsModel = null;
  #filterModel = null;

  #noTripPointsComponent = null;
  #tripPointsListElement = new PointsListView();
  #sortComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.SORT_DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(mainElement, pointsModel, filterModel) {
    this.#mainElement = mainElement;
    this.#tripPointsElement = this.#mainElement.querySelector('.trip-events');

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#tripPointsListElement, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.SORT_DAY:
        return filteredPoints.sort(sortTaskByDay);
      case SortType.SORT_TIME:
        return filteredPoints.sort(sortTaskByDuration);
      case SortType.SORT_PRICE:
        return filteredPoints.sort(sortTaskByPrice);
    }
    return filteredPoints;
  }

  init = () => {
    this.#renderMain();
  }

  createPoint = () => {
    this.#currentSortType = SortType.SORT_DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init();
  }

  #renderNoTasks = () => {
    this.#noTripPointsComponent = new NoTripPointsView(this.#filterType);
    render(this.#tripPointsElement, this.#noTripPointsComponent, RenderPosition.BEFOREEND);
  }

  #renderTripPointsListElement = () => {
    render(this.#tripPointsElement, this.#tripPointsListElement, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearMain({resetRenderedTaskCount: true, resetSortType: true});
        this.#renderMain();
        break;
    }
  }


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTripPoints(this.points);
    this.#clearMain({resetRenderedTaskCount: true});
    this.#renderMain();
  }

  #renderSort = () => {
    this.#sortComponent = new TripSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripPointsElement, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderTripPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripPointsListElement, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderTripPoints = (points) => {
    points.forEach((point) => this.#renderTripPoint(point));
  }

  #clearMain = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    TripPresenter.remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.SORT_DAY;
    }

    if (this.#noTripPointsComponent) {
      TripPresenter.remove(this.#noTripPointsComponent);
    }
  }

  #renderMain = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoTasks();
      return;
    }

    this.#renderSort();
    this.#renderTripPointsListElement();
    this.#renderTripPoints(points);
  }

  #clearPointList = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
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
