import TripTabsView from './view/trip-tabs-view.js';
import StatsView from './view/statistics.js';
import {render, RenderPosition, remove} from './utils/render';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filters-model';
import {MenuItem} from './utils/const';
import ApiService from './service/api-service.js';

const AUTORIZATION = 'Basic u4mtv8m3498tmiemmbe89';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTORIZATION));
const filterModel = new FilterModel();

const pageMainElement = document.querySelector('.page-body');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
tripControlsFiltersElement.classList.add('visually-hidden');

const siteMenuComponent = new TripTabsView();

const tripPresenter = new TripPresenter(pageMainElement, pointsModel, filterModel, new ApiService(END_POINT, AUTORIZATION));
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);

let mode = 'TABLE';

const handlePointNewFormClose = () => {
  siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.TABLE}]`).classList.remove('visually-hidden');
  siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.STATS}]`).classList.remove('visually-hidden');
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      if (mode !== 'TABLE') {
        filterPresenter.init();
        tripPresenter.init();
        remove(statisticsComponent);
        mode = 'TABLE';
      }
      break;
    case MenuItem.STATS:
      if (mode !== 'STATS') {
        filterPresenter.destroy();
        tripPresenter.destroy();
        statisticsComponent = new StatsView(pointsModel.points);
        render(pageMainElement, statisticsComponent, RenderPosition.BEFOREEND);
        mode = 'STATS';
      }
      break;
  }
};

filterPresenter.init();

tripPresenter.init().finally(() => {
  pointsModel.init().finally(() => {
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.BEFOREBEGIN);
    tripControlsFiltersElement.classList.remove('visually-hidden');
  });
});

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  filterPresenter.destroy();
  filterPresenter.init();
  tripPresenter.destroy();
  tripPresenter.init().finally(() => {
    tripPresenter.createPoint(handlePointNewFormClose);
    siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.TABLE}]`).classList.add('visually-hidden');
    siteMenuComponent.element.querySelector(`[data-menu-item=${MenuItem.STATS}]`).classList.add('visually-hidden');
    mode = 'TABLE';
  });
});
