//посмотреть доп задание в тз - дополнительно
import dayjs from 'dayjs';
import AbstractView from './abstract-view';
import { sortTaskByDuration } from '../utils/point';
// import { locations } from '../mock/locations';

const createHeaderView = (points) => {
  points.sort(sortTaskByDuration);
  const cities = points.map((point)=> point.city.currentCity.titleCity);
  let allPrice = null;
  points.forEach((point) => { allPrice += Number(point.startPrice); });
  const dateBegin = dayjs(points[0].date.start).format('MMM D');
  const dateEnd = dayjs(points[points.length-1].date.end).format('MMM DD');

  let tripTitles = '';

  if(cities.length <= 3) {
    cities.forEach((nameCity, index) => {
      if(index === cities.length - 1) {
        tripTitles += `${ nameCity }`;
      }
      else {
        tripTitles += `${ nameCity } &mdash; `;
      }
    });
  } else if(cities.length > 3) {
    tripTitles = `${ cities[0] } &mdash; ... &mdash; ${ cities[cities.length - 1] }`;
  }

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${ tripTitles }</h1>
              <p class="trip-info__dates">${ dateBegin }&nbsp;&mdash;&nbsp;${ dateEnd }</p>
            </div>
            <p class="trip-info__cost">
              Total: &euro;&nbsp; ${ allPrice } <span class="trip-info__cost-value"</span>
            </p>
          </section>`;
};

export default class HeaderView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createHeaderView(this.#points);
  }
}
