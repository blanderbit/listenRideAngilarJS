export function bikeCellRenderer({ cellElement, record }) {
  cellElement.classList.add('bike-column');
  let html = '';
  const { name, imageUrl, isVariant } = record.originalData;
  if (!isVariant) {
    html += `
      <img class="bike-img" src="${imageUrl}" />
      ${name}
    `;
  } else {
    html += name;
  }
  return html;
}
