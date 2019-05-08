import './bike-event.css';

function statusRenderer({ eventRecord, resourceRecord, translations }) {
  const { isCluster } = resourceRecord.originalData;
  const { isPending, isAccepted, isNotAvailable, bikesCount } = eventRecord.originalData;
  if (isCluster) {
    return `
      <span class="event-status cluster">
        ${bikesCount} ${translations['seo.bikes']}
      </span>
    `;
  }
  if (isPending) {
    return `
      <span class="event-status pending">
        <i class="fa fa-clock-o" aria-hidden="true"></i>
        ${translations['booking-calendar.event.request-waiting']}
      </span>
    `;
  }
  if (isAccepted) {
    return `
      <span class="event-status pending">
        <i class="fa fa-check-circle-o" aria-hidden="true"></i>
        ${translations['booking-calendar.event.accepted']}
      </span>
    `;
  }
  if (isNotAvailable) {
    return `
      <span class="event-status pending">
        <i class="fa fa-times-circle-o" aria-hidden="true"></i>
        ${translations['booking-calendar.event.not-available']}
      </span>
    `;
  }
  return '';
}

export function bikeEventRenderer({
  eventRecord,
  resourceRecord,
  tplData,
  translations
}) {
  const { name, isCluster } = resourceRecord.originalData;
  const { isPending, isAccepted, isNotAvailable } = eventRecord.originalData;

  tplData.cls.pending = isPending;
  tplData.cls.accepted = isAccepted;
  tplData.cls['not-available'] = isNotAvailable;
  tplData.cls.cluster = isCluster;

  const html = `
    <div class="event-name">${name}</div>
    ${statusRenderer({ eventRecord, resourceRecord, translations })}
  `;

  return html;
}
