import './bike-event-popup.css';

export function bikeEventPopupRenderer({ eventRecord }) {
  const { name } = eventRecord.resource;
  return `${name}`;
}
