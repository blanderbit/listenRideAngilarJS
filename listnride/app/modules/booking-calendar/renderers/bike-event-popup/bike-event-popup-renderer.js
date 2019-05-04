import moment from 'moment';

import './bike-event-popup.css';

function badgeRenderer({ eventRecord, translations }) {
  const { isPending, isAccepted } = eventRecord.originalData;

  let badgeModifiers = '';
  let icon = '';
  let label = '';

  if (isPending) {
    badgeModifiers += 'booking-calendar__badge--blue';
    icon += '<i class="fa fa-clock-o" aria-hidden="true"></i>';
    label += translations['booking-calendar.event.waiting'];
  }

  if (isAccepted) {
    badgeModifiers += 'booking-calendar__badge--green';
    label += translations['booking-calendar.event.accepted'];
  }

  return `
    <span class="booking-calendar__badge ${badgeModifiers}">
      ${icon} ${label}
    </span>
  `;
}

function bikeDetailsRenderer({ eventRecord, translations, getters }) {
  const datesFormat = 'DD.MM.YYYY';
  const pickupFormat = 'HH:mm';
  const { name, size, category } = eventRecord.resource;
  const {
    startDate,
    endDate,
    bookingId,
    rider,
    contact
  } = eventRecord.originalData;

  return `
    <div class="bike-event-popup__name-wrap">
      <span class="bike-event-popup__name">
        ${name} - ${getters.getCategoryLabel(category)}
      </span>
      ${badgeRenderer({ eventRecord, translations })}
    </div>
    
    <section class="bike-event-popup__section">
      <div>
        <div>${translations['booking.overview.size']}</div>      
        <div>${translations['booking-calendar.event.date']}</div>      
        <div>${translations['booking-calendar.event.pickup']}</div>      
        <div>${translations['booking-calendar.event.booking-id']}</div>      
      </div>
      
      <div>
        <div>${size}</div>
        <div>${moment(startDate).format(datesFormat)} - ${moment(endDate).format(datesFormat)}</div>
        <div>${moment(startDate).format(pickupFormat)}</div>
        <div>${bookingId}</div>
      </div>
    </section>
    
    <section class="bike-event-popup__section">
      <div>
        <div>${translations['booking-calendar.event.rider']}</div>      
        <div>${translations['booking-calendar.event.contact']}</div>      
      </div>
      
      <div>
        <div>${rider}</div>      
        <div>${contact}</div>      
      </div>
    </section>
    
    <a 
      class="bike-event-popup__link" 
      href="${getters.getBookingHref(bookingId)}">
      ${translations['booking-calendar.event.view-booking']}
    </a>
  `;
}

function notAvailableEventPopupRenderer({ translations, getters }) {
  return `
    <header class="bike-event-popup__header">
      ${translations['booking-calendar.event.not-available-header']}
    </header>
    <p class="bike-event-popup__description">
      ${translations['booking-calendar.event.not-available-text']}
    </p>
    <a 
      class="bike-event-popup__link" 
      href="${getters.getBikeListingsHref()}">
      ${translations['booking-calendar.event.see-settings']}
    </a>
  `;
}

export function bikeEventPopupRenderer({ eventRecord, translations, getters }) {
  const { isPending, isAccepted, isNotAvailable } = eventRecord.originalData;

  if (isPending || isAccepted) {
    return bikeDetailsRenderer({ eventRecord, translations, getters });
  }

  if (isNotAvailable) {
    return notAvailableEventPopupRenderer({
      translations,
      getters
    });
  }

  return; /* do not draw a tooltip for clusters */
}
