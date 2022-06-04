import PointAddView from '../view/event-add-view';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointAddComponent = null;
  #destroyCallback = null;
  #ofOffers = null;
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
    this.#ofOffers = offers;
    this.#destinations = destinations;
    this.#pointAddComponent = new PointAddView(this.#destinations, this.#ofOffers);
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
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }

  setSaving = () => {
    this.#pointAddComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointAddComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointAddComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    document.querySelector('.trip-main__event-add-btn').disabled = false;
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
