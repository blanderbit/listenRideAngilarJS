import './bike-column.css';

function newBadgeRenderer({ record, translations }) {
  const { isNew } = record.originalData;
  return isNew
    ? `<span class="booking-calendar__badge booking-calendar__badge--blue booking-calendar__badge--chevron">
         ${translations['shared.label_new']}
       </span>`
    : '';
}

function bikeMetaInfoRenderer({ record, translations }) {
  const { id, size, variantsCount, isCluster } = record.originalData;
  let content = '';
  
  if (isCluster) {
    content += `
      <dt>${translations['shared.status-labels.variants_available']}</dt>
      <dd>${variantsCount}</dd>
    `
  } else {
    content += `
      <dt>${translations['shared.id']}</dt>
      <dd>${id}</dd>
      <dt>${translations['booking.overview.size']}</dt>
      <dd>${size}</dd>
      ${newBadgeRenderer({ record, translations })}
    `;
  }
  
  return `
    <dl class="bike-meta">
      ${content}
    </dl>
  `;
}

export function bikeColumnRenderer({ cellElement, record, translations }) {
  cellElement.classList.add('bike-column');

  let html = '';
  const { name, imageUrl, isVariant, variantIndex } = record.originalData;
  if (isVariant) {
    html += `
      <div class="variant-index">${variantIndex}</div>
      ${bikeMetaInfoRenderer({ record, translations })}
    `;
  } else {
    html += `
      <div class="bike-img-wrap"><img class="bike-img" src="${imageUrl}" alt="${name}" /></div>
      <div class="bike-details">
        <p class="bike-name" title="${name}">${name}</p>
        ${bikeMetaInfoRenderer({ record, translations })}
      </div>
    `;
  }
  return html;
}
