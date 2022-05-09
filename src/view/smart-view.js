import AbstractView from './abstract-view';

export default class SmartView extends AbstractView{
  _data = {};

  updatedData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement = () => {
    const secElement = this.element;
    const parent = secElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, secElement);

    this.restoreHandlers();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
