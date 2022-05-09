export const createOffersSectionMarkup = (offersByTypes, pointType) => {
  const createOfferMarkup = (offer) => `<div class="event__available-offers">
                      <div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${pointType}-1" type="checkbox" name="event-offer-${pointType}" >
                        <label class="event__offer-label" for="event-offer-name-1">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;

  let offersByCurrentType = [];

  for (let i = 0; i < offersByTypes.length; i++) {
    if (offersByTypes[i].type === pointType) {
      offersByCurrentType = offersByTypes[i].offers;
    }
  }
  const offersMarkup = offersByTypes.map(createOfferMarkup).join('');

  if (offersByCurrentType.length !== 0){
    return `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    ${offersMarkup}</section>`;
  }
  return '';
};
export const createPointTypesMarkup = (offers, chosenEventType) => {
  const createTypeMarkup = (offer) => {

    const isChecked = offer === chosenEventType ? 'checked=""' : '';
    const label = offer.charAt(0).toUpperCase() + offer.slice(1);

    return `<div class="event__type-item">
                          <input id="event-type-${offer}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer}" ${isChecked}>
                          <label class="event__type-label  event__type-label--${offer}" for="event-type-${offer}-1">${label}</label>
                        </div>`;
  };

  return offers.map(createTypeMarkup).join('');
};
