import PointAddView from '../view/event-add-view';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointAddComponent = null;
  #destroyCallback = null;
  #offers = null;
  #destinations = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#destroyCallback = callback;

    if (this.#pointAddComponent !== null) {
      return;
    }
    this.#offers = offers;
    this.#destinations = destinations;
    this.#pointAddComponent = new PointAddView(this.#offers, this.#destinations);
    this.#pointAddComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointAddComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointListContainer, this.#pointAddComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#pointAddComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    remove(this.#pointAddComponent);
    this.#pointAddComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
