export function filterProducts(products, filters) {
  // parse once, not for every product
  const minPrice = parsePriceFilter(filters.minPrice);
  const maxPrice = parsePriceFilter(filters.maxPrice);

  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (minPrice === null && maxPrice === null) {
      return true;
    }

    if (!Number.isFinite(product.price)) {
      return false;
    }

    if (minPrice !== null && product.price < minPrice) {
      return false;
    }

    if (maxPrice !== null && product.price > maxPrice) {
      return false;
    }

    return true;
  });
}

export function isPriceRangeInvalid(minPriceValue, maxPriceValue) {
  const minPrice = parsePriceFilter(minPriceValue);
  const maxPrice = parsePriceFilter(maxPriceValue);

  return minPrice !== null && maxPrice !== null && minPrice > maxPrice;
}

export function parsePriceFilter(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // users sometimes paste price with comma
  const parsedValue = Number(String(value).replace(',', '.'));

  // negative prices are just ignored here
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}
