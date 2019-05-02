import './bike-event.css';

function statusRenderer({eventRecord, resourceRecord, tplData, translations}) {
  const { isPending, isAccepted, isNotAvailable } = eventRecord.originalData;
  if (isPending) {
    return `
      <span class="event-status pending">
        <i class="fa fa-clock-o" aria-hidden="true"></i>
        Request waiting
      </span>
    `;
  }
  if (isAccepted) {
    return `
      <span class="event-status pending">
        <i class="fa fa-check-circle-o" aria-hidden="true"></i>
        Accepted
      </span>
    `;
  }
  if (isNotAvailable) {
    return `
      <span class="event-status pending">
        <i class="fa fa-times-circle-o" aria-hidden="true"></i>
        Not available
      </span>
    `;
  }
  return '';
}

export function bikeEventRenderer({eventRecord, resourceRecord, tplData, translations}) {
  const { name } = resourceRecord.originalData;
  const { isPending, isAccepted, isNotAvailable } = eventRecord.originalData;

  tplData.cls.pending = isPending;
  tplData.cls.accepted = isAccepted;
  tplData.cls['not-available'] = isNotAvailable;

  const html = `
    <div class="event-name">${name}</div>
    ${statusRenderer({ eventRecord, resourceRecord, tplData, translations })}
  `;

  return html;
}
