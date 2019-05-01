function newBadgeRenderer({ record, translations }) {
  const { isNew } = record.originalData;
  return isNew
    ? `<span class="bike-new-badge">${translations['shared.label_new']}</span>`
    : '';
}

function bikeMetaInfoRenderer({ record, translations }) {
  const { id, size } = record.originalData;
  return `
    <dl class="bike-meta">
      <dt>${translations['shared.id']}</dt>
      <dd>${id}</dd>
      <dt>${translations['booking.overview.size']}</dt>
      <dd>${size}</dd>
      ${newBadgeRenderer({ record, translations })}
    </dl>
  `;
}

export function bikeCellRenderer({ cellElement, record, translations }) {
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
      <img class="bike-img" src="${imageUrl}" />
      <div class="bike-details">
        <p class="bike-name" title="${name}">${name}</p>
        ${bikeMetaInfoRenderer({ record, translations })}
      </div>
    `;
  }
  return html;
}
