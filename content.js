function parseNumber(text) {
  return parseFloat(text.replace(/[^\d.,]/g, '').replace('.', '').replace(',', '.'));
}

function calculatePricePerSqm() {
  // listings
  const adsRegular = document.querySelectorAll('li.EntityList-item--Regular');
  const adsVauVau = document.querySelectorAll('li.EntityList-item--VauVau');
  const ads = [...adsRegular, ...adsVauVau];

  ads.forEach(ad => {
    const priceElement = ad.querySelector('.price-item');
    const descriptionElement = ad.querySelector('.entity-description');

    if (!priceElement || !descriptionElement) return;

    const priceText = priceElement.textContent;
    const areaMatch = descriptionElement.textContent.match(/(\d{1,3}(?:[.,]\d{1,2})?)\s*m2/);

    if (priceText && areaMatch) {
      const price = parseNumber(priceText);
      const area = parseNumber(areaMatch[1].replace('.', ','));

      if (area > 0) {
        const pricePerSqm = Math.round(price / area);
        const info = document.createElement('div');
        info.textContent = `${pricePerSqm.toLocaleString('hr-HR')} €/m²`;
        info.style.color = '#FF2F00';
        info.style.fontWeight = 'bold';
        info.style.marginTop = '4px';

        // Append info below price
        priceElement.parentElement.appendChild(info);
      }
    }
  });
}

function calculatePricePerSqmSingleAd() {
  const priceElement = document.querySelector('.ClassifiedDetailSummary-priceDomestic');
  const descriptionElements = document.querySelectorAll('.ClassifiedDetailBasicDetails-textWrapContainer');

  if (!priceElement) return;

  let areaMatch = null;
  for (const descElem of descriptionElements) {
    const text = descElem.textContent || "";
    if (text.includes('m')) {
      areaMatch = text.match(/(\d{1,3}(?:[.,]\d{1,2})?)\s*m/);
      if (areaMatch) break;
    }
  }

  if (!areaMatch) return;

  const price = parseNumber(priceElement.textContent);
  const area = parseNumber(areaMatch[1].replace('.', ','));

  if (area > 0) {
    const pricePerSqm = Math.round(price / area);
    const info = document.createElement('div');
    info.textContent = `${pricePerSqm.toLocaleString('hr-HR')} €/m²`;
    info.style.color = '#FF2F00';
    info.style.fontWeight = 'bold';
    info.style.marginTop = '4px';

    priceElement.parentElement.appendChild(info);
  }
}

window.addEventListener('load', () => {
  if (document.location.pathname.startsWith("/nekretnine")) {
	calculatePricePerSqmSingleAd();
  } else if (document.querySelector('li.EntityList-item--Regular') || document.querySelector('li.EntityList-item--VauVau')) {
    calculatePricePerSqm();
  }
});
