export function sortProducts(products, sortBy) {
  // dont mutate products kept in store
  const productsCopy = [...products];

  switch (sortBy) {
    case 'price-asc':
      return productsCopy.sort(comparePriceAscending);
    case 'price-desc':
      return productsCopy.sort(comparePriceDescending);
    case 'name-asc':
      return productsCopy.sort((firstProduct, secondProduct) =>
        compareNames(firstProduct, secondProduct),
      );
    case 'name-desc':
      return productsCopy.sort((firstProduct, secondProduct) =>
        compareNames(secondProduct, firstProduct),
      );
    default:
      return productsCopy;
  }
}

function comparePriceAscending(firstProduct, secondProduct) {
  // missing prices go last in ascending sort
  const firstPrice = Number.isFinite(firstProduct.price) ? firstProduct.price : Number.POSITIVE_INFINITY;
  const secondPrice = Number.isFinite(secondProduct.price)
    ? secondProduct.price
    : Number.POSITIVE_INFINITY;

  return firstPrice - secondPrice;
}

function comparePriceDescending(firstProduct, secondProduct) {
  // missing prices go last in descending too
  const firstPrice = Number.isFinite(firstProduct.price) ? firstProduct.price : Number.NEGATIVE_INFINITY;
  const secondPrice = Number.isFinite(secondProduct.price)
    ? secondProduct.price
    : Number.NEGATIVE_INFINITY;

  return secondPrice - firstPrice;
}

function compareNames(firstProduct, secondProduct) {
  return firstProduct.name.localeCompare(secondProduct.name, 'pl', {
    sensitivity: 'base',
  });
}
