import './bike-event.css';

function statusRenderer({ eventRecord, resourceRecord, translations }) {
  const { isCluster } = resourceRecord;
  const { isPending, isAccepted, isNotAvailable, bikesCount } = eventRecord;
  if (isCluster) {
    const bikesLabel =
      bikesCount === 1
        ? translations['search.bike']
        : translations['search.bikes'];
    return `
      <span class="event-status ellipsis bikes-count">
        ${bikesCount} ${bikesLabel}
      </span>
    `;
  }
  if (isPending) {
    return `
      <span class="event-status ellipsis">
        <i class="fa fa-clock-o" aria-hidden="true"></i>
        ${translations['booking-calendar.event.request-waiting']}
      </span>
    `;
  }
  if (isAccepted) {
    return `
      <span class="event-status ellipsis">
        <i class="fa fa-check-circle-o" aria-hidden="true"></i>
        ${translations['booking-calendar.event.accepted']}
      </span>
    `;
  }
  if (isNotAvailable) {
    return `
      <span class="event-status ellipsis">
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
  const { name, isCluster } = resourceRecord;
  const {
    isPending,
    isAccepted,
    isNotAvailable,
    isChangingStatus
  } = eventRecord;

  tplData.cls['changing-status'] = isChangingStatus;
  tplData.cls.pending = isPending;
  tplData.cls.accepted = isAccepted;
  tplData.cls['not-available'] = isNotAvailable;
  tplData.cls.cluster = isCluster;
  tplData.cls['is-narrow'] = Math.floor(tplData.width) <= 50;
  
  const html = `
    <div class="event-name ellipsis">${name}</div>
    ${statusRenderer({ eventRecord, resourceRecord, translations })}
  `;

  return html;
}